import ChatClient from "@/components/ChatClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ask Solana — AI Glossary Chat",
  description: "Chat with an AI that knows all 1001 Solana glossary terms.",
};

export default function ChatPage() {
  return <ChatClient />;
}
