"use client";
import { useMotionValue } from "motion/react";
import React, { useState, useEffect } from "react";

export const CryptoBackground = ({ text }: { text?: string }) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  const [randomString, setRandomString] = useState("");

  useEffect(() => {
    let str = generateRandomString(10000);
    setRandomString(str);
  }, []);

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);

    const str = generateRandomString(10000);
    setRandomString(str);
  }

  return (
    <div
      className="size-full absolute inset-0 overflow-hidden flex items-center justify-center"
      onMouseMove={onMouseMove}
    >
      <div className="w-[40%] h-[60%] bg-background rounded-full relative z-5 blur-3xl opacity-80" />
      <div className="size-full bg-radial from-transparent to-background absolute z-5" />
      <p className="absolute opacity-25 inset-x-0 text-xs text-blue-400 h-full break-words whitespace-pre-wrap font-mono font-semibold transition duration-500 tracking-[0.2em]">
        {randomString}
      </p>
    </div>
  );
};

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const generateRandomString = (length: number) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
