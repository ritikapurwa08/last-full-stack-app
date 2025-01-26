"use client";

import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { useCurrentUserHook, useUserById } from "../query/user-query-hooks";
import { FollowButton, FollowingButton } from "./user-mutation-comps";
import { UserImageDialog } from "@/features/other/image-upload-mutation";

export const ProfilePage = ({ userId }: { userId: Id<"users"> }) => {
  const { currentUser, isLoading: isCurrentUserLoading } = useCurrentUserHook();
  const { user, isLoading: isUserLoading } = useUserById({ userId });

  // Show loading state while fetching data
  if (isCurrentUserLoading || isUserLoading) {
    return <ProfilePageLoading />;
  }

  // Show error state if there's an error
  if (!user || !currentUser) {
    return <ProfilePageError />;
  }

  return <UserProfile user={user} currentUserId={currentUser._id} />;
};

const ProfilePageLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-xl font-semibold animate-pulse">
        Loading profile...
      </h1>
    </div>
  );
};

const ProfilePageError = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-xl font-semibold text-red-500">
        Oops! Something went wrong
      </h1>
    </div>
  );
};

const UserProfile = ({
  user,
  currentUserId,
}: {
  user: Doc<"users">;
  currentUserId: Id<"users">;
}) => {
  const {
    _id,
    uploadedImageStorageId,
    name,

    customImage,

    imagePreference,
    uploadedImageUrl,
  } = user;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">Name</h2>
          <p>{name}</p>
        </div>
        <div>
          <FollowButton anotherUserId={_id} userId={currentUserId} />
        </div>

        <div>
          <UserImageDialog
            customImage={customImage}
            userId={_id}
            uploadedImageUrl={uploadedImageUrl}
            uploadedImageStorageId={uploadedImageStorageId}
            imagePreference={imagePreference}
          />
        </div>
        <div>
          <FollowButton anotherUserId={_id} userId={currentUserId} />
        </div>
        <div>
          <FollowingButton userId={_id} />
        </div>

        {/* Add more user details as needed */}
      </div>
    </div>
  );
};
