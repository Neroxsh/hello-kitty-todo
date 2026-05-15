import { useCallback, useEffect, useMemo, useState } from "react";
import { createInitialState } from "../store/defaultState";
import { loadAppState, saveAppState } from "../store/appStore";
import { readWindowHeight, readWindowPosition, setWindowPinned, setWindowPosition, setWidgetWindowHeight } from "./useWidgetWindow";
import type { AppState, FilterType, SortMode, TodoItem, WidgetPosition } from "../types/todo";

function createId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getUrgencyScore(item: TodoItem, now: number): number {
  if (!item.deadline) {
    return 0;
  }
  if (now >= item.deadline) {
    return 1;
  }
  const totalDuration = item.deadline - item.createdAt;
  if (totalDuration <= 0) {
    return 0;
  }
  const elapsed = now - item.createdAt;
  return elapsed / totalDuration;
}

export function useTodos() {
  const [state, setState] = useState<AppState>(() => createInitialState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadAppState().then((savedState) => {
      if (!cancelled) {
        setState(savedState);
        setHydrated(true);
        void setWindowPinned(savedState.alwaysOnTop);
        void setWindowPosition(savedState.widgetPosition);
        if (savedState.widgetHeight) {
          void setWidgetWindowHeight(savedState.widgetHeight);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    void saveAppState(state);
  }, [hydrated, state]);

  const visibleItems = useMemo(() => {
    const sorted = [...state.items].sort((a, b) => {
      switch (state.sortMode) {
        case "importance":
          return b.importance - a.importance || a.order - b.order;
        case "deadline": {
          if (!a.deadline && !b.deadline) return a.order - b.order;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return a.deadline - b.deadline || a.order - b.order;
        }
        case "smart": {
          const now = Date.now();
          const scoreA = 0.4 * (a.importance / 5) + 0.6 * getUrgencyScore(a, now);
          const scoreB = 0.4 * (b.importance / 5) + 0.6 * getUrgencyScore(b, now);
          return scoreB - scoreA || a.order - b.order;
        }
        default:
          return a.order - b.order;
      }
    });

    switch (state.filter) {
      case "active":
        return sorted.filter((item) => !item.completed);
      case "completed":
        return sorted.filter((item) => item.completed);
      case "favorite":
        return sorted.filter((item) => item.favorite);
      default:
        return sorted;
    }
  }, [state.filter, state.sortMode, state.items]);

  const addTodo = useCallback((text: string, importance = 0, deadline?: number) => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    setState((currentState) => {
      const now = Date.now();
      const nextOrder = currentState.items.reduce((maxOrder, item) => Math.max(maxOrder, item.order), 0) + 1;
      const nextItem: TodoItem = {
        id: createId(),
        text: trimmedText,
        completed: false,
        favorite: false,
        order: nextOrder,
        createdAt: now,
        updatedAt: now,
        importance,
        deadline,
      };

      return { ...currentState, items: [...currentState.items, nextItem] };
    });
  }, []);

  const removeTodo = useCallback((id: string) => {
    setState((currentState) => ({
      ...currentState,
      items: currentState.items.filter((item) => item.id !== id),
    }));
  }, []);

  const toggleCompleted = useCallback((id: string) => {
    setState((currentState) => ({
      ...currentState,
      items: currentState.items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed, updatedAt: Date.now() } : item,
      ),
    }));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setState((currentState) => ({
      ...currentState,
      items: currentState.items.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite, updatedAt: Date.now() } : item,
      ),
    }));
  }, []);

  const setFilter = useCallback((filter: FilterType) => {
    setState((currentState) => ({ ...currentState, filter }));
  }, []);

  const setSortMode = useCallback((sortMode: SortMode) => {
    setState((currentState) => ({ ...currentState, sortMode }));
  }, []);

  const setPinned = useCallback((alwaysOnTop: boolean) => {
    setState((currentState) => ({ ...currentState, alwaysOnTop }));
    void setWindowPinned(alwaysOnTop);
  }, []);

  const setWidgetPosition = useCallback((widgetPosition: WidgetPosition) => {
    setState((currentState) => ({ ...currentState, widgetPosition }));
  }, []);

  const setWidgetHeight = useCallback((widgetHeight: number) => {
    setState((currentState) => ({ ...currentState, widgetHeight }));
  }, []);

  const saveCurrentWindowPosition = useCallback(async () => {
    const widgetPosition = await readWindowPosition();

    if (widgetPosition) {
      setWidgetPosition(widgetPosition);
    }
  }, [setWidgetPosition]);

  const saveWidgetHeight = useCallback(async (height?: number) => {
    const h = height ?? (await readWindowHeight());

    if (h) {
      setWidgetHeight(h);
    }
  }, [setWidgetHeight]);

  return {
    state,
    visibleItems,
    hydrated,
    addTodo,
    removeTodo,
    toggleCompleted,
    toggleFavorite,
    setFilter,
    setSortMode,
    setPinned,
    setWidgetPosition,
    setWidgetHeight,
    saveCurrentWindowPosition,
    saveWidgetHeight,
  };
}
