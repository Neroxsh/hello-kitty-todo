import type { AppState, TodoItem } from "../types/todo";

const ONE_DAY = 86_400_000;

const sampleTasks: Array<Pick<TodoItem, "text" | "completed" | "favorite" | "order" | "importance" | "deadline">> = [
  { text: "完成界面草图", completed: true, favorite: true, order: 1, importance: 5, deadline: undefined },
  { text: "回复邮件", completed: true, favorite: true, order: 2, importance: 2, deadline: undefined },
  { text: "买奶茶", completed: false, favorite: false, order: 3, importance: 1, deadline: undefined },
  { text: "审查 PR", completed: false, favorite: false, order: 4, importance: 3, deadline: Date.now() + ONE_DAY },
  { text: "给妈妈打电话", completed: true, favorite: true, order: 5, importance: 5, deadline: undefined },
  { text: "计划运动", completed: false, favorite: false, order: 6, importance: 4, deadline: Date.now() + 3 * ONE_DAY },
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
      importance: task.importance,
      deadline: task.deadline,
    })),
    filter: "all",
    sortMode: "manual",
    alwaysOnTop: true,
    theme: "pink",
    widgetPosition: { x: 980, y: 80 },
    widgetHeight: 592,
  };
}
