export type RecommendationType =
  | 'gemstone'
  | 'tarot'
  | 'consultation'
  | 'article'
  | 'promotion'
  | 'panchang';

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  subtitle?: string;
}

export type MessageStatus = 'sending' | 'sent' | 'failed';

export interface ReplyPreview {
  id: string;
  text: string;
  authorLabel: string;
}

interface BaseMessage {
  id: string;
  timestamp: number;
  replyTo?: ReplyPreview;
}

export interface SystemMessage extends BaseMessage {
  type: 'system';
  text: string;
}

export interface UserMessage extends BaseMessage {
  type: 'user';
  text: string;
  status?: MessageStatus;
}

export interface AiFeedback {
  liked?: boolean;
  disliked?: boolean;
  chips?: string[];
}

export interface AiMessage extends BaseMessage {
  type: 'ai';
  text: string;
  recommendations?: Recommendation[];
  feedback?: AiFeedback;
}

export interface HumanMessage extends BaseMessage {
  type: 'human';
  text: string;
}

export type Message = SystemMessage | UserMessage | AiMessage | HumanMessage;

export const FEEDBACK_CHIPS = [
  'Inaccurate',
  'Too Generic',
  "Didn't Help",
  'Too Long',
] as const;

export type FeedbackChip = (typeof FEEDBACK_CHIPS)[number];
