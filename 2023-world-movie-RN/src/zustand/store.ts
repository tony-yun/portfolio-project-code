import { create } from "zustand";

interface CategoryState {
  category: string;
  setCategory: (newCategory: string) => void;
}
export const useCategoryStore = create<CategoryState>((set) => ({
  category: "now_playing",
  setCategory: (newCategory) => set({ category: newCategory }),
}));

interface SortState {
  sortOption: string;
  setSortOption: (newSortOption: string) => void;
}
export const useSortStore = create<SortState>((set) => ({
  sortOption: "date_desc",
  setSortOption: (newSortOption) => set({ sortOption: newSortOption }),
}));

interface ScrollState {
  scrollOption: string;
  setScrollOption: (newScrollOption: string) => void;
}
export const useScrollStore = create<ScrollState>((set) => ({
  scrollOption: "scroll_top",
  setScrollOption: (newScrollOption) => set({ scrollOption: newScrollOption }),
}));
