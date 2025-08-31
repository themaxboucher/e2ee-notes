"use client";

import React from "react";
import { createDek } from "@/lib/crypto";

type Ctx = {
  dek: CryptoKey | null;
  create: () => Promise<void>;
  clear: () => void;
  set: (key: CryptoKey) => void;
};
const DekContext = React.createContext<Ctx | null>(null);

export function DekProvider({ children }: { children: React.ReactNode }) {
  const [dek, setDek] = React.useState<CryptoKey | null>(null);

  const create = async () => {
    const key = await createDek();
    setDek(key);
  };

  const clear = () => setDek(null);

  // No session storage: DEK only lives in memory

  return (
    <DekContext.Provider value={{ dek, create, clear, set: setDek }}>
      {children}
    </DekContext.Provider>
  );
}

export function useDek() {
  const ctx = React.useContext(DekContext);
  if (!ctx) throw new Error("useDek must be used inside <DekProvider>");
  return ctx;
}
