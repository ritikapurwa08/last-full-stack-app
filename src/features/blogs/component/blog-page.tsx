"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useGetAllPaginatedBlogs } from "../queries/blog-query-hooks";
import Image from "next/image";
import {
  CreateCommentButton,
  LikeBlogButton,
  RemoveBlogDialog,
  SaveBlogButton,
  SeeBlogComments,
  UpdateBlogDialog,
} from "./blog-mutation-comps";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
type Blog = Doc<"blogs">;

export const BlogCard = ({ blog }: { blog: Blog }) => {
  const formattedDate = format(new Date(blog._creationTime), "MMMM do, yyyy");
  const router = useRouter();
  const handleUserProfile = (path: Id<"users">) => {
    router.push(`/profile/${path}`);
  };
  return (
    <Card className="overflow-hidden min-w-full transition-all hover:shadow-lg">
      {/* User Profile and Name */}
      <div className="flex items-center p-4 border-b">
        <div
          onClick={() => handleUserProfile(blog.userId)}
          className="w-10 h-10 rounded-full overflow-hidden"
        >
          {blog.customImage && (
            <Image
              src={blog.customImage}
              width={40}
              height={40}
              alt={blog.title}
              className="object-cover"
            />
          )}
        </div>
        <div className="ml-3">
          <p className="font-semibold text-sm">{blog.title || "User"}</p>
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
        </div>
      </div>

      {/* Blog Image */}
      {blog.customImage && (
        <div className="w-full h-64 overflow-hidden">
          <Image
            height={400}
            width={400}
            src={blog.customImage}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Blog Content */}
      <CardContent className="p-4">
        <CardHeader className="px-0">
          <CardTitle className="text-xl font-bold hover:text-primary transition-colors">
            {blog.title}
          </CardTitle>
          <CardDescription className="mt-2 line-clamp-3 text-muted-foreground">
            {blog.content}
          </CardDescription>
        </CardHeader>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {blog.tags?.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>

      {/* Action Buttons (Like, Comment, Save) */}
      <CardFooter className="p-4 border-t">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-center gap-4">
            <LikeBlogButton blog={blog} />
            <span className="text-sm text-muted-foreground">
              {blog.likesCount} likes
            </span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <SaveBlogButton blog={blog} />
            <span className="text-sm text-muted-foreground">
              {blog.savedCount} saves
            </span>
          </div>
          <div className="flex flex-row items-start gap-4">
            <SeeBlogComments blogId={blog._id} />
            <span className="text-sm text-muted-foreground">
              <CreateCommentButton blogId={blog._id} />
              {blog.comments?.length} comments
            </span>
          </div>
        </div>
      </CardFooter>

      {/* Update and Remove Buttons */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-end gap-2">
          <UpdateBlogDialog blog={blog} />
          <RemoveBlogDialog blog={blog} />
        </div>
      </div>
    </Card>
  );
};

export const LoadingBlogCard = () => {
  return (
    <Card className="overflow-hidden min-w-full">
      {/* User Profile and Name */}
      <div className="flex items-center p-4 border-b">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="ml-3">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-3 w-[80px] mt-1" />
        </div>
      </div>

      {/* Blog Image */}
      <Skeleton className="w-full h-64" />

      {/* Blog Content */}
      <CardContent className="p-4">
        <CardHeader className="px-0">
          <CardTitle>
            <Skeleton className="h-6 w-full" />
          </CardTitle>
          <CardDescription className="mt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </CardDescription>
        </CardHeader>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardContent>

      {/* Action Buttons (Like, Comment, Save) */}
      <CardFooter className="p-4 border-t">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardFooter>

      {/* Update and Remove Buttons */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-end gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
    </Card>
  );
};

export default LoadingBlogCard;

export const BlogList = ({ blogs }: { blogs: Blog[] }) => {
  return (
    <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3  mx-auto w-full justify-center gap-4">
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
};

export const AllBlogSection = () => {
  const { results, status, loadMore, isLoading, hasMore } =
    useGetAllPaginatedBlogs();

  return (
    <section className="container py-8">
      <div className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold">Latest Blog Posts</h2>

        {status === "LoadingFirstPage" ? (
          <div className="flex justify-center">
            <span>Loading posts...</span>
          </div>
        ) : (
          <>
            <BlogList blogs={results} />

            {hasMore && (
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => loadMore(5)}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading more..." : "Load More Posts"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
