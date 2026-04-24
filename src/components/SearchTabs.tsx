"use client";
import {
  usePathname,
  useNavigateWithLocale,
  useHomeHook,
} from "@/helper/homeHook";
import { search } from "@/lib/slices/searchSlice";
import type { RootState } from "@/types/RootState";
import { Tab, Tabs } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";

const SearchTabs = ({ onChangeAddons }: { onChangeAddons?: () => void }) => {
  // const navigate = useNavigateWithLocale();
  const { collection } = useParams();
  const dispatch = useDispatch();

  const { getHomeData, data } = useHomeHook();

  const previousearchData = useSelector((state: RootState) => state.search);
  const { local, dir } = useSelector((state: RootState) => state.translation);

  useEffect(() => {
    if (collection) {
      dispatch(
        search({
          ...previousearchData,
          search: "",
          collection: collection,
        }),
      );
    }
  }, [collection, dispatch, previousearchData]);

  useEffect(() => {
    getHomeData();
  }, [local]);

  return (
    <div className="lg:hidden block">
      <Tabs
        dir={dir}
        sx={{
          "& .MuiTabs-flexContainer": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          "& .MuiTab-root": {
            textTransform: "none",
            fontFamily: "HelveticaNeue, sans-serif",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#111111",
          },

          fontFamily: "HelveticaNeue, sans-serif",
        }}
        className="w-full mb-4 items-center justify-center border-b-2 border-gray-200 "
        value={
          data?.types.findIndex(
            (type) => type.key === previousearchData.types,
          ) ?? 0
        }
        variant="scrollable"
        scrollButtons="auto"
      >
        {/* Render the first three tabs */}
        {data?.types.map((type, index) => (
          <Tab
            key={index}
            className="whitespace-nowrap mr-4 text-sm  font-bold"
            sx={{
              color:
                type.key === previousearchData.types
                  ? "#111111 !important"
                  : "#6b7280",
              borderBottomColor:
                type.key === previousearchData.types
                  ? "#111111 !important"
                  : "#6b7280",
              fontWeight: 700,
            }}
            label={`${type.name}`}
            // disabled={type.key == "video"}
            onClick={() => {
              if (onChangeAddons) onChangeAddons();
              dispatch(
                search({
                  ...previousearchData,
                  types: type.key,
                  placeholder: type.search_placeholder,
                }),
              );
              const params = new URLSearchParams(window.location.search);
              params.set("types", type.key);

              const newUrl =
                window.location.pathname +
                "?" +
                params.toString() +
                window.location.hash;

              window.history.replaceState({}, "", newUrl);
            }}
          />
        ))}
        {/* 
        <Tab
          sx={{
            height: "15px",
            minHeight: "40px",
            minWidth: "2px",
            width: "2px",
            backgroundColor: "#e0e0e0",
            marginX: "4px",
            padding: "0px",
          }}
        />

        {data?.collections.map((cat, index) => (
          <Tab
            key={index}
            className="whitespace-nowrap mr-4 text-sm  font-bold"
            sx={{
              color: collection === cat.key ? "#111111 !important" : "#6b7280",
              borderBottomColor:
                collection === cat.key ? "#111111 !important" : "#6b7280",
              fontWeight: 700,
            }}
            label={cat.name}
            onClick={() => {
              dispatch(
                search({
                  ...previousearchData,
                  search: "",
                  collection: cat.key,
                })
              );
              navigate(`/collection/${cat.key}`);
            }}
          />
        ))}
        */}
      </Tabs>
    </div>
  );
};

export default SearchTabs;
