import { create } from 'zustand';
import type {
  AiFeedback,
  AiMessage,
  Message,
  Recommendation,
  ReplyPreview,
  UserMessage,
} from '../types/conversation';
import { MOCK_CONVERSATION } from '../data/mockConversation';
import { generateId } from '../utils/id';

export type ConversationStatus = 'loading' | 'ready' | 'error';

interface ConversationState {
  status: ConversationStatus;
  messages: Message[];
  replyTarget: ReplyPreview | null;

  loadConversation: (opts?: { forceError?: boolean }) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  retryMessage: (id: string) => Promise<void>;
  deleteMessage: (id: string) => void;
  setReplyTarget: (target: ReplyPreview | null) => void;
  setFeedback: (messageId: string, patch: Partial<AiFeedback>) => void;
}

function simulateDelivery(): Promise<'sent' | 'failed'> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.random() < 0.85 ? 'sent' : 'failed');
    }, 1200);
  });
}

// Canned AI responses used to demonstrate the recommendation framework reacting
// to new messages. The first template deliberately uses "panchang" — a
// recommendation type from the assignment's example list that was never part
// of the original mock JSON's "recommendation types" — to show the registry
// handling a type introduced after initial load, not just at seed time.
const CANNED_REPLY_TEMPLATES: {
  text: string;
  recs: { type: Recommendation['type']; title: string; subtitle?: string }[];
}[] = [
  {
    text: "Thank you for sharing that. Today's Panchang shows favorable timings worth noting.",
    recs: [{ type: 'panchang', title: "Today's Panchang", subtitle: 'Auspicious timings for today' }],
  },
  {
    text: 'Noted. The planetary alignment suggests a remedy may help balance this energy.',
    recs: [
      { type: 'gemstone', title: 'Yellow Sapphire', subtitle: 'Recommended for Jupiter' },
      { type: 'panchang', title: 'Weekly Panchang', subtitle: 'Plan around these dates' },
    ],
  },
  {
    text: "I see. Let's explore this further with a quick reading.",
    recs: [{ type: 'tarot', title: 'Guidance Tarot Reading' }],
  },
];

function buildCannedReply(index: number): { text: string; recommendations: Recommendation[] } {
  const template = CANNED_REPLY_TEMPLATES[index % CANNED_REPLY_TEMPLATES.length];
  return {
    text: template.text,
    recommendations: template.recs.map((r) => ({ ...r, id: generateId() })),
  };
}

export const useConversationStore = create<ConversationState>((set, get) => {
  async function appendCannedAiReply() {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 900));
    const aiReplyCount = get().messages.filter((m) => m.type === 'ai').length;
    const canned = buildCannedReply(aiReplyCount);
    const aiMessage: AiMessage = {
      id: generateId(),
      type: 'ai',
      text: canned.text,
      timestamp: Date.now(),
      recommendations: canned.recommendations,
    };
    set((state) => ({ messages: [...state.messages, aiMessage] }));
  }

  return {
    status: 'loading',
    messages: [],
    replyTarget: null,

    loadConversation: async (opts) => {
      set({ status: 'loading' });
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 900));

      if (opts?.forceError) {
        set({ status: 'error' });
        return;
      }

      set({ status: 'ready', messages: MOCK_CONVERSATION });
    },

    sendMessage: async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const { replyTarget } = get();
      const message: UserMessage = {
        id: generateId(),
        type: 'user',
        text: trimmed,
        timestamp: Date.now(),
        status: 'sending',
        replyTo: replyTarget ?? undefined,
      };

      set((state) => ({
        messages: [...state.messages, message],
        replyTarget: null,
      }));

      const outcome = await simulateDelivery();

      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === message.id && m.type === 'user' ? { ...m, status: outcome } : m
        ),
      }));

      if (outcome === 'sent') {
        await appendCannedAiReply();
      }
    },

    retryMessage: async (id: string) => {
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === id && m.type === 'user' ? { ...m, status: 'sending' } : m
        ),
      }));

      const outcome = await simulateDelivery();

      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === id && m.type === 'user' ? { ...m, status: outcome } : m
        ),
      }));

      if (outcome === 'sent') {
        await appendCannedAiReply();
      }
    },

    deleteMessage: (id: string) => {
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== id),
      }));
    },

    setReplyTarget: (target: ReplyPreview | null) => set({ replyTarget: target }),

    setFeedback: (messageId: string, patch: Partial<AiFeedback>) => {
      set((state) => ({
        messages: state.messages.map((m) => {
          if (m.id !== messageId || m.type !== 'ai') return m;
          const ai = m as AiMessage;
          return { ...ai, feedback: { ...ai.feedback, ...patch } };
        }),
      }));
    },
  };
});
