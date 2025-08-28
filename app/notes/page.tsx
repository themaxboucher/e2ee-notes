"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  LoaderCircle,
  Plus,
  Search,
  Trash2,
  ArrowLeft,
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

type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
};

function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function NotesPage() {
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Dummy notes data
  const initialNotes = useMemo<Note[]>(
    () => [
      {
        id: "1",
        title: "Project ideas",
        content:
          "- Build a personal knowledge base\n- Try end-to-end encrypted notes\n- Explore offline-first patterns",
        updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
      },
      {
        id: "2",
        title: "Groceries",
        content: "Milk, Eggs, Bread, Coffee, Apples, Spinach, Pasta, Olive oil",
        updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
      },
      {
        id: "3",
        title: "Reading list",
        content:
          "Clean Code, Designing Data-Intensive Applications, The Pragmatic Programmer",
        updatedAt: Date.now() - 1000 * 60 * 60 * 5,
      },
      {
        id: "4",
        title: "Meeting notes",
        content:
          "Discuss timelines, assign owners, confirm scope, follow up next week",
        updatedAt: Date.now() - 1000 * 60 * 30,
      },
    ],
    []
  );

  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    initialNotes[0]?.id ?? null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileListOnly, setIsMobileListOnly] = useState(false);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedNoteId) ?? null,
    [notes, selectedNoteId]
  );

  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
  }, [notes, searchQuery]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push("/");
  };

  const handleCreateNote = () => {
    const newNote: Note = {
      id: `${Date.now()}`,
      title: "Untitled",
      content: "",
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setIsMobileListOnly(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId((prev) => {
        const remaining = notes.filter((n) => n.id !== id);
        return remaining[0]?.id ?? null;
      });
    }
  };

  const handleUpdateTitle = (id: string, title: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, title, updatedAt: Date.now() } : n
      )
    );
  };

  const handleUpdateContent = (id: string, content: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, content, updatedAt: Date.now() } : n
      )
    );
  };

  useEffect(() => {
    const handleGetCurrentUser = async () => {
      try {
        const session = await getCurrentSession();
        setUser(session.userId);
      } catch (error) {
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
    };

    handleGetCurrentUser();
  }, [router]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
        <LoaderCircle className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
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
                      const isActive = note.id === selectedNoteId;
                      return (
                        <button
                          key={note.id}
                          onClick={() => {
                            setSelectedNoteId(note.id);
                          }}
                          className={`text-left rounded-lg border p-3 transition-colors hover:bg-accent focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none ${
                            isActive ? "bg-accent" : "bg-background"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-medium truncate">
                                {note.title || "Untitled"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {note.content || "No content"}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {formatDate(note.updatedAt)}
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
                        ? `Edited ${formatDate(selectedNote.updatedAt)}`
                        : ""}
                    </p>
                  </div>
                  {selectedNote ? (
                    <Input
                      value={selectedNote.title}
                      onChange={(e) =>
                        handleUpdateTitle(selectedNote.id, e.target.value)
                      }
                      className="text-lg font-medium"
                      placeholder="Note title"
                    />
                  ) : (
                    <CardTitle className="text-base">
                      No note selected
                    </CardTitle>
                  )}
                  <CardDescription>
                    {selectedNote
                      ? "Start typing to edit your note"
                      : "Create or select a note to start writing"}
                  </CardDescription>
                </div>
                {selectedNote && (
                  <div className="shrink-0">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteNote(selectedNote.id)}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {selectedNote ? (
                  <textarea
                    value={selectedNote.content}
                    onChange={(e) =>
                      handleUpdateContent(selectedNote.id, e.target.value)
                    }
                    placeholder="Write your note here..."
                    className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-h-[220px] md:min-h-[420px] rounded-md border bg-transparent p-3 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
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
