import { query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";

async function requireUser(ctx: QueryCtx) {
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

export const listMyMatches = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    if (user.role !== "freelancer") return [];

    const matches = await ctx.db
      .query("matches")
      .withIndex("by_freelancerUserId", (q) =>
        q.eq("freelancerUserId", user._id)
      )
      .order("desc")
      .take(50);

    const results = await Promise.all(
      matches.map(async (m) => {
        const project = await ctx.db.get(m.projectId);
        return {
          ...m,
          project: project
            ? {
                _id: project._id,
                title: project.title,
                refinedBrief: project.refinedBrief ?? project.rawBrief,
                budgetMin: project.budgetMin,
                budgetMax: project.budgetMax,
                timeline: project.timeline,
              }
            : null,
        };
      })
    );

    return results.filter((r) => r.project !== null);
  },
});

