import type { AppState, TodoItem } from "../types/todo";

const sampleTasks: Array<Pick<TodoItem, "text" | "completed" | "favorite" | "order">> = [
  { text: "完成界面草图", completed: true, favorite: true, order: 1 },
  { text: "回复邮件", completed: true, favorite: true, order: 2 },
  { text: "买奶茶", completed: false, favorite: false, order: 3 },
  { text: "审查 PR", completed: false, favorite: false, order: 4 },
  { text: "给妈妈打电话", completed: true, favorite: true, order: 5 },
  { text: "计划运动", completed: false, favorite: false, order: 6 },
];

export function createInitialState(): AppState {
  const now = Date.now();

  return {
    items: sampleTasks.map((task, index) => ({
      id: String(index + 1),
      text: task.text,
      completed: task.completed,
      favorite: task.favorite,
      order: task.order,
      createdAt: now - (sampleTasks.length - index) * 60_000,
      updatedAt: now - (sampleTasks.length - index) * 60_000,
    })),
    filter: "all",
    alwaysOnTop: true,
    theme: "pink",
    widgetPosition: { x: 980, y: 80 },
    widgetHeight: 592,
  };
}
