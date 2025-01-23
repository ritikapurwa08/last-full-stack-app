import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createBlog = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    customImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {},
});
