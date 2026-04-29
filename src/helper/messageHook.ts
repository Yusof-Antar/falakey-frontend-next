"use client";
import type { RootState } from "@/types/RootState";
import { Message } from "@/models/Message";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";

export const useMessageHook = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const { token, user } = useSelector((state: RootState) => state.auth);
  const { local } = useSelector((state: RootState) => state.translation);

  const getMessages = async (
    peerId: number | undefined,
    postId: number | null,
  ) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL +
          `chats/messages/${peerId}${postId != null ? `/${postId}` : ""}?locale=${local}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.data.success) {
        setMessages(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError((err as Error).message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (
    message: string,
    receiverId: number | undefined,
    postId: number | undefined,
  ) => {
    setError("");
    const tempId = -Date.now();
    const optimisticMessage = {
      id: tempId,
      created_at: new Date().toISOString(),
      is_read: false,
      sender: user,
      message,
    } as Message;

    setMessages((prev) => [optimisticMessage, ...prev]);

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + `chats/send?locale=${local}`,
        { receiver_id: receiverId, post_id: postId, message },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data?.success) {
        const realMessage: Message = response.data.data;
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? realMessage : m)),
        );
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setError("Failed to send message.");
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setError("Error happened while sending the message.");
    }
  };

  return { getMessages, sendMessage, messages, loading, error };
};
