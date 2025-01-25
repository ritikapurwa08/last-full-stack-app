import { CreateBlogDialog } from "@/features/blogs/component/blog-mutation-comps";
import { AllBlogSection } from "@/features/blogs/component/blog-page";
import React from "react";

const page = () => {
  return (
    <div className="py-20">
      <CreateBlogDialog />
      <AllBlogSection />
    </div>
  );
};

export default page;
