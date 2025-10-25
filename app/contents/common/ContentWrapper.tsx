"use client";

import { Container } from "@mui/material";
import React from "react";

interface ContentWrapperProps {
  children: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({
  children,
  maxWidth = "lg",
}) => {
  return <Container maxWidth={maxWidth}>{children}</Container>;
};

export default ContentWrapper;
