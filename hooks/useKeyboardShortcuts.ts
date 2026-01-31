"use client";

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
}

/**
 * Hook for handling keyboard shortcuts
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in input/textarea
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        // Check if modifier requirements are met
        const ctrlRequired = shortcut.ctrl === true;
        const shiftRequired = shortcut.shift === true;
        const altRequired = shortcut.alt === true;

        // For ctrl, accept either ctrlKey or metaKey (for Mac)
        const ctrlMatch = ctrlRequired ? (event.ctrlKey || event.metaKey) : !(event.ctrlKey || event.metaKey);
        const shiftMatch = shiftRequired ? event.shiftKey : !event.shiftKey;
        const altMatch = altRequired ? event.altKey : !event.altKey;

        // For shortcuts with modifiers, allow even in input fields
        const hasModifier = ctrlRequired || altRequired;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          // Only block simple key shortcuts in input fields (like Escape)
          if (isInputField && !hasModifier) {
            continue;
          }

          event.preventDefault();
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Default keyboard shortcuts for the Regex Builder
 */
export function createDefaultShortcuts(handlers: {
  onTest?: () => void;
  onSave?: () => void;
  onClear?: () => void;
  onCopy?: () => void;
  onUndo?: () => void;
}): KeyboardShortcut[] {
  const shortcuts: KeyboardShortcut[] = [];

  if (handlers.onTest) {
    shortcuts.push({
      key: 'Enter',
      ctrl: true,
      action: handlers.onTest,
      description: 'Test pattern',
    });
  }

  if (handlers.onSave) {
    shortcuts.push({
      key: 's',
      ctrl: true,
      action: handlers.onSave,
      description: 'Save pattern',
    });
  }

  if (handlers.onClear) {
    shortcuts.push({
      key: 'Escape',
      action: handlers.onClear,
      description: 'Clear pattern',
    });
  }

  if (handlers.onCopy) {
    shortcuts.push({
      key: 'c',
      ctrl: true,
      shift: true,
      action: handlers.onCopy,
      description: 'Copy pattern',
    });
  }

  if (handlers.onUndo) {
    shortcuts.push({
      key: 'z',
      ctrl: true,
      action: handlers.onUndo,
      description: 'Undo last block',
    });
  }

  return shortcuts;
}

/**
 * Get human-readable shortcut description
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  if (shortcut.ctrl) {
    parts.push(isMac ? '⌘' : 'Ctrl');
  }
  if (shortcut.alt) {
    parts.push(isMac ? '⌥' : 'Alt');
  }
  if (shortcut.shift) {
    parts.push(isMac ? '⇧' : 'Shift');
  }

  // Format special keys
  let keyLabel = shortcut.key;
  switch (shortcut.key.toLowerCase()) {
    case 'enter':
      keyLabel = '↵';
      break;
    case 'escape':
      keyLabel = 'Esc';
      break;
    case 'arrowup':
      keyLabel = '↑';
      break;
    case 'arrowdown':
      keyLabel = '↓';
      break;
    case 'arrowleft':
      keyLabel = '←';
      break;
    case 'arrowright':
      keyLabel = '→';
      break;
    default:
      keyLabel = shortcut.key.toUpperCase();
  }

  parts.push(keyLabel);
  return parts.join(isMac ? '' : '+');
}
