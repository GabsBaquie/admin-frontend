"use client";

import { formatDate, formatTime, truncateText } from "@/app/utils/formatters";
import ImageDisplay from "../common/ImageDisplay";
import ImportanceBadge from "../common/ImportanceBadge";
import StatusBadge from "../common/StatusBadge";
import UrgencyBadge from "../common/UrgencyBadge";

export const ImageRenderer = ({
  src,
  alt,
  width = 60,
  height = 60,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}) => <ImageDisplay src={src || ""} alt={alt} width={width} height={height} />;

export const StatusRenderer = ({ value }: { value: boolean }) => (
  <StatusBadge isActive={value} />
);

export const ImportanceRenderer = ({ value }: { value: string }) => (
  <ImportanceBadge importance={value} />
);

export const UrgencyRenderer = ({ value }: { value: boolean }) => (
  <UrgencyBadge isUrgent={value} />
);

export const DateRenderer = ({ value }: { value: string | Date | null }) => {
  return formatDate(value);
};

export const TimeRenderer = ({ value }: { value: string }) => {
  return formatTime(value);
};

export const TextRenderer = ({
  value,
  maxLength = 50,
}: {
  value: string;
  maxLength?: number;
}) => {
  return truncateText(value, maxLength);
};

export const EmptyFieldRenderer = ({
  value,
  placeholder = "",
}: {
  value: string | null | undefined;
  placeholder?: string;
}) => {
  return value || placeholder;
};

export const ConcertsRenderer = ({
  concerts,
}: {
  concerts: Array<{ title: string }>;
}) => {
  if (Array.isArray(concerts) && concerts.length > 0) {
    return concerts.map((concert) => concert.title).join(", ");
  }
  return "Aucun concert";
};
