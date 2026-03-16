import { create } from 'zustand';

interface MessageState {}

export const useMessageStore = create<MessageState>()(() => ({}));
