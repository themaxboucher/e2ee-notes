"use client";

import React from "react";
import { useDek } from "./DekProvider";
import { encryptWithDek, decryptWithDek } from "@/lib/crypto";
import { Button } from "./ui/button";

export default function DekPlayground() {
  const { dek, create, clear, devSaveToSession, devLoadFromSession } = useDek();

  const [plain, setPlain] = React.useState("hello world");
  const [cipher, setCipher] = React.useState<string>("");
  const [iv, setIv] = React.useState<string>("");
  const [decrypted, setDecrypted] = React.useState<string>("");

  return (
    <div className="flex flex-col gap-4">
      <h2 className="heading-3">DEK playground</h2>
      <div>
        <Button onClick={create} disabled={!!dek}>
          Create DEK
        </Button>{" "}
        <Button onClick={clear}>Clear DEK</Button>{" "}
        <Button onClick={devSaveToSession} disabled={!dek}>
          Dev: Save DEK
        </Button>{" "}
        <Button onClick={devLoadFromSession}>Dev: Load DEK</Button>
      </div>

      <div>DEK status: {dek ? "Ready" : "Not created"}</div>

      <label>
        Plaintext
        <textarea
          value={plain}
          onChange={(e) => setPlain(e.target.value)}
          rows={3}
          style={{ width: "100%" }}
        />
      </label>

      <div>
        <Button
          onClick={async () => {
            if (!dek) return alert("Create DEK first");
            const { ciphertextB64, ivB64 } = await encryptWithDek(dek, plain);
            setCipher(ciphertextB64);
            setIv(ivB64);
            setDecrypted("");
          }}
        >
          Encrypt
        </Button>{" "}
        <Button
          onClick={async () => {
            if (!dek) return alert("Create DEK first");
            if (!cipher || !iv) return alert("Nothing to decrypt yet");
            try {
              const p = await decryptWithDek(dek, cipher, iv);
              setDecrypted(p);
            } catch {
              alert("Decrypt failed (wrong key or corrupted data)");
            }
          }}
        >
          Decrypt
        </Button>
      </div>

      <div>
        <strong>ciphertext (Base64):</strong>
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {cipher || "—"}
        </pre>
      </div>
      <div>
        <strong>iv (Base64):</strong>
        <pre>{iv || "—"}</pre>
      </div>
      <div>
        <strong>decrypted:</strong>
        <pre>{decrypted || "—"}</pre>
      </div>
    </div>
  );
}
