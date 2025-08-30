"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  LoaderCircle,
  Plus,
  Search,
  Trash2,
  ArrowLeft,
  Check,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentSession, logout } from "@/lib/appwrite/client";
import { formatDate } from "@/lib/utils";
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from "@/lib/actions/notes.actions";
import { Textarea } from "@/components/ui/textarea";

export default function NotesPage() {
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState<NoteCipher[] | null>(null);
  const router = useRouter();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileListOnly, setIsMobileListOnly] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [savedStatus, setSavedStatus] = useState<"typing" | "saving" | "saved">(
    "saved"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const session = await getCurrentSession();
        setUser(session.userId);

        // Get notes
        const fetched = await getNotes(session.userId);
        setNotes(fetched);
      } catch (error) {
        router.replace("/"); // Redirect to login page if user is not logged in
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const selectedNote = useMemo(() => {
    if (!notes || !selectedNoteId) return null;
    const match = notes.find((n) => n.$id === selectedNoteId);
    return match ?? null;
  }, [notes, selectedNoteId]);

  const filteredNotes = useMemo(() => {
    if (!notes) return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return notes;
    return notes.filter(
      (n) =>
        n.titleCipher.toLowerCase().includes(query) ||
        n.contentCipher.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push("/");
  };

  const handleCreateNote = async () => {
    const newNote: Note = {
      title: "Untitled",
      content: "",
    };
    if (user === null || notes === null) {
      return;
    }

    // TODO: Make sure to encrypt the note
    const newNoteDB: NoteDB = {
      titleCipher: newNote.title,
      contentCipher: newNote.content,
      user: user,
    };

    const note = await createNote(newNoteDB);
    setNotes((prev) => [note, ...(prev ?? [])]);
    setSelectedNoteId(note.$id);
    setIsMobileListOnly(false);
  };

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
    setNotes((prev) => (prev ? prev.filter((n) => n.$id !== id) : prev));
    setSelectedNoteId(null);
  };

  const handleUpdateNote = async (
    note: NoteCipher,
    newTitle?: string,
    newContent?: string
  ) => {
    setSavedStatus("typing");
    const nextTitleCipher =
      newTitle !== undefined ? newTitle : note.titleCipher;
    const nextContentCipher =
      newContent !== undefined ? newContent : note.contentCipher;

    // TODO: Encrypt values before saving
    const newNoteDB: NoteDB = {
      titleCipher: nextTitleCipher,
      contentCipher: nextContentCipher,
      user: user as string,
    };

    // Optimistically update local state so the selected note reflects changes immediately
    setNotes((prev) =>
      prev
        ? prev.map((n) =>
            n.$id === note.$id
              ? {
                  ...n,
                  titleCipher: nextTitleCipher,
                  contentCipher: nextContentCipher,
                }
              : n
          )
        : prev
    );

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(async () => {
      setSavedStatus("saving");
      await updateNote(note.$id, newNoteDB);
      setSavedStatus("saved");
    }, 2000);
  };

  if (!user && !isLoading) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
        <LoaderCircle className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-screen-xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between gap-3 mb-4 md:mb-6">
          <h1 className="heading-3 md:heading-2">Your Notes</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="size-4" />
              Logout
            </Button>
            <Button size="sm" onClick={handleCreateNote}>
              <Plus className="size-4" />
              New note
            </Button>
          </div>
        </div>

        {/* Responsive layout: list and editor side-by-side on md+, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Notes list */}
          <div
            className={
              // On mobile, hide list when a note is selected and not explicitly viewing list
              `md:col-span-5 ${
                selectedNote && !isMobileListOnly ? "hidden md:block" : "block"
              }`
            }
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Browse</CardTitle>
                <CardDescription>Search and select a note</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {filteredNotes.length === 0 ? (
                  <div className="text-sm text-muted-foreground py-8 text-center">
                    No notes match your search.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredNotes.map((note) => {
                      const isActive = note.$id === selectedNoteId;
                      return (
                        <button
                          key={note.$id}
                          onClick={() => {
                            setSelectedNoteId(note.$id);
                          }}
                          className={`text-left rounded-lg border p-3 transition-colors hover:bg-accent focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none ${
                            isActive ? "bg-accent" : "bg-background"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-medium truncate">
                                {note.titleCipher || "Untitled"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {note.contentCipher || "No content"}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {formatDate(note.$updatedAt)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Editor */}
          <div
            className={`md:col-span-7 ${
              selectedNote ? "block" : "hidden md:block"
            }`}
          >
            <Card className="min-h-[280px]">
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <div className="space-y-1.5 w-full">
                  <div className="flex items-center gap-2">
                    <div className="md:hidden">
                      {selectedNote && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsMobileListOnly(true)}
                        >
                          <ArrowLeft className="size-4" />
                          Back
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground ml-auto md:ml-0">
                      {selectedNote
                        ? `Edited ${formatDate(selectedNote.$updatedAt)}`
                        : ""}
                    </p>
                  </div>
                  {selectedNote ? (
                    <>
                      <Input
                        value={selectedNote.titleCipher}
                        onChange={(e) =>
                          handleUpdateNote(
                            selectedNote,
                            e.target.value,
                            undefined
                          )
                        }
                        className="text-lg font-medium"
                        placeholder="Note title"
                      />
                      <CardDescription className="flex items-center gap-1.5">
                        {savedStatus === "saved" && (
                          <Check className="size-4" />
                        )}
                        {savedStatus === "typing" && (
                          <Info className="size-4" />
                        )}
                        {savedStatus === "saving" && (
                          <LoaderCircle className="size-4 animate-spin" />
                        )}
                        <span>
                          {savedStatus === "saved" && "Changes saved"}
                          {savedStatus === "typing" && "Unsaved changes"}
                          {savedStatus === "saving" && "Encrypting..."}
                        </span>
                      </CardDescription>
                    </>
                  ) : (
                    <CardTitle className="text-base">
                      No note selected
                    </CardTitle>
                  )}
                </div>
                {selectedNote && (
                  <div className="shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteNote(selectedNote.$id)}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {selectedNote ? (
                  <Textarea
                    value={selectedNote.contentCipher}
                    onChange={(e) =>
                      handleUpdateNote(selectedNote, undefined, e.target.value)
                    }
                    placeholder="Write your note here..."
                    className="w-full min-h-[220px] md:min-h-[420px]"
                  />
                ) : (
                  <div className="text-sm text-muted-foreground py-8 text-center">
                    Nothing to edit yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
