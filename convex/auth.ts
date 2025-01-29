import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel, Id } from "./_generated/dataModel";

export const CustomPassword = Password<DataModel>({
  profile(params) {
    return {
      name: params.name as string,
      email: params.email as string,
      image: "",
      bio: "",
      location: "",
      customImage: "",
      uploadedImageStorageId: params.uploadedImageStorageId as
        | Id<"_storage">
        | undefined,
      uploadedImageUrl: params.uploadedImageUrl as string | undefined,
      role: "user", // Default role
      imagePreference: "convex", // Default image preference
      instagram: "",
      website: "",

      // Boolean fields initialized to false
      showEmail: false,
      showInstagram: false,
      showWebsite: false,
      showFollowers: false,
      showFollowing: false,
      showPosts: false,
      showSavedPosts: false,
      showLikedPosts: false,
      showLocation: false,
      showBio: false,
      showJoinedAt: false,
      showLastActive: false,

      // User counts initialized to zero
      followersCount: 0,
      followingCount: 0,
      blogsCount: 0,
      likedBlogsCount: 0,
      savedBlogsCount: 0,

      // Message-related fields
      unreadMessages: 0,
      lastActive: new Date().toISOString(),

      // Message privacy setting
      messagePrivacy: "everyone",

      // Arrays for following and blogs
      followingUsers: [],
      followedUser: [],

      // Blog-related arrays
    };
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [CustomPassword],
});
