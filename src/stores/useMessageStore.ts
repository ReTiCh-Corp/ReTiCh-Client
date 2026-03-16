import { create } from 'zustand';

type MessageState = {};

export const useMessageStore = create<MessageState>()(() => ({}));
