"use client";

import Image from "next/image";
import React from "react";

interface ImageCellProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

const ImageCell: React.FC<ImageCellProps> = ({
  src,
  alt,
  width = 50,
  height = 50,
}) => {
  if (!src) {
    return (
      <div className="flex justify-center items-center w-12 h-12 bg-gray-200 rounded">
        <span className="text-xs text-gray-500">No image</span>
      </div>
    );
  }

  return (
    <div className="overflow-hidden relative w-12 h-12 rounded">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover"
      />
    </div>
  );
};

export default ImageCell;
