"use client";
import { sortingVar } from "@/utils/defaultVariables";
import { createSlice } from "@reduxjs/toolkit";

// Function to extract URL parameters
const getInitialStateFromURL = () => {
  if (typeof window === "undefined") {
    return {
      types: "photo",
      placeholder: "",
      search: null,
      filter: {
        orientation: null,
        size: null,
        color: null,
      },
      sorting: sortingVar,
      collection: null,
      author: null,
    };
  }
  const params = new URLSearchParams(window.location.search);

  return {
    types: params.get("types") || "photo", // Default to "photo" if not in URL
    placeholder: "",
    search: params.get("search") || null,
    filter: {
      orientation: params.get("orientation") || null,
      size: params.get("size") || null,
      color: params.get("color") || null,
    },
    sorting: params.get("sorting") || sortingVar,
    collection: params.get("collection") || null,
    author: params.get("author") || null,
  };
};

const searchSlice = createSlice({
  name: "search",
  initialState: getInitialStateFromURL(), // Use extracted params as the initial state
  reducers: {
    search: (state, action) => {
      state.types = action.payload.types;
      state.placeholder = action.payload.placeholder;
      state.search = action.payload.search;
      state.filter = action.payload.filter;
      state.sorting = action.payload.sorting;
      state.collection = action.payload.collection;
      state.author = action.payload.author;
    },
    clear: (state) => {
      state.types = "photo";
      state.placeholder = "";
      state.search = null;
      state.filter = { orientation: null, size: null, color: null };
      state.sorting = sortingVar;
      state.collection = null;
      state.author = null;
    },
  },
});

export const { search, clear } = searchSlice.actions;
export default searchSlice.reducer;
