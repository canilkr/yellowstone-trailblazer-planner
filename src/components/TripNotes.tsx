import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Note {
  id: string;
  content: string;
  timestamp: Date;
}

export const TripNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState("");

  const saveNote = () => {
    if (currentNote.trim()) {
      const newNote: Note = {
        id: `${Date.now()}`,
        content: currentNote,
        timestamp: new Date(),
      };
      setNotes((prev) => [newNote, ...prev]);
      setCurrentNote("");
      toast.success("Note saved successfully!");
    }
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    toast.success("Note deleted");
  };

  return (
    <Card className="w-full shadow-[var(--shadow-card)] border-border/50">
      <CardHeader className="bg-gradient-to-r from-primary-light/20 to-primary/10">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary-light" />
          Trip Journal & Notes
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Document your experiences and planning thoughts
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Write your thoughts, plans, or memories here..."
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              className="min-h-32 bg-background border-border focus:ring-primary resize-none"
            />
            <Button
              onClick={saveNote}
              disabled={!currentNote.trim()}
              className="bg-primary hover:bg-primary-dark text-primary-foreground"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Note
            </Button>
          </div>

          {notes.length > 0 && (
            <div className="space-y-3 mt-6">
              <h3 className="font-semibold text-foreground">Saved Notes</h3>
              {notes.map((note) => (
                <Card key={note.id} className="border-border bg-card">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                          {note.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {note.timestamp.toLocaleDateString()} at{" "}
                          {note.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNote(note.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
