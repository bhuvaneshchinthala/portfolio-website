import { create } from 'zustand';

interface TransitionState {
    isTransitioning: boolean;
    targetSection: string | null;
    startTransition: (targetId: string) => void;
    endTransition: () => void;
}

export const useTransitionStore = create<TransitionState>((set) => ({
    isTransitioning: false,
    targetSection: null,
    startTransition: (targetId: string) => set({ isTransitioning: true, targetSection: targetId }),
    endTransition: () => set({ isTransitioning: false, targetSection: null }),
}));
