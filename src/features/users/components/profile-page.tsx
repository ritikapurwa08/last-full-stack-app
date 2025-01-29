"use client";

import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { useCurrentUserHook, useUserById } from "../query/user-query-hooks";
import {
  AddUserDetails,
  FollowButton,
  FollowerButton,
  FollowingButton,
  SettingDialog,
  ShowPostSection,
  ShowUserDetails,
} from "./user-mutation-comps";
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
    bio,
    location,
    instagram,
    website,
    customImage,
    followersCount,
    followingCount,
    imagePreference,
    uploadedImageUrl,
    showEmail,
    showInstagram,
    showWebsite,
    showFollowers,
    showFollowing,
    showPosts,
    showSavedPosts,
    showLikedPosts,
    showLocation,
    showBio,
    showJoinedAt,
    showLastActive,
    lastActive,
    email,
    _creationTime,
  } = user;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="space-y-4">
        <div className="flex flex-col justify-center w-fit px-2 space-y-2">
          <UserImageDialog
            customImage={customImage}
            userId={_id}
            uploadedImageUrl={uploadedImageUrl}
            uploadedImageStorageId={uploadedImageStorageId}
            imagePreference={imagePreference}
          />
          <span className="text-center">{name}</span>
        </div>

        <div className="flex flex-row space-x-4">
          <FollowButton anotherUserId={_id} userId={currentUserId} />
          <FollowingButton userId={_id} followingCount={followingCount} />
          <FollowerButton userId={_id} followersCount={followersCount} />
        </div>

        {/* Add more user details as needed */}

        <div>
          <SettingDialog
            userId={_id}
            showEmail={showEmail}
            showInstagram={showInstagram}
            showWebsite={showWebsite}
            showFollowers={showFollowers}
            showFollowing={showFollowing}
            showPosts={showPosts}
            showSavedPosts={showSavedPosts}
            showLikedPosts={showLikedPosts}
            showLocation={showLocation}
            showBio={showBio}
            showJoinedAt={showJoinedAt}
            showLastActive={showLastActive}
          />
        </div>

        <div>
          <AddUserDetails
            userId={_id}
            name={name}
            bio={bio}
            location={location}
            instagram={instagram}
            website={website}
          />
        </div>

        <div>
          <ShowUserDetails
            userId={_id}
            showEmail={showEmail}
            showInstagram={showInstagram}
            showWebsite={showWebsite}
            showBio={showBio}
            showJoinedAt={showJoinedAt}
            showLastActive={showLastActive}
            lastActive={lastActive}
            email={email}
            instagram={instagram}
            website={website}
            location={location}
            bio={bio}
            joinedAt={_creationTime}
          />
        </div>
        <div>
          <ShowPostSection userId={_id} />
        </div>
      </div>
    </div>
  );
};
