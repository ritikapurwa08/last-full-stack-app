"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Search, Image as ImageIcon } from "lucide-react";
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface UnsplashImage {
  id: string;
  name: string;
  url: string;
}

interface UnsplashImageInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  className?: string;
  error?: string;
  labelClassName?: string;
  images: UnsplashImage[];
}

export default function UnsplashImageInput<T extends FieldValues>({
  control,
  name,
  label,
  className,
  labelClassName,
  error,
  images: allImages,
}: UnsplashImageInputProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [filteredImages, setFilteredImages] =
    useState<UnsplashImage[]>(allImages);

  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control });

  const handleImageSelect = (image: UnsplashImage) => {
    field.onChange(image.url); // Update the form field value
    setOpen(false);
  };

  // Filter images based on search
  useEffect(() => {
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      const filtered = allImages.filter((image) =>
        image.name.toLowerCase().includes(searchLower)
      );
      setFilteredImages(filtered);
    } else {
      setFilteredImages(allImages);
    }
  }, [debouncedSearch, allImages]);

  return (
    <FormItem className={cn("flex flex-col gap-y-2", className)}>
      <FormLabel className={cn("text-sm font-medium", labelClassName)}>
        {label}
      </FormLabel>

      <FormControl>
        <div className="relative">
          {/* Show selected image */}
          {field.value && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
              <Image
                src={field.value}
                alt="Selected image"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Input field with button */}
          <div className="relative">
            <Input
              placeholder="Enter image URL"
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)} // Update the form field value
              className="pr-20 text-black" // Add padding for the button
            />
            <Button
              type="button"
              variant="outline"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setOpen(true)}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </FormControl>

      {/* Dialog for selecting images */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Cover Image</DialogTitle>
            <DialogDescription>
              Select an image from Unsplash to use as your cover image.
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search images..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 text-black"
            />
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-y-auto py-4">
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
        </DialogContent>
      </Dialog>

      {/* Error message */}
      <FormMessage className="text-xs text-red-600">
        {error ?? fieldError?.message}
      </FormMessage>
    </FormItem>
  );
}
