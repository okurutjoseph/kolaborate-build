import { mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

async function requireUser(ctx: MutationCtx | QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkSubject", (q) =>
      q.eq("clerkSubject", identity.subject)
    )
    .unique();
  if (!user) throw new Error("User record missing");
  return user;
}

function normalizeSkill(s: string) {
  return s.trim().toLowerCase();
}

function computeScore(required: string[], freelancer: string[]) {
  const req = new Set(required.map(normalizeSkill).filter(Boolean));
  const fr = new Set(freelancer.map(normalizeSkill).filter(Boolean));
  if (req.size === 0) return { score: 0, overlap: [] as string[] };
  const overlap: string[] = [];
  for (const r of req) if (fr.has(r)) overlap.push(r);
  const score = Math.round((overlap.length / req.size) * 100);
  return { score, overlap };
}

export const createProjectFromAnalysis = mutation({
  args: {
    title: v.string(),
    rawBrief: v.string(),
    refinedBrief: v.string(),
    extractedSkills: v.array(v.string()),
    deliverables: v.array(v.string()),
    seniority: v.optional(v.string()),
    budgetMin: v.optional(v.number()),
    budgetMax: v.optional(v.number()),
    timeline: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    if (user.role !== "client") throw new Error("Only clients can create projects");

    const now = Date.now();
    const projectId = await ctx.db.insert("projects", {
      clientUserId: user._id,
      title: args.title,
      rawBrief: args.rawBrief,
      refinedBrief: args.refinedBrief,
      budgetMin: args.budgetMin,
      budgetMax: args.budgetMax,
      timeline: args.timeline,
      status: "open",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("projectRequirements", {
      projectId,
      extractedSkills: args.extractedSkills,
      seniority: args.seniority,
      deliverables: args.deliverables,
      createdAt: now,
      updatedAt: now,
    });

    // Deterministic matching (MVP):
    // - skill overlap between extractedSkills and freelancer profile skills
    // - store top results with transparent reasons
    const freelancers = await ctx.db.query("freelancerProfiles").take(200);
    const scored = freelancers
      .map((fp) => {
        const { score, overlap } = computeScore(args.extractedSkills, fp.skills);
        const reasons: string[] = [];
        if (overlap.length > 0) {
          reasons.push(`Skill overlap: ${overlap.slice(0, 5).join(", ")}`);
        }
        if (fp.hourlyRateMin !== undefined && fp.hourlyRateMax !== undefined) {
          reasons.push(`Rate range: $${fp.hourlyRateMin}–$${fp.hourlyRateMax}/hr`);
        }
        if (fp.availabilityHoursPerWeek !== undefined) {
          reasons.push(`Availability: ${fp.availabilityHoursPerWeek}h/week`);
        }
        return { fp, score, reasons };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    for (const m of scored) {
      if (m.score <= 0) continue;
      const freelancerUserId = m.fp.userId;
      await ctx.db.insert("matches", {
        projectId,
        freelancerUserId,
        score: m.score,
        reasons: m.reasons,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { projectId };
  },
});

export const listMyProjects = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    if (user.role !== "client") return [];
    return await ctx.db
      .query("projects")
      .withIndex("by_clientUserId", (q) => q.eq("clientUserId", user._id))
      .order("desc")
      .take(50);
  },
});

