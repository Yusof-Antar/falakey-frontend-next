'use client';
// utils/apiRequest.ts
import axios, { Method } from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

interface ApiRequestOptions {
  method: Method;
  url: string;
  data?: any;
  token?: string;
  withLocale?: boolean;
  isFormData?: boolean;
  showError?: boolean;
  showSuccess?: boolean;
  isApi?: boolean;
  customErrorMessage?: string;
  customSuccessMessage?: string;
}

export const apiRequest = async ({
  method,
  url,
  data = {},
  token,
  withLocale = false,
  isFormData = false,
  showError = false,
  showSuccess = false,
  isApi = true,
  customErrorMessage,
  customSuccessMessage,
}: ApiRequestOptions) => {
  const baseURL = isApi
    ? process.env.NEXT_PUBLIC_BASE_URL
    : "https://admin.falakey.com/";
  const locale = Cookies.get("locale") || "ar";

  const finalUrl = withLocale
    ? `${baseURL}${url}?locale=${locale}`
    : `${baseURL}${url}`;

  const headers: any = {
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isFormData && method !== "get") {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await axios({
      method,
      url: finalUrl,
      data,
      headers,
    });

    if (showSuccess) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text:
          customSuccessMessage ||
          response?.data?.message ||
          "Request completed successfully.",
        confirmButtonText: "OK",
      });
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.log(error);

    const errorMessage =
      error?.response?.data?.message ||
      customErrorMessage ||
      "Unknown error occurred.";

    if (showError) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: errorMessage,
        confirmButtonText: "OK",
      });
    }

    return {
      success: false,
      error: errorMessage,
      fullError: error,
    };
  }
};
