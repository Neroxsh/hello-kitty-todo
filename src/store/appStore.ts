import { createInitialState } from "./defaultState";
import type { AppState, FilterType, TodoItem } from "../types/todo";

const STORAGE_KEY = "hello-kitty-todo-state";
const STORE_FILE = "store.json";
const STORE_KEY = "app-state";

type TauriStore = {
  get<T>(key: string): Promise<T | undefined>;
  set(key: string, value: unknown): Promise<void>;
  save(): Promise<void>;
};

let tauriStorePromise: Promise<TauriStore | null> | null = null;

function isTauriRuntime(): boolean {
  return "__TAURI_INTERNALS__" in window;
}

async function getTauriStore(): Promise<TauriStore | null> {
  if (!isTauriRuntime()) {
    return null;
  }

  tauriStorePromise = tauriStorePromise ?? import("@tauri-apps/plugin-store")
    .then(({ Store }) => Store.load(STORE_FILE, { defaults: {}, autoSave: false }))
    .catch(() => null);

  return tauriStorePromise;
}

function isFilterType(value: unknown): value is FilterType {
  return value === "all" || value === "active" || value === "completed" || value === "favorite";
}

function normalizeItem(item: Partial<TodoItem>, fallbackOrder: number): TodoItem | null {
  if (typeof item.text !== "string" || item.text.trim().length === 0) {
    return null;
  }

  const now = Date.now();

  return {
    id: typeof item.id === "string" ? item.id : crypto.randomUUID(),
    text: item.text.trim(),
    completed: Boolean(item.completed),
    favorite: Boolean(item.favorite),
    order: typeof item.order === "number" ? item.order : fallbackOrder,
    createdAt: typeof item.createdAt === "number" ? item.createdAt : now,
    updatedAt: typeof item.updatedAt === "number" ? item.updatedAt : now,
  };
}

export function normalizeState(value: unknown): AppState {
  const initial = createInitialState();

  if (!value || typeof value !== "object") {
    return initial;
  }

  const state = value as Partial<AppState>;
  const items = Array.isArray(state.items)
    ? state.items
        .map((item, index) => normalizeItem(item as Partial<TodoItem>, index + 1))
        .filter((item): item is TodoItem => item !== null)
        .sort((a, b) => a.order - b.order)
    : initial.items;

  return {
    items,
    filter: isFilterType(state.filter) ? state.filter : initial.filter,
    alwaysOnTop: typeof state.alwaysOnTop === "boolean" ? state.alwaysOnTop : initial.alwaysOnTop,
    theme: "pink",
    widgetPosition:
      state.widgetPosition &&
      typeof state.widgetPosition.x === "number" &&
      typeof state.widgetPosition.y === "number"
        ? state.widgetPosition
        : initial.widgetPosition,
    widgetHeight:
      typeof state.widgetHeight === "number" && state.widgetHeight > 0
        ? state.widgetHeight
        : initial.widgetHeight,
  };
}

export async function loadAppState(): Promise<AppState> {
  const store = await getTauriStore();

  if (store) {
    const savedState = await store.get<AppState>(STORE_KEY);
    return normalizeState(savedState);
  }

  const rawState = window.localStorage.getItem(STORAGE_KEY);
  return normalizeState(rawState ? JSON.parse(rawState) : null);
}

export async function saveAppState(state: AppState): Promise<void> {
  const store = await getTauriStore();

  if (store) {
    await store.set(STORE_KEY, state);
    await store.save();
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
