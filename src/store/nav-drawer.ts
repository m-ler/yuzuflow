import { create } from 'zustand';

type NavDrawerState = {
	open: boolean;
	setOpen: (value: boolean) => void;
	toggle: () => void;
};

export const navDrawerState = create<NavDrawerState>(set => ({
	open: false,
	setOpen: value => set({ open: value }),
	toggle: () => set(state => ({ open: !state.open })),
}));
