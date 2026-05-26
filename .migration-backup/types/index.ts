import { Notification } from '@prisma/client';

export type { Notification };

export type NotificationType =
  | 'prayer'
  | 'course'
  | 'comment'
  | 'movement'
  | 'donation'
  | 'worship'
  | 'sermon';
