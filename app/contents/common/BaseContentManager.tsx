"use client";

import { Column, Field } from "@/app/types/content";
import ContentManager from "../genericT/ContentManager";
import ContentWrapper from "./ContentWrapper";

interface BaseContentManagerProps<
  T extends { id: number; createdAt?: string },
  U
> {
  contentType: string;
  columns: Column<T>[];
  fields: Field<U>[];
  transformData?: (data: T) => U;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

const BaseContentManager = <
  T extends { id: number; createdAt?: string },
  U extends object
>({
  contentType,
  columns,
  fields,
  transformData,
  maxWidth = "lg",
}: BaseContentManagerProps<T, U>) => {
  return (
    <ContentWrapper maxWidth={maxWidth}>
      <ContentManager<T, U>
        contentType={contentType}
        columns={columns}
        fields={fields}
        transformData={transformData}
      />
    </ContentWrapper>
  );
};

export default BaseContentManager;
