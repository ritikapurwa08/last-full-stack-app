import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    customImage: v.string(),
    uploadedImageStorageId: v.optional(v.id("_storage")),
    uploadedImageUrl: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("user"), v.literal("member")),
    imagePreference: v.union(v.literal("custom"), v.literal("convex")),
    instagram: v.string(),
    website: v.string(),
    // Boolean fields grouped together for easy access
    showEmail: v.boolean(),
    showInstagram: v.boolean(),
    showWebsite: v.boolean(),
    showFollowers: v.boolean(),
    showFollowing: v.boolean(),
    showPosts: v.boolean(),
    showSavedPosts: v.boolean(),
    showLikedPosts: v.boolean(),
    showLocation: v.boolean(),
    showBio: v.boolean(),
    showJoinedAt: v.boolean(),
    showLastActive: v.boolean(),
    // End of Boolean fields

    followingUsers: v.array(v.id("users")),
    followedUser: v.array(v.id("users")),
    followersCount: v.number(),
    followingCount: v.number(),

    blogsCount: v.number(),
    likedBlogsCount: v.number(),
    savedBlogsCount: v.number(),
    unreadMessages: v.number(),
    lastActive: v.string(),
    messagePrivacy: v.union(
      v.literal("everyone"),
      v.literal("followers"),
      v.literal("none")
    ),
  })
    .index("by_email", ["email"])
    .index("by_name", ["name"])
    .index("by_role", ["role"])
    .index("by_lastActive", ["lastActive"])
    .index("by_followersCount", ["followersCount"])
    .index("by_followingCount", ["followingCount"])
    .index("by_blogsCount", ["blogsCount"])
    .searchIndex("search_users", {
      searchField: "name",
      filterFields: ["email", "role", "location"],
    }),

  blogs: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    customImage: v.string(),
    uploadedImage: v.optional(v.string()),
    uploadedImageStorageId: v.optional(v.id("_storage")),
    updatedAt: v.optional(v.number()),
    likedBy: v.array(v.id("users")),
    savedBy: v.array(v.id("users")),
    comments: v.array(v.id("comments")),
    likesCount: v.number(),
    commentsCount: v.number(),
    savedCount: v.number(),
    isOwner: v.boolean(),
    tags: v.array(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_updatedAt", ["updatedAt"]),

  // Blog comments
  comments: defineTable({
    blogId: v.id("blogs"),
    userId: v.id("users"),
    content: v.string(),
    updatedAt: v.optional(v.number()),
    parentCommentId: v.optional(v.id("comments")), // For nested comments
    commentLikes: v.array(v.id("users")),
    commentLikesCount: v.number(),
    isCommentEdited: v.boolean(),
  })
    .index("by_blogId", ["blogId"])
    .index("by_userId", ["userId"])
    .index("by_parent", ["parentCommentId"]),

  // Comment interactions (likes)
  commentInteractions: defineTable({
    userId: v.id("users"),
    commentId: v.id("comments"),
    type: v.string(), // "like"
    createdAt: v.number(),
  })
    .index("by_commentId", ["commentId"])
    .index("by_userId", ["userId"]),

  // Chat rooms (for 1:1 or group chats)
  chatRooms: defineTable({
    name: v.optional(v.string()), // For group chats
    type: v.union(v.literal("direct"), v.literal("group")),
    participantIds: v.array(v.id("users")),
    lastMessageAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_participants", ["participantIds"])
    .index("by_lastMessageAt", ["lastMessageAt"]),

  // Messages
  messages: defineTable({
    chatRoomId: v.id("chatRooms"),
    senderId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    isEdited: v.boolean(),
    attachments: v.optional(v.array(v.string())),
    readBy: v.array(v.id("users")),
  })
    .index("by_chatRoom", ["chatRoomId"])
    .index("by_sender", ["senderId"])
    .index("by_createdAt", ["createdAt"]),

  // Message reactions
  messageReactions: defineTable({
    messageId: v.id("messages"),
    userId: v.id("users"),
    reaction: v.string(), // emoji or reaction type
    createdAt: v.number(),
  })
    .index("by_messageId", ["messageId"])
    .index("by_userId", ["userId"]),
});
