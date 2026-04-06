"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AuthorHeader from "@/components/Author/AuthorHeader";
import { User } from "@/models/user";
import SEO from "@/components/Common/SEO";
import { useDispatch, useSelector } from "react-redux";
import { search } from "@/lib/slices/searchSlice";
import { RootState } from "@/lib/store";
import MasonryWrapper from "@/components/Masonry/MasonryWrapper";
import { apiRequest } from "@/utils/apiRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useTrans } from "@/utils/translation";

const Author = () => {
  const { t } = useTrans();
  const router = useRouter();
  const params = useParams();

  // params.username will be "@username" or "username" depending on the URL
  const rawUsername = Array.isArray(params.username)
    ? params.username[0]
    : params.username;

  const username = decodeURIComponent(rawUsername ?? "").replace(/^@+/, "");

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [notFound, setNotFound] = useState(false);

  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const previousSearch = useSelector((state: RootState) => state.search);

  useEffect(() => {
    if (!username) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setNotFound(false);

    dispatch(
      search({
        author: username,
        types: "photo",
        placeholder: previousSearch.placeholder,
      }),
    );

    apiRequest({
      method: "GET",
      url: `users/${username}/profile/public`,
      token: token!,
    })
      .then((result) => {
        if (result?.data?.success) {
          setUser(result.data.data);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username, token]);

  // Always show loader first — never flash 404 on first render
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-xl font-semibold text-primary">
          <FontAwesomeIcon
            icon={faSpinner}
            className="size-[30px] animate-spin"
            style={{ animationDuration: "2000ms" }}
          />
          {t("common.loading")}
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-8xl font-extrabold text-primary/20">404</div>
        <h1 className="text-3xl font-bold text-primary">User not found</h1>
        <p className="text-gray-500 text-lg">
          The profile{" "}
          <span className="font-semibold text-primary">@{username}</span> does
          not exist or may have been removed.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-xl hover:opacity-90 transition"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${user?.display_name || "@" + username} | Falakey`}
        description=""
        type="article"
        name="Falakey"
      />
      <div className="min-h-screen flex flex-col gap-20 items-center justify-start p-4 mt-8">
        <AuthorHeader author={user} loading={loading} />
        <div className="w-full bg-white flex flex-col items-center">
          <MasonryWrapper
            title=""
            classTitle="text-3xl mb-6"
            screenWidth="w-[95%]"
            stringFiltering={`types=${previousSearch.types}`}
          />
        </div>
      </div>
    </>
  );
};

type ErrorMessageProps = {
  message: string;
};

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="w-full mt-16 flex justify-center">
      <div className="bg-red-50 border border-red-300 text-red-800 px-6 py-5 rounded-xl shadow-md max-w-2xl text-center text-lg">
        <h2 className="font-semibold text-xl mb-2">
          Oops! Something went wrong
        </h2>
        <p>{message}</p>
        <p className="mt-4 text-sm text-gray-500">
          If you think this is a mistake, try verifying the username format.
        </p>
      </div>
    </div>
  );
};

export default Author;
