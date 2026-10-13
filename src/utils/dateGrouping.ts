import type { Message } from '../types/conversation';

export interface TimelineSeparator {
  kind: 'separator';
  id: string;
  label: string;
}

export interface TimelineMessage {
  kind: 'message';
  id: string;
  message: Message;
  isGrouped: boolean;
}

export type TimelineItem = TimelineSeparator | TimelineMessage;

const GROUP_WINDOW_MS = 2 * 60 * 1000;

function dayLabel(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  return date.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
}

function authorKey(message: Message): string {
  return message.type;
}

export function buildTimelineItems(messages: Message[]): TimelineItem[] {
  const items: TimelineItem[] = [];
  let lastLabel: string | null = null;
  let previous: Message | null = null;

  for (const message of messages) {
    const label = dayLabel(message.timestamp);
    if (label !== lastLabel) {
      items.push({ kind: 'separator', id: `sep-${message.id}`, label });
      lastLabel = label;
      previous = null;
    }

    const isGrouped =
      previous !== null &&
      authorKey(previous) === authorKey(message) &&
      message.timestamp - previous.timestamp < GROUP_WINDOW_MS;

    items.push({ kind: 'message', id: message.id, message, isGrouped });
    previous = message;
  }

  return items;
}
