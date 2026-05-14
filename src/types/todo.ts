export type FilterType = "all" | "active" | "completed" | "favorite";

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  favorite: boolean;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface AppState {
  items: TodoItem[];
  filter: FilterType;
  alwaysOnTop: boolean;
  theme: "pink";
  widgetPosition?: WidgetPosition;
  widgetHeight?: number;
}
