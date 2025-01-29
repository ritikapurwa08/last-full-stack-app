import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  useGenerateUploadUrlHook,
  useRemoveConvexStorageIdAndUrlHook,
  useRemoveCustomImageHook,
  useUpdateCustomImageHook,
  useUpdateImagePreferenceHook,
  useUploadUserImageHook,
} from "../users/mutation/user-mutation";

import { Search } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface UnsplashImage {
  id: string;
  name: string;
  url: string;
}

type UserImageDialogProps = {
  customImage: string;
  userId: Id<"users">;
  uploadedImageUrl?: string;
  uploadedImageStorageId?: Id<"_storage">;
  imagePreference: "convex" | "custom" | undefined;
};

export const UserImageDialog = ({
  customImage,
  userId,
  uploadedImageUrl,
  uploadedImageStorageId,
  imagePreference,
}: UserImageDialogProps) => {
  const { mutate: updateCustomImage, isPending: updatingCustomImage } =
    useUpdateCustomImageHook();
  const { mutate: removeCustomImage, isPending: removingCustomImage } =
    useRemoveCustomImageHook();
  const {
    mutate: removeConvexStorageIdAndUrl,
    isPending: isRemovingConvexStorageIdAndUrl,
  } = useRemoveConvexStorageIdAndUrlHook();
  const {
    mutate: updateImagePreference,
    isPending: isUpdatingImagePreference,
  } = useUpdateImagePreferenceHook();
  const { mutate: generateUploadUrl, isPending: generatingUploadUrl } =
    useGenerateUploadUrlHook();
  const { mutate: uploadUserImage, isPending: uploadingUserImage } =
    useUploadUserImageHook();
  const { toast } = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);
  const [preference, setPreference] = useState<"custom" | "convex">(
    imagePreference || "custom"
  );
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [filteredImages, setFilteredImages] = useState<UnsplashImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Memoize the list of images to prevent unnecessary re-renders
  const allImages: UnsplashImage[] = useMemo(
    () => [
      {
        id: "1",
        name: "Nature",
        url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      },
      {
        id: "2",
        name: "City",
        url: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      },
      {
        id: "3",
        name: "Mountains",
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      },
      {
        id: "4",
        name: "Profile 1",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      },
      {
        id: "5",
        name: "Profile 2",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      },
      {
        id: "6",
        name: "Profile 3",
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      },
      {
        id: "7",
        name: "Profile 4",
        url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      },
      {
        id: "8",
        name: "Profile 5",
        url: "https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      },
    ],
    []
  );

  // Filter images based on search
  useEffect(() => {
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      const filtered = allImages.filter((image) =>
        image.name.toLowerCase().includes(searchLower)
      );
      if (JSON.stringify(filtered) !== JSON.stringify(filteredImages)) {
        setFilteredImages(filtered);
      }
    } else {
      if (JSON.stringify(allImages) !== JSON.stringify(filteredImages)) {
        setFilteredImages(allImages);
      }
    }
  }, [debouncedSearch, allImages, filteredImages]);

  const handleImagePreferenceUpdate = useCallback(
    (newPreference: "custom" | "convex") => {
      updateImagePreference(
        { preference: newPreference },
        {
          onSuccess() {
            toast({
              title: "Success",
              description: "Image preference updated successfully",
              variant: "default",
            });
          },
          onError(error) {
            toast({
              title: "Error",
              description: error.message || "Failed to update image preference",
              variant: "destructive",
            });
          },
        }
      );
    },
    [updateImagePreference, toast]
  );

  const handleConvexStorageIdAndUrlRemove = useCallback(() => {
    removeConvexStorageIdAndUrl(
      { userId: userId },
      {
        onSuccess: () => {
          setLocalImageUrl(null);
          toast({
            title: "Success",
            description: "Image removed successfully",
            variant: "default",
          });
        },
        onError(error) {
          toast({
            title: "Error",
            description: error.message || "Failed to remove image",
            variant: "destructive",
          });
        },
      }
    );
  }, [removeConvexStorageIdAndUrl, userId, toast]);

  const handleImageSelect = useCallback(
    (image: UnsplashImage) => {
      updateCustomImage(
        { customImage: image.url, userId: userId },
        {
          onSuccess() {
            toast({
              title: "Success",
              description: "Custom image updated successfully",
            });
            setOpen(false);
          },
          onError(error) {
            toast({
              title: "Error",
              description: `Failed to update custom image ${error}`,
            });
          },
        }
      );
    },
    [updateCustomImage, toast, userId]
  );

  const handleRemoveCustomImage = useCallback(() => {
    removeCustomImage(
      { userId: userId },
      {
        onSuccess() {
          toast({
            title: "Success",
            description: "Custom image removed successfully",
          });
        },
        onError(error) {
          toast({
            title: "Error",
            description: `Failed to remove custom image ${error}`,
          });
        },
      }
    );
  }, [removeCustomImage, userId, toast]);

  const handleLocalImageUpload = useCallback(async () => {
    if (!selectedFile) return;

    try {
      const uploadUrl = await generateUploadUrl({});
      const response = await fetch(uploadUrl!, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const { storageId } = await response.json();
      await uploadUserImage({ imageStorageId: storageId });

      const imageUrlResponse = await fetch(
        `/api/getImageUrl?storageId=${storageId}`
      );
      const imageUrlData = await imageUrlResponse.json();
      setLocalImageUrl(imageUrlData);

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  }, [selectedFile, generateUploadUrl, uploadUserImage, toast]);

  useEffect(() => {
    if (uploadedImageUrl && preference === "convex") {
      setLocalImageUrl(uploadedImageUrl);
    } else {
      setLocalImageUrl(null);
    }
  }, [uploadedImageUrl, preference]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setLocalImageUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (!open && selectedFile) {
      setSelectedFile(null);
      setLocalImageUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open, selectedFile]);

  const displayImage = useMemo(() => {
    if (preference === "convex" && localImageUrl) {
      return localImageUrl;
    } else if (preference === "custom" && customImage) {
      return customImage;
    }
    return undefined;
  }, [preference, localImageUrl, customImage]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Avatar className="cursor-pointer hover:opacity-80 size-28 transition-opacity">
          <AvatarImage src={displayImage} alt="User Avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-[80vh]">
        <DialogHeader className="flex flex-row justify-between px-4">
          <div>
            <DialogTitle>Profile Image Settings</DialogTitle>
            <DialogDescription>
              Update or remove your profile image.
            </DialogDescription>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Switch
                id="image-preference"
                disabled={isUpdatingImagePreference}
                checked={preference === "convex"}
                onCheckedChange={(checked) => {
                  const newPreference = checked ? "convex" : "custom";
                  setPreference(newPreference);
                  handleImagePreferenceUpdate(newPreference);
                }}
              />
              <Label htmlFor="image-preference">
                {preference === "custom"
                  ? "show uploaded profile"
                  : "show default profile"}
              </Label>
            </div>
          </div>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-center">
            <Avatar className="w-24 h-24">
              <AvatarImage src={displayImage} alt="User Avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
          {/* upload local image */}
          <div className="py-2">
            <h3 className="text-lg font-semibold">Upload Local Image</h3>
            {!uploadedImageStorageId ? (
              <div className="flex flex-row items-center justify-center max-w-60 gap-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingUserImage || generatingUploadUrl}
                  className="w-full"
                >
                  {uploadingUserImage ||
                  generatingUploadUrl ||
                  updatingCustomImage
                    ? "Uploading..."
                    : localImageUrl
                      ? "Select Another Image"
                      : "Select Local Image"}
                </Button>
                {localImageUrl && (
                  <>
                    <div className="mt-2">
                      <Button
                        onClick={handleLocalImageUpload}
                        disabled={!selectedFile || uploadingUserImage}
                      >
                        Upload
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Button
                variant="destructive"
                onClick={handleConvexStorageIdAndUrlRemove}
                disabled={isRemovingConvexStorageIdAndUrl}
              >
                {isRemovingConvexStorageIdAndUrl
                  ? "Removing..."
                  : "Remove Uploaded Image"}
              </Button>
            )}
          </div>

          {/* Section for selecting a custom image */}
          <div className="py-2">
            <h3 className="text-lg font-semibold">Select Custom Image</h3>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search images..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 text-black"
              />
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-y-auto py-4 max-h-60">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square cursor-pointer group"
                  onClick={() => handleImageSelect(image)}
                  aria-label={`Select image: ${image.name}`}
                >
                  <Image
                    src={image.url}
                    alt={image.name}
                    fill
                    className="object-cover rounded-lg transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                    <span className="text-white text-sm text-center">
                      {image.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="destructive"
              onClick={handleRemoveCustomImage}
              disabled={removingCustomImage}
            >
              {removingCustomImage ? "Removing..." : "Remove Custom Image"}
            </Button>
          </div>

          {/* Section for uploading a local image */}

          <div className="flex justify-end space-x-2">
            <Button
              variant="destructive"
              onClick={handleConvexStorageIdAndUrlRemove}
              disabled={isRemovingConvexStorageIdAndUrl}
            >
              Remove Uploaded Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
