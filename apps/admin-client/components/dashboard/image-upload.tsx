"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import { adminService } from "@/lib/apiClient";
import { toast } from "sonner";
import axios from "axios";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type.", {
        description: "Please upload an image file.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large.", {
        description: "Please upload an image smaller than 5MB.",
      });
      return;
    }

    setIsUploading(true);

    try {
      const res = await adminService.getPresignedURL();
      // @ts-ignore
      const timestamp = res.data.timestamp;
      // @ts-ignore
      const signature = res.data.signature;

      const uploadURL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload?api_key=${process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY}&timestamp=${timestamp}&signature=${signature}`;

      const formdata = new FormData();
      formdata.append("file", file);

      const uploadResponse = await axios.post(uploadURL, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const imageUrl = uploadResponse.data.secure_url;
      // console.log("Image uploaded successfully:", imageUrl);

      onChange([...value, imageUrl]);
      toast.success("Image uploaded successfully.");
    } catch (error) {
      toast.error("Error uploading image.", {
        description: "Please try again later.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // const handleUpload = async () => {
  //   setIsUploading(true);

  //   setTimeout(() => {
  //     const newImageUrl = `/placeholder.svg?height=200&width=200&text=Image ${value.length + 1}`;
  //     onChange([...value, newImageUrl]);
  //     setIsUploading(false);
  //   }, 1500);
  // };

  const handleRemove = (index: number) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  // return (
  //   // <div className="space-y-4">
  //   //   <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
  //   //     {value.map((url, index) => (
  //   //       <div
  //   //         key={index}
  //   //         className="relative aspect-square rounded-md border bg-muted"
  //   //       >
  //   //         <Image
  //   //           src={url || "/placeholder.svg"}
  //   //           alt={`Uploaded image ${index + 1}`}
  //   //           fill
  //   //           className="rounded-md object-cover"
  //   //         />
  //   //         <Button
  //   //           type="button"
  //   //           variant="destructive"
  //   //           size="icon"
  //   //           className="absolute right-1 top-1 h-6 w-6"
  //   //           onClick={() => handleRemove(index)}
  //   //         >
  //   //           <X className="h-4 w-4" />
  //   //         </Button>
  //   //       </div>
  //   //     ))}
  //   //     <Button
  //   //       type="button"
  //   //       variant="outline"
  //   //       className="aspect-square flex flex-col items-center justify-center rounded-md border border-dashed"
  //   //       onClick={handleUploadClick}
  //   //       disabled={isUploading}
  //   //     >
  //   //       <Upload className="h-6 w-6 mb-2" />
  //   //       <span className="text-xs">
  //   //         {isUploading ? "Uploading..." : "Upload"}
  //   //       </span>
  //   //     </Button>
  //   //   </div>
  //   // </div>
  // );
  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {value.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-md border bg-muted"
          >
            <Image
              src={url}
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
          className="aspect-square h-full rounded-md border border-dashed"
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-6 w-6 mb-2" />
            <span className="text-xs">
              {isUploading ? "Uploading..." : "Upload"}
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
}
