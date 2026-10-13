import type { Message } from '../types/conversation';

// Base payload from the assignment spec, extended with synthetic timestamps
// (the spec payload has no timestamps) so date separators / grouping have
// something real to key off of.
const DAY_MS = 24 * 60 * 60 * 1000;
const now = Date.now();
const yesterday = now - DAY_MS;

export const MOCK_CONVERSATION: Message[] = [
  {
    id: '1',
    type: 'system',
    text: 'Your session with AI Astrologer has started.',
    timestamp: yesterday,
  },
  {
    id: '2',
    type: 'user',
    text: 'Can you tell me about my career this year?',
    timestamp: yesterday + 60_000,
    status: 'sent',
  },
  {
    id: '3',
    type: 'ai',
    text: 'I can already see a strong Saturn influence in your chart. Based on this, here are a few recommendations that may help you.',
    timestamp: yesterday + 120_000,
    recommendations: [
      {
        id: '1',
        type: 'gemstone',
        title: 'Blue Sapphire',
        subtitle: 'Recommended for Saturn',
      },
      {
        id: '2',
        type: 'tarot',
        title: 'Career Tarot Reading',
      },
      {
        id: '3',
        type: 'consultation',
        title: 'Talk to an Astrologer',
      },
      {
        id: '4',
        type: 'article',
        title: 'Understanding Saturn Mahadasha',
      },
    ],
  },
  {
    id: '4',
    type: 'human',
    text: 'I also recommend focusing on your upcoming Jupiter transit.',
    timestamp: now,
  },
];
