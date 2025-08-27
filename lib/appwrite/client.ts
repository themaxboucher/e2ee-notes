"use client";

import { Account, Client, ID } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);

export async function sendMagicLink(email: string) {
  try {
    const token = await account.createMagicURLToken(
      ID.unique(),
      email,
      `${process.env.NEXT_PUBLIC_SITE_URL!}/verify`
    );
    return token;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function loginWithMagicLink(userId: string, secret: string) {
  try {
    const user = await account.createSession(userId, secret);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCurrentSession() {
  try {
    const result = await account.getSession({
      sessionId: "current",
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function logout() {
  try {
    const result = await account.deleteSession({ sessionId: "current" });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
