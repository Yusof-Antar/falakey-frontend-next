"use client";
import type { RootState } from "@/types/RootState";
import { Chat } from "@/models/Chat";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";

export const useChatHook = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const { token } = useSelector((state: RootState) => state.auth);
  const { local } = useSelector((state: RootState) => state.translation);

  const getChats = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL + `notifications?locale=${local}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        setChats(response.data.data.chats.list);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { getChats, chats, loading, error };
};
