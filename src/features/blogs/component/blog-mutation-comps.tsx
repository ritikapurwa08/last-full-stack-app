"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useCreateBlogHook,
  useCreateCommentHook,
  useLikeBlogHook,
  useLikeCommentHook,
  useRemoveBlogHook,
  useRemoveCommentHook,
  useRemoveLikeBlogHook,
  useRemoveLikeCommentHook,
  useRemoveSaveBlogHook,
  useSaveBlogHook,
  useUpdateBlogHook,
  useUpdateCommentHook,
} from "../mutation/blog-mutation";
import CustomInput from "@/features/form/custom-input";
import { useToast } from "@/hooks/use-toast";
import CustomTagsInput from "@/features/form/custom-tag-input";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import {
  BookmarkIcon,
  Edit,
  Heart,
  HeartIcon,
  Loader2Icon,
  MessageCircle,
  MoreVertical,
  Reply,
  Trash,
} from "lucide-react";
import {
  CustomCommentsDataType,
  useIsAlreadyLikedBlog,
  useIsAlreadyLikedComment,
  useIsAlreadySavedBlog,
  useIsOwnerOfComment,
  usePaginatedComments,
} from "../queries/blog-query-hooks";
import { cn } from "@/lib/utils";
import UnsplashImageInput from "@/features/form/unsplash-image-input";
import { blogCustomImageObject } from "../constants";
import Image from "next/image";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

interface CustomDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
  trigger: React.ReactNode;
  dialogTitle: string;
  dialogDescription: string;
  dialogFooter: React.ReactNode;
}
type CommentCardProps = {
  comments: CustomCommentsDataType;
  onDelete: () => void;
  onEdit: () => void;
  isEditing: boolean;
  editedContent: string;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditContent: (content: string) => void;
};
type BlogFormData = z.infer<typeof blogSchema>;
interface CreateBlogFormProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const blogSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title cannot exceed 50 characters"),
  content: z
    .string()
    .min(100, "Content must be at least 100 characters")
    .max(5000, "Content cannot exceed 5000 characters"),
  customImage: z.string().url("Please enter a valid image URL").optional(),
  tags: z.array(z.string()).min(1, "At least one tag is required").optional(),
});

const CustomDialog: React.FC<CustomDialogProps> = ({
  open,
  setOpen,
  children,
  trigger: Trigger,
  dialogTitle,
  dialogDescription,
  dialogFooter,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        {children}
        {dialogFooter}
      </DialogContent>
    </Dialog>
  );
};
const CreateBlogForm = ({ setOpen }: CreateBlogFormProps) => {
  const { toast } = useToast();

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
      customImage: "",

      tags: [],
    },
  });

  const { mutate, isPending } = useCreateBlogHook();

  const handleCreateBlog = async (data: BlogFormData) => {
    try {
      await mutate(
        {
          ...data,
          customImage: data.customImage || "",
          tags: data.tags || [],
        },
        {
          onSuccess: () => {
            toast({
              title: "Success!",
              description: "Your blog post has been created successfully.",
              variant: "default",
            });
            form.reset();
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: error.message || "Failed to create blog post",
              variant: "destructive",
            });
          },
          onSettled: () => {
            setOpen(false);
          },
        }
      );
    } catch (error) {
      console.error("Blog creation error:", error);
    }
  };

  return {
    form,
    handleCreateBlog,
    isPending,
  };
};
export const CreateBlogDialog: React.FC = () => {
  const [open, setOpen] = useState(false);

  const { form, handleCreateBlog, isPending } = CreateBlogForm({
    open,
    setOpen,
  });

  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      trigger={
        <Button type="button" variant="default">
          Create New Blog
        </Button>
      }
      dialogTitle="Create New Blog Post"
      dialogDescription="Share your thoughts with the world. Fill in the details below to create your blog post."
      dialogFooter={
        <div className="flex justify-end gap-4 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-blog-form"
            disabled={isPending}
            className="min-w-[100px]"
          >
            {isPending ? "Creating..." : "Create Post"}
          </Button>
        </div>
      }
    >
      <Form {...form}>
        <form
          id="create-blog-form"
          onSubmit={form.handleSubmit(handleCreateBlog)}
          className="space-y-4 mt-4"
        >
          <CustomInput
            control={form.control}
            name="title"
            label="Title"
            placeholder="Enter your blog title"
          />
          <CustomInput
            control={form.control}
            name="content"
            label="Content"
            placeholder="Write your blog content here..."
          />
          <UnsplashImageInput
            control={form.control}
            name="customImage"
            label="select Cover Image"
            images={blogCustomImageObject}
          />
          <CustomTagsInput control={form.control} name="tags" label="Tages" />
        </form>
      </Form>
    </CustomDialog>
  );
};
export const UpdateBlogDialog = ({ blog }: { blog: Doc<"blogs"> }) => {
  const { mutate: updateBlog, isPending } = useUpdateBlogHook();
  const [open, setOpen] = useState(false);

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: blog.title,
      content: blog.content,
      customImage: blog.customImage,
      tags: blog.tags,
    },
  });

  const handleUpdateBlog = async (values: {
    title: string;
    content: string;
    customImage?: string;
    tags?: string[];
  }) => {
    try {
      await updateBlog({
        blogId: blog._id,
        ...values,
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to update blog:", error);
    }
  };

  return (
    <CustomDialog
      open={open}
      trigger={
        <Button type="button" variant="default">
          update
        </Button>
      }
      setOpen={setOpen}
      dialogTitle="Update Blog Post"
      dialogDescription="Update your blog post details below."
      dialogFooter={
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="update-blog-form"
            disabled={isPending}
            className="min-w-[100px]"
          >
            {isPending ? "Updating..." : "Update Post"}
          </Button>
        </div>
      }
    >
      <Form {...form}>
        <form
          id="update-blog-form"
          onSubmit={form.handleSubmit(handleUpdateBlog)}
          className="space-y-4 mt-4"
        >
          <CustomInput
            control={form.control}
            name="title"
            label="Title"
            placeholder="Enter your blog title"
          />
          <CustomInput
            control={form.control}
            name="content"
            label="Content"
            placeholder="Write your blog content here..."
          />
          <CustomInput
            control={form.control}
            name="customImage"
            label="Cover Image URL"
            placeholder="https://example.com/image.jpg"
          />
          <CustomTagsInput control={form.control} name="tags" label="Tags" />
        </form>
      </Form>
    </CustomDialog>
  );
};
export const RemoveBlogDialog = ({ blog }: { blog: Doc<"blogs"> }) => {
  const { mutate: removeBlog, isPending } = useRemoveBlogHook();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleRemoveBlog = async () => {
    try {
      await removeBlog(
        {
          blogId: blog._id,
        },
        {
          onSuccess() {
            toast({
              title: "Success",
              description: "Blog post removed successfully",
              variant: "default",
            });
          },
          onError(error) {
            toast({
              title: "Error",
              description: error.message || "Failed to remove blog post",
              variant: "destructive",
            });
          },
        }
      );
      setOpen(false);
    } catch (error) {
      console.error("Failed to update blog:", error);
    }
  };

  return (
    <CustomDialog
      open={open}
      trigger={
        <Button type="button" variant="default">
          Remove
        </Button>
      }
      setOpen={setOpen}
      dialogTitle="Remove Blog Post"
      dialogDescription="Are you sure you want to remove this blog post?"
      dialogFooter={
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="remove-blog-form"
            disabled={isPending}
            onClick={handleRemoveBlog}
            className="min-w-[100px]"
          >
            {isPending ? "Removing..." : "Remove Post"}
          </Button>
        </div>
      }
    >
      <p>Are you sure you want to remove this blog post?</p>
    </CustomDialog>
  );
};

export const LikeBlogButton = ({ blog }: { blog: Doc<"blogs"> }) => {
  const isAlreadyLiked = useIsAlreadyLikedBlog(blog._id);
  const { mutate: likeBlog, isPending } = useLikeBlogHook();
  const { mutate: removeLike, isPending: isRemovePending } =
    useRemoveLikeBlogHook();
  const { toast } = useToast();
  const handleLikeClick = async () => {
    try {
      if (isAlreadyLiked) {
        await removeLike({ blogId: blog._id });
      } else {
        await likeBlog({ blogId: blog._id });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `${error}Failed to update like status`,
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleLikeClick}
      disabled={isPending || isRemovePending}
      className={cn(
        "flex items-center gap-2 transition-colors",
        isAlreadyLiked
          ? "text-red-500 hover:text-red-600"
          : "hover:text-red-500"
      )}
    >
      <HeartIcon
        className={cn(
          "w-5 h-5 transition-all",
          isAlreadyLiked ? "fill-current" : "fill-none",
          isPending || isRemovePending ? "animate-pulse" : ""
        )}
      />
      <span>{blog.likesCount}</span>
    </Button>
  );
};
export const SaveBlogButton = ({ blog }: { blog: Doc<"blogs"> }) => {
  const isAlreadySaved = useIsAlreadySavedBlog(blog._id);
  const { mutate: likeBlog, isPending } = useSaveBlogHook();
  const { mutate: removeLike, isPending: isRemovePending } =
    useRemoveSaveBlogHook();
  const { toast } = useToast();
  const handleLikeClick = async () => {
    try {
      if (isAlreadySaved) {
        await removeLike({ blogId: blog._id });
      } else {
        await likeBlog({ blogId: blog._id });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleLikeClick}
      disabled={isPending || isRemovePending}
      className={cn(
        "flex items-center gap-2 transition-colors",
        isAlreadySaved
          ? "text-blue-500 hover:text-blue-600"
          : "hover:text-blue-500"
      )}
    >
      <BookmarkIcon
        className={cn(
          "w-5 h-5 transition-all",
          isAlreadySaved ? "fill-current" : "fill-none",
          isPending || isRemovePending ? "animate-pulse" : ""
        )}
      />
      <span>{blog.likesCount}</span>
    </Button>
  );
};

export const CommentCard = ({
  comments,
  onDelete,
  onEdit,
  isEditing,
  editedContent,
  onSaveEdit,
  onCancelEdit,
  onEditContent,
}: CommentCardProps) => {
  const {
    _creationTime,
    _id,
    commentLikesCount,
    content,
    isCommentEdited,
    userImage,
    userName,
  } = comments;

  const isOwner = useIsOwnerOfComment(_id);
  const isAlreadyLiked = useIsAlreadyLikedComment(_id);
  const { mutate: likeComment, isPending: isLikePending } =
    useLikeCommentHook();
  const { mutate: removeLikeComment, isPending: isRemoveLikePending } =
    useRemoveLikeCommentHook();

  const formattedCreationTime = format(_creationTime, "MMM dd, yyyy");

  return (
    <Card className="w-full max-w-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center space-x-4">
        {userImage ? (
          <Image
            src={userImage}
            alt={userName}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <Image
            src="https://github.com/shadcn"
            alt="default-profile"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
        )}
        <div className="flex flex-col">
          <CardTitle className="text-lg font-semibold">{userName}</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            {formattedCreationTime} {isCommentEdited && "(Edited)"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-4">
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={(e) => onEditContent(e.target.value)}
            className="w-full p-2 border rounded-md text-sm resize-none"
            rows={2}
          />
        ) : (
          <p className="text-gray-700">{content}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center px-6 py-4 border-t">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              isAlreadyLiked
                ? removeLikeComment({ commentId: _id })
                : likeComment({ commentId: _id })
            }
            disabled={isLikePending || isRemoveLikePending}
          >
            <Heart
              className={`w-4 h-4 ${isAlreadyLiked ? "text-red-500 fill-red-500" : "text-gray-500"}`}
            />
            <span className="ml-2">{commentLikesCount}</span>
          </Button>
          <Button variant="ghost" size="sm">
            <Reply className="w-4 h-4 text-gray-500" />
            <span className="ml-2">Reply</span>
          </Button>
        </div>
        {isOwner && (
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button variant="ghost" size="sm" onClick={onSaveEdit}>
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={onCancelEdit}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  <Edit className="w-4 h-4 text-gray-500" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onDelete}>
                  <Trash className="w-4 h-4 text-red-500" />
                </Button>
              </>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
export const CreateCommentButton = ({ blogId }: { blogId: Id<"blogs"> }) => {
  const { mutate: createComment, isPending: isCreatePending } =
    useCreateCommentHook();
  const [newComment, setNewComment] = useState(""); // State for new comment input
  const [isCommentPopoverOpen, setIsCommentPopoverOpen] = useState(false); // State to control the comment Popover
  const { toast } = useToast();

  // Handle comment creation
  const handleCreateComment = () => {
    if (!newComment.trim()) return; // Prevent empty comments
    createComment(
      { content: newComment, blogId },
      {
        onSuccess: () => {
          setNewComment(""); // Clear input after successful creation
          setIsCommentPopoverOpen(false); // Close the comment Popover
          toast({
            title: "Success",
            description: "Comment created successfully",
            variant: "default",
          });
        },
        onError(error) {
          toast({
            title: "Error",
            description: error.message || "Failed to create comment",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="mb-4">
      <Popover
        open={isCommentPopoverOpen}
        onOpenChange={setIsCommentPopoverOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Add a Comment
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded-md text-sm resize-none"
            rows={4}
          />
          <Button
            onClick={handleCreateComment}
            disabled={isCreatePending || !newComment.trim()}
            className="mt-2 w-full"
            size="sm"
          >
            {isCreatePending ? "Posting..." : "Post Comment"}
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
export const SeeBlogComments = ({ blogId }: { blogId: Id<"blogs"> }) => {
  const { hasMore, isLoading, loadMore, results } = usePaginatedComments(
    "getPaginatedComments",
    { blogId }
  );
  const { mutate: updateComment, isPending: isUpdatePending } =
    useUpdateCommentHook();
  const { mutate: removeComment, isPending: isRemovePending } =
    useRemoveCommentHook();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null); // Track which comment is being edited
  const [editedContent, setEditedContent] = useState(""); // State for edited comment content
  const { toast } = useToast();

  // Handle comment update
  const handleUpdateComment = (commentId: Id<"comments">) => {
    if (!editedContent.trim()) return; // Prevent empty updates
    updateComment(
      { commentId, content: editedContent },
      {
        onSuccess: () => {
          setEditingCommentId(null); // Exit edit mode
          setEditedContent(""); // Clear edited content
          toast({
            title: "Success",
            description: "Comment updated successfully",
            variant: "default",
          });
        },
        onError(error) {
          toast({
            title: "Error",
            description: error.message || "Failed to update comment",
            variant: "destructive",
          });
        },
      }
    );
  };

  // Handle comment deletion
  const handleDeleteComment = (commentId: Id<"comments">) => {
    removeComment(
      { commentId },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Comment deleted successfully",
            variant: "default",
          });
        },
        onError(error) {
          toast({
            title: "Error",
            description: error.message || "Failed to delete comment",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          View Comments
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4">
        <ScrollArea className="h-[400px] w-full">
          <div className="space-y-4">
            {results.map((comment) => (
              <div key={comment._id} className="relative">
                <CommentCard
                  comments={comment}
                  onDelete={() => handleDeleteComment(comment._id)}
                  onEdit={() => {
                    setEditingCommentId(comment._id);
                    setEditedContent(comment.content);
                  }}
                  isEditing={editingCommentId === comment._id}
                  editedContent={editedContent}
                  onSaveEdit={() => handleUpdateComment(comment._id)}
                  onCancelEdit={() => setEditingCommentId(null)}
                  onEditContent={(content) => setEditedContent(content)}
                />

                {/* Popover for additional actions */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 p-1 h-6 w-6"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-2">
                    <div className="flex flex-col space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCommentId(comment._id);
                          setEditedContent(comment.content);
                        }}
                        className="justify-start"
                      >
                        {isUpdatePending ? (
                          <span>
                            <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                            Updating...
                          </span>
                        ) : (
                          <span>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </span>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment._id)}
                        className="justify-start text-red-500 hover:text-red-600"
                      >
                        {isRemovePending ? (
                          <span>
                            <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                          </span>
                        ) : (
                          <span>
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </span>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Handle reply functionality
                        }}
                        className="justify-start"
                      >
                        <Reply className="h-4 w-4 mr-2" />
                        Reply
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-center p-4">
                <Loader2Icon className="h-6 w-6 animate-spin" />
              </div>
            )}

            {/* Load More Button */}
            {hasMore && !isLoading && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadMore(5)} // Load 5 more comments
                  disabled={isLoading}
                >
                  Load More
                </Button>
              </div>
            )}

            {/* No More Comments */}
            {!hasMore && !isLoading && (
              <div className="text-center text-sm text-muted-foreground p-4">
                No more comments to load.
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
