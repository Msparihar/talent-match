# Complete Design System - Linear-Inspired

A production-ready, comprehensive design system for building beautiful, fast, and accessible applications inspired by Linear's design philosophy. Use this across all your projects.

## Quick Start

Copy-paste the configuration files below into your project, then reference the component patterns throughout this document.

---

## Design Tokens

### Complete Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      // Color System - Semantic tokens
      colors: {
        // Base colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        // Card surfaces
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // Popover surfaces
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        // Primary brand color (use sparingly)
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))',
        },

        // Secondary actions
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          hover: 'hsl(var(--secondary-hover))',
        },

        // Muted backgrounds
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },

        // Accent highlights
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        // Destructive actions
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        // Borders
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        // Status colors
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          foreground: 'hsl(var(--error-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
      },

      // Typography Scale
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.875rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },

      // Font Families
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter Display', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      // Font Weights
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },

      // Spacing Scale (4px base)
      spacing: {
        px: '1px',
        0: '0',
        0.5: '0.125rem', // 2px
        1: '0.25rem',    // 4px
        1.5: '0.375rem', // 6px
        2: '0.5rem',     // 8px
        2.5: '0.625rem', // 10px
        3: '0.75rem',    // 12px
        3.5: '0.875rem', // 14px
        4: '1rem',       // 16px
        5: '1.25rem',    // 20px
        6: '1.5rem',     // 24px
        7: '1.75rem',    // 28px
        8: '2rem',       // 32px
        9: '2.25rem',    // 36px
        10: '2.5rem',    // 40px
        11: '2.75rem',   // 44px
        12: '3rem',      // 48px
        14: '3.5rem',    // 56px
        16: '4rem',      // 64px
        20: '5rem',      // 80px
        24: '6rem',      // 96px
        28: '7rem',      // 112px
        32: '8rem',      // 128px
      },

      // Border Radius
      borderRadius: {
        none: '0',
        sm: '0.375rem',   // 6px
        DEFAULT: '0.5rem', // 8px
        md: '0.625rem',    // 10px
        lg: '0.75rem',     // 12px
        xl: '1rem',        // 16px
        '2xl': '1.5rem',   // 24px
        full: '9999px',
      },

      // Box Shadows - Subtle elevation
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        none: 'none',
      },

      // Animation Timings
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
      },

      // Easing Functions
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        snappy: 'cubic-bezier(0.4, 0, 0.6, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },

      // Z-index Scale
      zIndex: {
        dropdown: '1000',
        sticky: '1100',
        fixed: '1200',
        modal: '1300',
        popover: '1400',
        tooltip: '1500',
      },

      // Keyframe Animations
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },

      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'fade-out': 'fade-out 200ms ease-out',
        'slide-in-up': 'slide-in-up 200ms ease-out',
        'slide-in-down': 'slide-in-down 200ms ease-out',
        'slide-in-left': 'slide-in-left 200ms ease-out',
        'slide-in-right': 'slide-in-right 200ms ease-out',
        'scale-in': 'scale-in 200ms ease-out',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
```

### CSS Variables (globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Inter font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Display:wght@600;700&display=swap');

@layer base {
  :root {
    /* Dark Theme (Default) */
    --background: 222 10% 6%;        /* #0C0D0F - Woodsmoke */
    --foreground: 0 0% 98%;          /* #FAFAFA - Near white */

    --card: 222 10% 8%;              /* Slightly lighter than background */
    --card-foreground: 0 0% 98%;

    --popover: 222 10% 10%;
    --popover-foreground: 0 0% 98%;

    --primary: 250 70% 60%;          /* Indigo accent */
    --primary-foreground: 0 0% 100%;
    --primary-hover: 250 70% 55%;

    --secondary: 222 10% 14%;
    --secondary-foreground: 0 0% 98%;
    --secondary-hover: 222 10% 18%;

    --muted: 222 10% 12%;
    --muted-foreground: 0 0% 65%;

    --accent: 250 70% 60%;
    --accent-foreground: 0 0% 100%;

    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;

    --border: 222 10% 20%;           /* Subtle borders */
    --input: 222 10% 18%;
    --ring: 250 70% 60%;

    /* Status Colors */
    --success: 142 71% 45%;          /* Green */
    --success-foreground: 0 0% 100%;

    --warning: 38 92% 50%;           /* Amber */
    --warning-foreground: 0 0% 100%;

    --error: 0 72% 51%;              /* Red */
    --error-foreground: 0 0% 100%;

    --info: 199 89% 48%;             /* Blue */
    --info-foreground: 0 0% 100%;

    /* Radius */
    --radius: 0.5rem;
  }

  .light {
    /* Light Theme */
    --background: 0 0% 100%;
    --foreground: 222 10% 10%;

    --card: 0 0% 100%;
    --card-foreground: 222 10% 10%;

    --popover: 0 0% 100%;
    --popover-foreground: 222 10% 10%;

    --primary: 250 70% 55%;
    --primary-foreground: 0 0% 100%;
    --primary-hover: 250 70% 50%;

    --secondary: 222 10% 96%;
    --secondary-foreground: 222 10% 10%;
    --secondary-hover: 222 10% 92%;

    --muted: 222 10% 96%;
    --muted-foreground: 222 10% 45%;

    --accent: 250 70% 55%;
    --accent-foreground: 0 0% 100%;

    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;

    --border: 222 10% 90%;
    --input: 222 10% 92%;
    --ring: 250 70% 55%;

    --success: 142 71% 45%;
    --success-foreground: 0 0% 100%;

    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 100%;

    --error: 0 72% 51%;
    --error-foreground: 0 0% 100%;

    --info: 199 89% 48%;
    --info-foreground: 0 0% 100%;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-sans;
    font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Respect user motion preferences */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: hsl(var(--muted));
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--muted-foreground) / 0.3);
  }

  /* Selection */
  ::selection {
    background: hsl(var(--primary) / 0.3);
    color: hsl(var(--foreground));
  }

  /* Focus visible styles */
  *:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }
}

@layer utilities {
  /* Glassmorphism utility */
  .glass {
    background: hsl(var(--background) / 0.8);
    backdrop-filter: blur(12px) saturate(150%);
    border: 1px solid hsl(var(--border) / 0.5);
  }

  /* Text gradient utility */
  .text-gradient {
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* Shimmer loading effect */
  .shimmer {
    background: linear-gradient(
      90deg,
      hsl(var(--muted)) 0%,
      hsl(var(--muted-foreground) / 0.1) 50%,
      hsl(var(--muted)) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
  }
}
```

---

## Component Library

### Button Component (React + TypeScript)

```typescript
import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
        destructive: 'bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm',
        outline: 'border border-border bg-transparent hover:bg-muted',
        ghost: 'hover:bg-muted hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

### Card Component

```typescript
import React from 'react'
import { cn } from '@/lib/utils'

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border border-border bg-card text-card-foreground shadow-md',
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

### Input Component

```typescript
import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
```

### Modal/Dialog Component

```typescript
import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-modal bg-background/80 backdrop-blur-sm data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-modal max-h-[85vh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-xl border border-border bg-card p-6 shadow-xl duration-200 data-[state=open]:animate-scale-in data-[state=closed]:animate-fade-out',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
}
```

### Command Palette

```typescript
'use client'

import React, { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { Search, File, Settings, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandPaletteProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [search, setSearch] = useState('')

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange?.(!open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-modal bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="fixed left-1/2 top-[20%] z-modal w-full max-w-2xl -translate-x-1/2 animate-scale-in">
            <Command className="rounded-xl border border-border bg-card shadow-2xl">
              <div className="flex items-center border-b border-border px-4">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Type a command or search..."
                  className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <Command.List className="max-h-[400px] overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                  No results found.
                </Command.Empty>

                <Command.Group heading="Suggestions" className="px-2 py-2">
                  <CommandItem icon={<File />} onSelect={() => {}}>
                    New File
                  </CommandItem>
                  <CommandItem icon={<Settings />} onSelect={() => {}}>
                    Settings
                  </CommandItem>
                  <CommandItem icon={<User />} onSelect={() => {}}>
                    Profile
                  </CommandItem>
                </Command.Group>
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </>
  )
}

function CommandItem({
  icon,
  children,
  onSelect,
}: {
  icon?: React.ReactNode
  children: React.ReactNode
  onSelect: () => void
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted aria-selected:bg-muted"
    >
      {icon && <span className="text-muted-foreground">{icon}</span>}
      {children}
    </Command.Item>
  )
}
```

### Toast Notification Component

```typescript
'use client'

import React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  title: string
  description?: string
  type?: ToastType
  onClose: () => void
}

export function Toast({ title, description, type = 'info', onClose }: ToastProps) {
  const typeStyles = {
    success: 'border-success bg-success/10 text-success-foreground',
    error: 'border-error bg-error/10 text-error-foreground',
    warning: 'border-warning bg-warning/10 text-warning-foreground',
    info: 'border-info bg-info/10 text-info-foreground',
  }

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-lg border p-4 shadow-lg animate-slide-in-right',
        typeStyles[type]
      )}
    >
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        {description && (
          <p className="mt-1 text-sm opacity-90">{description}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="rounded-sm opacity-70 transition-opacity hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Toast Container
export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed bottom-0 right-0 z-tooltip flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-md">
      {children}
    </div>
  )
}
```

### Skeleton Loader

```typescript
import { cn } from '@/lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('shimmer rounded-md bg-muted', className)}
      {...props}
    />
  )
}

// Usage examples
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border p-6">
      <Skeleton className="mb-4 h-6 w-2/3" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  )
}

export { Skeleton, SkeletonCard }
```

### Badge Component

```typescript
import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        success: 'border-transparent bg-success text-success-foreground',
        warning: 'border-transparent bg-warning text-warning-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

---

## Layout Patterns

### App Shell Layout

```typescript
import React from 'react'
import { cn } from '@/lib/utils'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {children}
    </div>
  )
}

export function Sidebar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <aside
      className={cn(
        'flex w-64 flex-col border-r border-border bg-card',
        className
      )}
    >
      {children}
    </aside>
  )
}

export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col overflow-y-auto">
      {children}
    </main>
  )
}

export function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-sticky flex h-14 items-center border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      {children}
    </header>
  )
}

// Usage
function MyApp() {
  return (
    <AppShell>
      <Sidebar>
        {/* Sidebar content */}
      </Sidebar>
      <MainContent>
        <Header>
          {/* Header content */}
        </Header>
        {/* Page content */}
      </MainContent>
    </AppShell>
  )
}
```

### Grid System

```typescript
// Responsive grid utilities
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {/* Grid items */}
</div>

// Auto-fit grid (responsive without breakpoints)
<div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
  {/* Grid items */}
</div>

// Dashboard grid
<div className="grid grid-cols-12 gap-4">
  <div className="col-span-12 lg:col-span-8">
    {/* Main content */}
  </div>
  <div className="col-span-12 lg:col-span-4">
    {/* Sidebar */}
  </div>
</div>
```

---

## Responsive Design

### Breakpoint System

```typescript
// Tailwind breakpoints (included in config)
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px

// Usage examples
<div className="
  text-sm sm:text-base md:text-lg
  p-4 md:p-6 lg:p-8
  grid-cols-1 md:grid-cols-2 lg:grid-cols-3
">
  Responsive element
</div>
```

### Container Widths

```typescript
// Max-width containers
<div className="container mx-auto px-4">
  {/* Responsive container */}
</div>

// Custom max-widths
<div className="mx-auto max-w-sm">   {/* 384px */}
<div className="mx-auto max-w-md">   {/* 448px */}
<div className="mx-auto max-w-lg">   {/* 512px */}
<div className="mx-auto max-w-xl">   {/* 576px */}
<div className="mx-auto max-w-2xl">  {/* 672px */}
<div className="mx-auto max-w-4xl">  {/* 896px */}
<div className="mx-auto max-w-6xl">  {/* 1152px */}
<div className="mx-auto max-w-7xl">  {/* 1280px */}
```

---

## Accessibility Guidelines

### Focus Management

```typescript
// Always provide visible focus indicators
<button className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
  Accessible Button
</button>

// Skip to main content link
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4">
  Skip to main content
</a>
```

### ARIA Labels

```typescript
// Icon buttons need labels
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>

// Loading states
<button disabled aria-busy="true" aria-label="Loading...">
  <Loader className="h-4 w-4 animate-spin" />
</button>

// Form inputs
<label htmlFor="email" className="text-sm font-medium">
  Email
</label>
<input
  id="email"
  type="email"
  aria-describedby="email-description"
  aria-invalid={hasError}
/>
```

### Semantic HTML

```typescript
// Use proper heading hierarchy
<h1>Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>

// Use semantic elements
<nav aria-label="Main navigation">
<main id="main-content">
<article>
<aside aria-label="Related content">
<footer>
```

### Color Contrast

All color combinations meet WCAG 2.1 AA standards:
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- Interactive components: 3:1 contrast ratio

---

## Animation Best Practices

### Performance Optimizations

```css
/* Only animate transform and opacity for best performance */
.optimized-animation {
  transition: transform 200ms, opacity 200ms;
  will-change: transform, opacity;
}

/* Avoid animating expensive properties */
/* ❌ Bad */
.slow {
  transition: width 200ms, height 200ms;
}

/* ✅ Good */
.fast {
  transition: transform 200ms;
  transform: scale(1.1);
}
```

### Loading States

```typescript
// Skeleton screens
<div className="space-y-3">
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-12 w-3/4" />
</div>

// Spinner
<div className="flex items-center justify-center">
  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
</div>

// Progress bar
<div className="h-1 w-full bg-muted">
  <div
    className="h-full bg-primary transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>
```

---

## Utility Functions

### cn() - Class Name Utility

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage
<div className={cn(
  'base-classes',
  condition && 'conditional-class',
  className // Allow prop override
)} />
```

### Theme Toggle Hook

```typescript
'use client'

import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  return { theme, setTheme }
}
```

### useMediaQuery Hook

```typescript
'use client'

import { useEffect, useState } from 'react'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

// Usage
const isMobile = useMediaQuery('(max-width: 768px)')
```

---

## Icon System

### Recommended Icon Library

Use **Lucide React** for consistent, lightweight icons:

```bash
bun add lucide-react
```

```typescript
import {
  Home,
  Settings,
  User,
  Search,
  Menu,
  X,
  ChevronRight,
  Plus,
  Trash2,
} from 'lucide-react'

// Usage
<Search className="h-4 w-4 text-muted-foreground" />
<Settings className="h-5 w-5" />
```

### Icon Sizes

```typescript
// Standard sizes
<Icon className="h-3 w-3" />  // 12px - tiny
<Icon className="h-4 w-4" />  // 16px - small
<Icon className="h-5 w-5" />  // 20px - medium
<Icon className="h-6 w-6" />  // 24px - large
<Icon className="h-8 w-8" />  // 32px - xlarge
```

---

## Form Patterns

### Form with Validation

```typescript
'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormData = z.infer<typeof formSchema>

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    // Handle form submission
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={!!errors.email}
          className={errors.email ? 'border-error' : ''}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-error">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Password
        </label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          aria-invalid={!!errors.password}
          className={errors.password ? 'border-error' : ''}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-error">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Loading...' : 'Sign In'}
      </Button>
    </form>
  )
}
```

---

## Performance Checklist

### Bundle Size Optimization

- Use dynamic imports for heavy components
- Tree-shake unused code
- Use font subsetting for custom fonts
- Lazy load images with Next.js Image component

```typescript
// Dynamic imports
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton className="h-64 w-full" />,
})

// Image optimization (Next.js)
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={500}
  height={300}
  loading="lazy"
  placeholder="blur"
/>
```

### Runtime Performance

```typescript
// Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data)
}, [data])

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething()
}, [])

// Virtualize long lists
import { useVirtualizer } from '@tanstack/react-virtual'
```

---

## Dark Mode Implementation

### Complete Dark Mode Setup

```typescript
// app/providers.tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </NextThemesProvider>
  )
}

// components/theme-toggle.tsx
'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
```

---

## Testing Guidelines

### Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows disabled state', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

---

## Migration Guide

### From Existing Project

1. Install dependencies:
```bash
bun add tailwindcss autoprefixer postcss
bun add class-variance-authority clsx tailwind-merge
bun add lucide-react
bun add @radix-ui/react-dialog @radix-ui/react-dropdown-menu
```

2. Copy Tailwind config and CSS variables

3. Update `globals.css` with the design tokens

4. Replace components gradually, starting with buttons and inputs

5. Test accessibility with automated tools (axe DevTools)

---

## Best Practices Summary

### Visual Design
- Stick to monochrome palette with minimal accent usage
- Use Inter font family consistently
- Maintain 4px spacing scale
- Apply subtle shadows and glassmorphism

### Performance
- Animate only transform and opacity
- Use CSS variables for theming
- Lazy load heavy components
- Virtualize long lists

### Accessibility
- Provide focus indicators on all interactive elements
- Use semantic HTML
- Include ARIA labels for icons and dynamic content
- Test with keyboard navigation
- Maintain WCAG 2.1 AA contrast ratios

### Developer Experience
- Use TypeScript for type safety
- Implement consistent naming conventions
- Document component APIs
- Provide usage examples
- Write tests for critical paths

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [Linear Design Case Study](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Next.js Documentation](https://nextjs.org/)

---

*Last updated: 2025-11-24*
*Version: 1.0.0*
