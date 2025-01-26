import React from "react";

import { Id } from "../../../../convex/_generated/dataModel";
import { ProfilePage } from "@/features/users/components/profile-page";

interface Props {
  params: {
    id: Id<"users">;
  };
}

const UserProfilePage = ({ params }: Props) => {
  return (
    <div>
      <ProfilePage userId={params.id} />
    </div>
  );
};

export default UserProfilePage;
