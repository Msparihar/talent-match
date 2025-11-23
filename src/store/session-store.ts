import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Document {
  id: string
  type: 'resume' | 'job_description'
  fileName: string
  fileType: string
  mimeType: string
  createdAt: Date
}

interface SessionState {
  // State
  currentSessionId: string | null
  documents: Document[]
  processingStatus: 'idle' | 'uploading' | 'processing' | 'ready' | 'error'
  progress: number
  error: string | null

  // Actions
  createSession: (id: string, docs?: Document[]) => void
  addDocument: (doc: Document) => void
  setDocuments: (docs: Document[]) => void
  setProcessing: (status: SessionState['processingStatus'], progress?: number) => void
  setError: (error: string) => void
  clearError: () => void
  reset: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      // Initial state
      currentSessionId: null,
      documents: [],
      processingStatus: 'idle',
      progress: 0,
      error: null,

      // Actions
      createSession: (id, docs = []) =>
        set({
          currentSessionId: id,
          documents: docs,
          processingStatus: 'idle',
          progress: 0,
          error: null
        }),

      addDocument: (doc) =>
        set((state) => ({
          documents: [...state.documents, doc]
        })),

      setDocuments: (docs) =>
        set({ documents: docs }),

      setProcessing: (status, progress = 0) =>
        set({ processingStatus: status, progress }),

      setError: (error) =>
        set({ error, processingStatus: 'error' }),

      clearError: () =>
        set({ error: null }),

      reset: () =>
        set({
          currentSessionId: null,
          documents: [],
          processingStatus: 'idle',
          progress: 0,
          error: null,
        }),
    }),
    {
      name: 'talentmatch-session',
      // Only persist essential state, not temporary UI state
      partialize: (state) => ({
        currentSessionId: state.currentSessionId,
        documents: state.documents,
      }),
    },
  ),
)
