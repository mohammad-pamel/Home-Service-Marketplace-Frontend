
"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Upload, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUploadMyProfileImage } from "@/hooks/customer.hook";
import { useUploadProviderProfileImage } from "@/hooks/provider.hook";

type ProfileImageUploadProps = {
  imageUrl?: string | null;
  userType: "customer" | "provider";
};

export default function ProfileImageUpload({
  imageUrl,
  userType,
}: ProfileImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const customerUpload = useUploadMyProfileImage();
  const providerUpload = useUploadProviderProfileImage();

  const uploadMutation =
    userType === "provider" ? providerUpload : customerUpload;

  // Create and clean up image preview URL
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  function handleFileChange(file?: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      uploadMutation.reset();
      return;
    }

    uploadMutation.reset();
    setSelectedFile(file);
  }

  function handleUpload() {
    if (!selectedFile) return;

    uploadMutation.mutate(selectedFile, {
      onSuccess: () => {
        setSelectedFile(null);
      },
    });
  }

  const currentImage = previewUrl || imageUrl;

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-muted/20 p-5 sm:flex-row sm:items-center">
      {/* Image Preview */}
      <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
        {currentImage ? (
          <img
            src={currentImage}
            alt="Profile preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <UserRound className="size-12 text-muted-foreground" />
        )}
      </div>

      {/* Upload Controls */}
      <div className="min-w-0 flex-1 space-y-3">
        <div>
          <h3 className="font-semibold">Profile Picture</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a profile picture and upload it to your account.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border bg-background px-3 text-sm font-medium transition hover:bg-muted">
            <ImagePlus className="size-4" />
            Choose Image

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                handleFileChange(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>

          <Button
            type="button"
            size="sm"
            onClick={handleUpload}
            disabled={!selectedFile || uploadMutation.isPending}
          >
            <Upload className="mr-2 size-4" />
            {uploadMutation.isPending ? "Uploading..." : "Upload Image"}
          </Button>
        </div>

        {selectedFile && (
          <p className="break-all text-xs text-muted-foreground">
            Selected: {selectedFile.name}
          </p>
        )}

        {uploadMutation.isSuccess && (
          <p className="text-sm text-green-600">
            Profile image updated successfully.
          </p>
        )}

        {uploadMutation.isError && (
          <p className="text-sm text-destructive">
            {uploadMutation.error instanceof Error
              ? uploadMutation.error.message
              : "Image upload failed. Please try again."}
          </p>
        )}
      </div>
    </div>
  );
}
