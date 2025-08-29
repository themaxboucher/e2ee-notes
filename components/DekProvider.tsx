"use client";

import React from "react";
import { createDek, exportDekToJwk, importDekFromJwk } from "@/lib/crypto";

type Ctx = {
  dek: CryptoKey | null;
  create: () => Promise<void>;
  clear: () => void;
  devSaveToSession: () => Promise<void>;
  devLoadFromSession: () => Promise<void>;
};
const DekContext = React.createContext<Ctx | null>(null);

export function DekProvider({ children }: { children: React.ReactNode }) {
  const [dek, setDek] = React.useState<CryptoKey | null>(null);

  const create = async () => {
    const key = await createDek();
    setDek(key);
  };

  const clear = () => setDek(null);

  // DEV ONLY: keep an unwrapped DEK in sessionStorage so refresh won't lose it
  const devSaveToSession = async () => {
    if (!dek) return;
    const jwk = await exportDekToJwk(dek);
    sessionStorage.setItem("dev_DEK_JWK", JSON.stringify(jwk));
  };
  const devLoadFromSession = async () => {
    const raw = sessionStorage.getItem("dev_DEK_JWK");
    if (!raw) return;
    const jwk = JSON.parse(raw);
    const key = await importDekFromJwk(jwk);
    setDek(key);
  };

  return (
    <DekContext.Provider
      value={{ dek, create, clear, devSaveToSession, devLoadFromSession }}
    >
      {children}
    </DekContext.Provider>
  );
}

export function useDek() {
  const ctx = React.useContext(DekContext);
  if (!ctx) throw new Error("useDek must be used inside <DekProvider>");
  return ctx;
}
