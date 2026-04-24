import type { authSlice } from "./slices/authSlice";
import type { searchSlice } from "./slices/searchSlice";
import type { transSlice } from "./slices/transSlice";

export type RootState = {
  auth: ReturnType<typeof authSlice>;
  search: ReturnType<typeof searchSlice>;
  translation: ReturnType<typeof transSlice>;
};
