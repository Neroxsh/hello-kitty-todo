import { useCallback, useEffect, useMemo, useState } from "react";
import { createInitialState } from "../store/defaultState";
import { loadAppState, saveAppState } from "../store/appStore";
import { readWindowPosition, setWindowPinned, setWindowPosition } from "./useWidgetWindow";
import type { AppState, FilterType, TodoItem, WidgetPosition } from "../types/todo";

function createId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
    const sorted = [...state.items].sort((a, b) => a.order - b.order);

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
  }, [state.filter, state.items]);

  const addTodo = useCallback((text: string) => {
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
      };

      return { ...currentState, filter: "all", items: [...currentState.items, nextItem] };
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
      filter: currentState.filter === "active" || currentState.filter === "completed" ? "all" : currentState.filter,
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

  const setPinned = useCallback((alwaysOnTop: boolean) => {
    setState((currentState) => ({ ...currentState, alwaysOnTop }));
    void setWindowPinned(alwaysOnTop);
  }, []);

  const setWidgetPosition = useCallback((widgetPosition: WidgetPosition) => {
    setState((currentState) => ({ ...currentState, widgetPosition }));
  }, []);

  const saveCurrentWindowPosition = useCallback(async () => {
    const widgetPosition = await readWindowPosition();

    if (widgetPosition) {
      setWidgetPosition(widgetPosition);
    }
  }, [setWidgetPosition]);

  return {
    state,
    visibleItems,
    hydrated,
    addTodo,
    removeTodo,
    toggleCompleted,
    toggleFavorite,
    setFilter,
    setPinned,
    setWidgetPosition,
    saveCurrentWindowPosition,
  };
}
