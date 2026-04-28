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

export const getMyProfile = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    if (user.role !== "freelancer") return null;
    return await ctx.db
      .query("freelancerProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();
  },
});

export const upsertMyProfile = mutation({
  args: {
    title: v.optional(v.string()),
    bio: v.optional(v.string()),
    skills: v.array(v.string()),
    hourlyRateMin: v.optional(v.number()),
    hourlyRateMax: v.optional(v.number()),
    availabilityHoursPerWeek: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    if (user.role !== "freelancer") throw new Error("Only freelancers");

    const now = Date.now();
    const existing = await ctx.db
      .query("freelancerProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    if (!existing) {
      const id = await ctx.db.insert("freelancerProfiles", {
        userId: user._id,
        title: args.title,
        bio: args.bio,
        skills: args.skills,
        hourlyRateMin: args.hourlyRateMin,
        hourlyRateMax: args.hourlyRateMax,
        availabilityHoursPerWeek: args.availabilityHoursPerWeek,
        createdAt: now,
        updatedAt: now,
      });
      return { profileId: id, created: true };
    }

    await ctx.db.patch(existing._id, {
      title: args.title ?? existing.title,
      bio: args.bio ?? existing.bio,
      skills: args.skills,
      hourlyRateMin: args.hourlyRateMin,
      hourlyRateMax: args.hourlyRateMax,
      availabilityHoursPerWeek: args.availabilityHoursPerWeek,
      updatedAt: now,
    });
    return { profileId: existing._id, created: false };
  },
});

