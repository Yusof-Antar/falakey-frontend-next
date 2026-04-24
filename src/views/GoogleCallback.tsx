"use client";
export const dynamic = "force-dynamic";

// src/GoogleCallback.js

import { login } from "@/lib/slices/authSlice";
import type { RootState } from "@/types/RootState";
import { useTrans } from "@/utils/translation";
import { useNavigateWithLocale } from "@/helper/navigateWithLocale";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

function GoogleCallback() {
  const searchParams = useSearchParams();
  const navigate = useNavigateWithLocale();
  const dispatch = useDispatch();
  const { t } = useTrans();
  const { local } = useSelector((state: RootState) => state.translation);

  useEffect(() => {
    axios
      .get(
        process.env.NEXT_PUBLIC_BASE_URL +
          `auth/google/callback?${searchParams.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      )
      .then((response) => {
        if (response.data["success"]) {
          Swal.fire({
            title: t("google.success_text"),
            icon: "success",
            confirmButtonText: t("google.ok"),
          });
          dispatch(
            login({
              user: response.data["data"]["user"],
              isLoggedIn: true,
              token: response.data["data"]["token"],
            }),
          );
        } else {
          Swal.fire({
            title: t("google.error_title"),
            icon: "success",
            confirmButtonText: t("google.ok"),
          });
        }
        navigate(`/${local}/`);
      });
  }, []);

  return null;
}

export default GoogleCallback;
