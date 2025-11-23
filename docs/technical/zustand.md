# Zustand State Management Guide

**Last Updated:** January 2025
**Version:** 5.0.8
**Official Docs:** https://zustand.docs.pmnd.rs/
**GitHub:** https://github.com/pmndrs/zustand

## Overview

Zustand is a minimalist, hook-based state management library for React. It provides a simple API without the boilerplate of Redux or the limitations of Context API.

**Key Benefits:**
- No context providers needed
- Simple hook-based API
- TypeScript support
- Minimal boilerplate
- Built-in middleware (persist, devtools, etc.)
- Works with or without React

## Installation

```bash
npm install zustand
# or
bun add zustand
```

---

## Basic Usage

### Creating a Store

```typescript
import { create } from 'zustand'

interface BearState {
  bears: number
  increasePopulation: () => void
  removeAllBears: () => void
}

const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}))
```

### Using in Components

```typescript
function BearCounter() {
  const bears = useBearStore((state) => state.bears)
  return <h1>{bears} around here...</h1>
}

function Controls() {
  const increasePopulation = useBearStore((state) => state.increasePopulation)
  return <button onClick={increasePopulation}>Add Bear</button>
}
```

---

## TypeScript Patterns

### Interface-Based Store

```typescript
import { create } from 'zustand'

interface MyState {
  count: number
  text: string
  increment: () => void
  setText: (text: string) => void
}

const useStore = create<MyState>((set) => ({
  count: 0,
  text: 'hello',
  increment: () => set((state) => ({ count: state.count + 1 })),
  setText: (text) => set({ text }),
}))
```

### Separating State and Actions

```typescript
interface State {
  count: number
  text: string
}

interface Actions {
  increment: () => void
  setText: (text: string) => void
}

type Store = State & Actions

const useStore = create<Store>((set) => ({
  count: 0,
  text: 'hello',
  increment: () => set((state) => ({ count: state.count + 1 })),
  setText: (text) => set({ text }),
}))
```

---

## Persist Middleware

### Basic Persist with TypeScript

```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface SessionState {
  currentSessionId: string | null
  processingStatus: 'idle' | 'uploading' | 'processing' | 'ready' | 'error'
  progress: number
  error: string | null
  setSession: (id: string) => void
  setProcessing: (status: SessionState['processingStatus'], progress?: number) => void
  reset: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      currentSessionId: null,
      processingStatus: 'idle',
      progress: 0,
      error: null,

      setSession: (id) => set({ currentSessionId: id }),
      setProcessing: (status, progress = 0) =>
        set({ processingStatus: status, progress }),
      reset: () => set({
        currentSessionId: null,
        processingStatus: 'idle',
        progress: 0,
        error: null
      }),
    }),
    {
      name: 'session-storage', // unique storage key
    },
  ),
)
```

**Note:** Use `create<State>()()` (double parentheses) when using middleware with TypeScript.

### Persist Options

```typescript
export const useStore = create<State>()(
  persist(
    (set) => ({
      // state and actions
    }),
    {
      name: 'my-storage', // required: unique storage key
      storage: createJSONStorage(() => sessionStorage), // optional: defaults to localStorage
      partialize: (state) => ({
        count: state.count
      }), // optional: only persist specific fields
      skipHydration: false, // optional: skip automatic hydration
      version: 1, // optional: for migrations
      migrate: (persistedState, version) => {
        // optional: handle version migrations
        return persistedState
      },
    },
  ),
)
```

---

## Advanced Patterns

### Accessing State in Actions (get)

```typescript
const useStore = create<Store>((set, get) => ({
  sound: 'grunt',
  action: () => {
    const currentSound = get().sound
    console.log('Current sound:', currentSound)
    set({ sound: 'roar' })
  },
}))
```

### Selecting Multiple State Slices

```typescript
import { useShallow } from 'zustand/react/shallow'

function Component() {
  const { nuts, honey } = useBearStore(
    useShallow((state) => ({
      nuts: state.nuts,
      honey: state.honey
    }))
  )

  return <div>{nuts} nuts and {honey} honey</div>
}
```

### Async Actions

```typescript
interface FishState {
  fishies: Record<string, any>
  fetch: (pond: string) => Promise<void>
}

const useFishStore = create<FishState>((set) => ({
  fishies: {},
  fetch: async (pond) => {
    const response = await fetch(pond)
    const data = await response.json()
    set({ fishies: data })
  },
}))
```

### Non-React Usage

```typescript
// Outside components
const paw = useDogStore.getState().paw

// Subscribe to changes
const unsub = useDogStore.subscribe((state) => {
  console.log('State changed:', state)
})

// Update state
useDogStore.setState({ paw: false })

// Cleanup
unsub()
```

---

## Combining Middlewares

### Persist + DevTools

```typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        bears: 0,
        increase: (by) => set((state) => ({ bears: state.bears + by })),
      }),
      {
        name: 'bear-storage',
      },
    ),
    {
      name: 'BearStore', // Redux DevTools name
    },
  ),
)
```

---

## Best Practices

### 1. Store Organization

```typescript
// ✅ Good: Separate concerns
interface UserState {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

// ❌ Bad: Mixing unrelated state
interface AppState {
  user: User | null
  cartItems: Item[]
  theme: 'light' | 'dark'
}
```

### 2. Immutability

```typescript
// ✅ Good: Immutable updates
const useStore = create<State>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
}))

// ❌ Bad: Mutating state
const useStore = create<State>((set) => ({
  items: [],
  addItem: (item) => set((state) => {
    state.items.push(item) // Don't mutate!
    return state
  }),
}))
```

### 3. Selective Subscriptions

```typescript
// ✅ Good: Select only what you need
const bears = useBearStore((state) => state.bears)

// ❌ Bad: Selecting entire state causes unnecessary re-renders
const state = useBearStore()
```

---

## TalentMatch Example

### Session Management Store

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Document {
  id: string
  type: 'resume' | 'job_description'
  name: string
}

interface SessionState {
  currentSessionId: string | null
  documents: Document[]
  processingStatus: 'idle' | 'uploading' | 'processing' | 'ready' | 'error'
  progress: number
  error: string | null

  // Actions
  createSession: (id: string) => void
  addDocument: (doc: Document) => void
  setProcessing: (status: SessionState['processingStatus'], progress?: number) => void
  setError: (error: string) => void
  clearError: () => void
  reset: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      currentSessionId: null,
      documents: [],
      processingStatus: 'idle',
      progress: 0,
      error: null,

      createSession: (id) => set({ currentSessionId: id, documents: [] }),
      addDocument: (doc) => set((state) => ({
        documents: [...state.documents, doc]
      })),
      setProcessing: (status, progress = 0) =>
        set({ processingStatus: status, progress }),
      setError: (error) => set({ error, processingStatus: 'error' }),
      clearError: () => set({ error: null }),
      reset: () => set({
        currentSessionId: null,
        documents: [],
        processingStatus: 'idle',
        progress: 0,
        error: null,
      }),
    }),
    {
      name: 'talentmatch-session',
      partialize: (state) => ({
        currentSessionId: state.currentSessionId,
        documents: state.documents,
      }),
    },
  ),
)
```

---

## Summary

- **Simple API**: Just `create()` a hook and use it
- **No Providers**: Works without context providers
- **TypeScript**: Full type safety with minimal overhead
- **Middleware**: Built-in persist, devtools, and more
- **Performance**: Only re-renders components that use changed state
