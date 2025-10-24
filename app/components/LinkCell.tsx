"use client";

import React from "react";

interface LinkCellProps {
  href: string;
  children?: React.ReactNode;
}

const LinkCell: React.FC<LinkCellProps> = ({ href, children }) => {
  if (!href) {
    return <span className="text-gray-500">-</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800 underline"
    >
      {children || href}
    </a>
  );
};

export default LinkCell;
