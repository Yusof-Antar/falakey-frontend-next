"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { Type } from "@/models/type";
import { useDispatch, useSelector } from "react-redux";
import { search } from "@/lib/slices/searchSlice";
import type { RootState } from "@/types/RootState";
import { useTrans } from "@/utils/translation";
import { useNavigateWithLocale } from "@/helper/navigateWithLocale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

const MobileNavbarInputSearch = ({
  options,
  onClose,
}: {
  options: Type[];
  onClose: () => void;
}) => {
  const [category, setCategory] = useState<string>("photo");
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigateWithLocale();
  const dispatch = useDispatch();

  const { t } = useTrans();

  // Access previous search state from Redux store
  const prevSearchState = useSelector((state: RootState) => state.search);

  // Handle search logic
  const handleSearch = () => {
    if (!query.trim()) return;

    dispatch(
      search({
        types: category,
        search: query,
      }),
    );

    navigate(`/explore?types=${category}&search=${encodeURIComponent(query)}`);

    onClose();
  };

  return (
    <div className="w-full px-3  bg-white border rounded-lg">
      {/* Header with close button */}
      <div className=" flex items-center justify-between gap-3 ">
        <div className="flex-1 flex items-center gap-1">
          {/* Category Selector */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-fit h-10 gap-1 border-none font-bold shadow-none bg-transparent">
              <SelectValue placeholder="Photo" />
            </SelectTrigger>
            <SelectContent className="font-bold">
              {options.map((type) => (
                <SelectItem key={type.key} value={type.key}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search input field */}
          <input
            type="search"
            autoFocus
            enterKeyHint="search"
            className="flex-1 h-10 bg-transparent focus-visible:outline-none placeholder:font-semibold text-sm"
            placeholder={
              prevSearchState.placeholder || t("navbar.search_photo")
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                handleSearch();
              }
            }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl  flex-shrink-0"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <button
          className="text-gray-400 hover:text-gray-600 text-xl  flex-shrink-0"
          onClick={handleSearch}
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </div>
  );
};

export default MobileNavbarInputSearch;
