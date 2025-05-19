"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  // This would normally use a pre-signed URL from your backend
  // For demo purposes, we're just using placeholder images
  const handleUpload = () => {
    setIsUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      const newImageUrl = `/placeholder.svg?height=200&width=200&text=Image ${value.length + 1}`;
      onChange([...value, newImageUrl]);
      setIsUploading(false);
    }, 1500);
  };

  const handleRemove = (index: number) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {value.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-md border bg-muted"
          >
            <Image
              src={url || "/placeholder.svg"}
              alt={`Uploaded image ${index + 1}`}
              fill
              className="rounded-md object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-1 top-1 h-6 w-6"
              onClick={() => handleRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="aspect-square flex flex-col items-center justify-center rounded-md border border-dashed"
          onClick={handleUpload}
          disabled={isUploading}
        >
          <Upload className="h-6 w-6 mb-2" />
          <span className="text-xs">
            {isUploading ? "Uploading..." : "Upload"}
          </span>
        </Button>
      </div>
    </div>
  );
}
