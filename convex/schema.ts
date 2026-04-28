import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkSubject: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    role: v.optional(v.union(v.literal("client"), v.literal("freelancer"))),
    onboardedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerkSubject", ["clerkSubject"])
    .index("by_role", ["role"]),

  clientProfiles: defineTable({
    userId: v.id("users"),
    companyName: v.optional(v.string()),
    displayName: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  freelancerProfiles: defineTable({
    userId: v.id("users"),
    title: v.optional(v.string()),
    bio: v.optional(v.string()),
    skills: v.array(v.string()),
    hourlyRateMin: v.optional(v.number()),
    hourlyRateMax: v.optional(v.number()),
    availabilityHoursPerWeek: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  projects: defineTable({
    clientUserId: v.id("users"),
    title: v.string(),
    rawBrief: v.string(),
    refinedBrief: v.optional(v.string()),
    budgetMin: v.optional(v.number()),
    budgetMax: v.optional(v.number()),
    timeline: v.optional(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("open"),
      v.literal("paused"),
      v.literal("closed")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clientUserId", ["clientUserId"])
    .index("by_status", ["status"]),

  projectRequirements: defineTable({
    projectId: v.id("projects"),
    extractedSkills: v.array(v.string()),
    seniority: v.optional(v.string()),
    deliverables: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_projectId", ["projectId"]),

  matches: defineTable({
    projectId: v.id("projects"),
    freelancerUserId: v.id("users"),
    score: v.number(),
    reasons: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_projectId", ["projectId"])
    .index("by_freelancerUserId", ["freelancerUserId"]),
});

