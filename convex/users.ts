import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function requireIdentity(identity: Awaited<ReturnType<import("./_generated/server").MutationCtx["auth"]["getUserIdentity"]>>) {
  if (!identity) throw new Error("Unauthenticated");
  return identity;
}

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_clerkSubject", (q) => q.eq("clerkSubject", identity.subject))
      .unique();
  },
});

export const upsertFromClerk = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = requireIdentity(await ctx.auth.getUserIdentity());
    const now = Date.now();

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkSubject", (q) => q.eq("clerkSubject", identity.subject))
      .unique();

    const fallbackName =
      [identity.givenName, identity.familyName].filter(Boolean).join(" ") ||
      undefined;
    const name = identity.name ?? fallbackName;

    if (!existing) {
      const id = await ctx.db.insert("users", {
        clerkSubject: identity.subject,
        email: identity.email ?? undefined,
        name,
        imageUrl: identity.pictureUrl ?? undefined,
        createdAt: now,
        updatedAt: now,
      });
      return { userId: id, created: true };
    }

    await ctx.db.patch(existing._id, {
      email: identity.email ?? existing.email,
      name: name ?? existing.name,
      imageUrl: identity.pictureUrl ?? existing.imageUrl,
      updatedAt: now,
    });

    return { userId: existing._id, created: false };
  },
});

export const setRole = mutation({
  args: { role: v.union(v.literal("client"), v.literal("freelancer")) },
  handler: async (ctx, args) => {
    const identity = requireIdentity(await ctx.auth.getUserIdentity());
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkSubject", (q) => q.eq("clerkSubject", identity.subject))
      .unique();
    if (!user) throw new Error("User record missing");

    const now = Date.now();
    await ctx.db.patch(user._id, {
      role: args.role,
      onboardedAt: user.onboardedAt ?? now,
      updatedAt: now,
    });
    return { ok: true };
  },
});

