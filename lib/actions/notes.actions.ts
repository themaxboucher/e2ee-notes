"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite/server";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_NOTES_TABLE_ID: NOTES_TABLE_ID,
} = process.env;

export const createNote = async (note: NoteDB) => {
  try {
    const { database } = await createAdminClient();

    const newNote = await database.createDocument(
      DATABASE_ID!,
      NOTES_TABLE_ID!,
      ID.unique(),
      note
    );

    return parseStringify(newNote);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getNotes = async (userId: string, limit: number = 5000) => {
  try {
    const { database } = await createAdminClient();

    const notes = await database.listDocuments(DATABASE_ID!, NOTES_TABLE_ID!, [
      Query.equal("user", [userId]),
      Query.limit(limit),
    ]);

    return parseStringify(notes.documents);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateNote = async (noteId: string, note: NoteDB) => {
  try {
    const { database } = await createAdminClient();

    const updatedNote = await database.updateDocument(
      DATABASE_ID!,
      NOTES_TABLE_ID!,
      noteId,
      note
    );

    return parseStringify(updatedNote);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteNote = async (noteId: string) => {
  try {
    const { database } = await createAdminClient();

    await database.deleteDocument(DATABASE_ID!, NOTES_TABLE_ID!, noteId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
