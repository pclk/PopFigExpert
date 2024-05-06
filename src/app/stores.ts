import {create} from 'zustand'

export const useUserInput = create<{
  userInput: string;
  setUserInput: (userInput: string) => void;
}>((set) => ({
  userInput: "",
  setUserInput: (userInput) => set({ userInput }),
}));


type articleSearchType = {
  title?: string;
  startDate?: string;
  endDate?: string;
  country?: string;
  content?: string;
}
export const useArticleSearch = create<{
 articleSearch: articleSearchType
  setArticleSearch: (articleSearch: articleSearchType) => void;
}>((set) => ({
  articleSearch: {
    title: "",
    startDate: "",
    endDate: "",
    country: "",
    content: "",
  },
  setArticleSearch: (articleSearch) => set({ articleSearch }),
}));


export const useProfileSearch = create<{
 profileSearch: string
  setProfileSearch: (profileSearch: string) => void;
}>((set) => ({
  profileSearch: "",
  setProfileSearch: (profileSearch) => set({ profileSearch }),
}));

