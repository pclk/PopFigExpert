import {create} from 'zustand'

export const useUserInput = create<{
  userInput: string;
  setUserInput: (userInput: string) => void;
}>((set) => ({
  userInput: "",
  setUserInput: (userInput) => set({ userInput }),
}));


export type articleSearchType = {
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

export type profileSearchType = {
  name?: string;
  country?: string;
  gender?: string;
  startDate?: string;
  endDate?: string;
}
export const useProfileSearch = create<{
 profileSearch: profileSearchType
  setProfileSearch: (profileSearch: profileSearchType) => void;
}>((set) => ({
  profileSearch: "",
  setProfileSearch: (profileSearch) => set({ profileSearch }),
}));

