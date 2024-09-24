export type Notification = {
  id: number;
  name: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  createdAt: Date;
  read: boolean;
};
