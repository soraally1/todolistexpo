/**
 * Custom hook for managing notes with API integration
 */

import { ApiResponse, CreateNoteRequest, Note, notesApi, UpdateNoteRequest } from '@/services/api';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export interface UseNotesReturn {
  notes: Note[];
  loading: boolean;
  error: string | null;
  addNote: (noteData: CreateNoteRequest) => Promise<boolean>;
  updateNote: (id: string, noteData: UpdateNoteRequest) => Promise<boolean>;
  deleteNote: (id: string) => Promise<boolean>;
  toggleNote: (id: string) => Promise<boolean>;
  refreshNotes: () => Promise<void>;
}

export const useNotes = (): UseNotesReturn => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load notes from API
  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<Note[]> = await notesApi.getAllNotes();
      
      if (response.success && response.data) {
        setNotes(response.data);
      } else {
        setError(response.error || 'Failed to load notes');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error loading notes:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new note
  const addNote = useCallback(async (noteData: CreateNoteRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<Note> = await notesApi.createNote(noteData);
      
      if (response.success && response.data) {
        setNotes(prevNotes => [response.data!, ...prevNotes]);
        return true;
      } else {
        setError(response.error || 'Failed to create note');
        Alert.alert('Error', response.error || 'Failed to create note');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update existing note
  const updateNote = useCallback(async (id: string, noteData: UpdateNoteRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<Note> = await notesApi.updateNote(id, noteData);
      
      if (response.success && response.data) {
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note.id === id ? response.data! : note
          )
        );
        return true;
      } else {
        setError(response.error || 'Failed to update note');
        Alert.alert('Error', response.error || 'Failed to update note');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete note
  const deleteNote = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<void> = await notesApi.deleteNote(id);
      
      if (response.success) {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
        return true;
      } else {
        setError(response.error || 'Failed to delete note');
        Alert.alert('Error', response.error || 'Failed to delete note');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle note completion status
  const toggleNote = useCallback(async (id: string): Promise<boolean> => {
    const note = notes.find(n => n.id === id);
    if (!note) return false;

    return updateNote(id, { completed: !note.completed });
  }, [notes, updateNote]);

  // Refresh notes from API
  const refreshNotes = useCallback(async () => {
    await loadNotes();
  }, [loadNotes]);

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    toggleNote,
    refreshNotes,
  };
};
