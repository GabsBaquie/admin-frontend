export type Notification = {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  createdAt: Date;
  read: boolean;
};
