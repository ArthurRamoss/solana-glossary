import type { Category } from "./types";

export interface CategoryMeta {
  label: string;
  color: string;
  description: string;
}

export const categoryMeta: Record<Category, CategoryMeta> = {
  "core-protocol": {
    label: "Core Protocol",
    color: "#9945FF",
    description: "Fundamental mechanisms powering the Solana blockchain.",
  },
  "programming-model": {
    label: "Programming Model",
    color: "#3B82F6",
    description: "Programs, accounts, instructions, and Solana's execution model.",
  },
  "token-ecosystem": {
    label: "Token Ecosystem",
    color: "#F59E0B",
    description: "SPL tokens, minting, transfers, and token standards.",
  },
  defi: {
    label: "DeFi",
    color: "#10B981",
    description: "Decentralized finance protocols, AMMs, lending, and yield.",
  },
  "zk-compression": {
    label: "ZK Compression",
    color: "#8B5CF6",
    description: "Zero-knowledge proofs and state compression on Solana.",
  },
  infrastructure: {
    label: "Infrastructure",
    color: "#6B7280",
    description: "Validators, RPCs, clusters, and network infrastructure.",
  },
  security: {
    label: "Security",
    color: "#EF4444",
    description: "Vulnerabilities, auditing, and security best practices.",
  },
  "dev-tools": {
    label: "Dev Tools",
    color: "#06B6D4",
    description: "SDKs, CLIs, frameworks, and developer tooling.",
  },
  network: {
    label: "Network",
    color: "#14F195",
    description: "Consensus, gossip, turbine, and network communication.",
  },
  "blockchain-general": {
    label: "Blockchain General",
    color: "#FB923C",
    description: "General blockchain concepts not specific to Solana.",
  },
  web3: {
    label: "Web3",
    color: "#E879F9",
    description: "Wallets, dapps, identity, and the decentralized web.",
  },
  "programming-fundamentals": {
    label: "Programming Fundamentals",
    color: "#38BDF8",
    description: "Core CS concepts supporting blockchain development.",
  },
  "ai-ml": {
    label: "AI / ML",
    color: "#FDBA74",
    description: "Machine learning, LLMs, and AI concepts for builders.",
  },
  "solana-ecosystem": {
    label: "Solana Ecosystem",
    color: "#C084FC",
    description: "Projects, products, and culture across the Solana landscape.",
  },
};
