"use client";
import { usePathname } from "next/navigation";
const falakeWallpaper = "/images/falakey-wallpaper-signup.jpg";

import { useEffect, useState } from "react";
import ForgetPassword from "./ForgetPassword";
import Login from "./Login";
import Register from "../Home/Register";
import { useSelector } from "react-redux";
import { useAuthenticationHook } from "@/helper/authHook";
import type { RootState } from "@/types/RootState";
import Swal from "sweetalert2";
import axios from "axios";
import { useTrans } from "@/utils/translation";
import { useNavigateWithLocale } from "@/helper/navigateWithLocale";

const AuthenticationModal = ({
  modalHandler,
  signUpBool,
}: {
  modalHandler: (b: boolean) => void;
  signUpBool?: boolean;
}) => {
  const navigate = useNavigateWithLocale();
  const pathname = usePathname();

  const [signUp, setSignUp] = useState(signUpBool ?? false);
  const [forgetPass, setforgetPass] = useState(false);

  const [googleUrl, setGoogleUrl] = useState(null);

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const { loginHook, registerHook, resetError, loading, message, error } =
    useAuthenticationHook();

  useEffect(() => {
    resetError();
  }, [signUp]);

  useEffect(() => {
    if (isLoggedIn) {
      modalHandler(false);
    }
  }, [isLoggedIn, modalHandler]);

  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_BASE_URL + "auth/google", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        if (response.data["success"]) {
          setGoogleUrl(response.data["data"]["url"]);
        }
      });
  }, []);

  const { t } = useTrans();

  const isHomePage = () => {
    const pathSegments = pathname.split("/").filter(Boolean);
    // Home page is either "/" or "/en" or "/ar" (only locale in path)
    return pathSegments.length === 0 || pathSegments.length === 1;
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 flex justify-center items-center z-30"
      onClick={() => modalHandler(false)}
    >
      <div
        className="bg-black h-[80%] m-4 rounded-lg shadow-lg flex w-[1320px] justify-center items-center max-[768px]:w-11/12 "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Column 1 - 80% width */}
        <div className="w-[63%] max-[1023px]:w-7/12  max-[768px]:hidden rounded-l-lg h-full">
          <img
            src={falakeWallpaper}
            alt="Falakey-Wallpaper"
            className="w-full h-full object-cover rounded-l-lg"
          />
        </div>

        {/* Column 2 - 20% width */}
        <div
          className="w-[37%] flex flex-col justify-between  px-10 py-4 h-full  overflow-y-scroll max-[1023px]:w-5/12 max-[768px]:w-full"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="top-modal w-full flex justify-between font-bold text-lg">
            {isHomePage() ? (
              <div></div>
            ) : (
              <button
                onClick={() => {
                  navigate("/");
                }}
                className=" text-white text-md font-semibold px-2 py-1.5 rounded-lg bg-[hsla(0,0%,100%,0.1)]"
              >
                {t("common.home")}
              </button>
            )}
            <button
              onClick={() => {
                modalHandler(false);
                setSignUp(false);
                setforgetPass(false);
              }}
              className=" text-white text-md font-semibold px-2 py-1.5 rounded-lg bg-[hsla(0,0%,100%,0.1)]"
            >
              {t("common.close")}
            </button>
          </div>
          <div>
            <div className="middle-modal w-full flex items-center gap-4 text-lg">
              <button
                onClick={() => {
                  setforgetPass(false);
                  setSignUp(false);
                }}
                className={`px-4 py-1 rounded font-bold hover:bg-[hsla(0,0%,100%,0.2)] hover:text-white ${
                  !signUp
                    ? "bg-[hsla(0,0%,100%,0.2)] text-white "
                    : "bg-[hsla(0,0%,100%,0.1)] text-gray-300 "
                }`}
              >
                {t("authentication.login")}
              </button>
              <button
                onClick={() => {
                  setforgetPass(false);
                  setSignUp(true);
                }}
                className={`px-4 py-1 rounded  font-bold hover:bg-[hsla(0,0%,100%,0.2)] hover:text-white ${
                  signUp
                    ? "bg-[hsla(0,0%,100%,0.2)] text-white"
                    : "bg-[hsla(0,0%,100%,0.1)] text-gray-300"
                }`}
              >
                {t("authentication.register")}
              </button>
            </div>

            {/* Conditionally Render Content */}
            <div className="content mt-6 text-white text-lg">
              {signUp ? (
                <div className="gap-4 flex flex-col">
                  <Register
                    loading={loading}
                    submitForm={(
                      u: string,
                      e: string,
                      f: string,
                      l: string,
                      p: string,
                      pc: string,
                      t: boolean,
                    ) => {
                      registerHook(f, l, e, u, p, pc, t);
                    }}
                    message={message || ""}
                    error={error || ""}
                    googleUrl={googleUrl!}
                  />
                </div>
              ) : forgetPass ? (
                <ForgetPassword
                  switchToLogin={() => {
                    Swal.fire({
                      title: t("authentication.password_reset_success_title"),
                      text: t("authentication.password_reset_success_text"),
                      icon: "success",
                      confirmButtonText: t("google.ok"),
                    });
                    setforgetPass(false);
                    setSignUp(false);
                  }}
                />
              ) : (
                <Login
                  submitForm={(n: string, p: string) => {
                    loginHook(n, p);
                  }}
                  loading={loading}
                  goToForget={() => {
                    setforgetPass(true);
                    setSignUp(false);
                  }}
                  message={message || ""}
                  error={error || ""}
                  googleUrl={googleUrl!}
                />
              )}
            </div>
          </div>
          {/* This Span only to make the middle div centered */}
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationModal;
