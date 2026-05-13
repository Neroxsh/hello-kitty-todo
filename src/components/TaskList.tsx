import { TaskRow } from "./TaskRow";
import type { TodoItem } from "../types/todo";

interface TaskListProps {
  items: TodoItem[];
  onToggleCompleted: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
}

export function TaskList({ items, onToggleCompleted, onToggleFavorite, onRemove }: TaskListProps) {
  if (items.length === 0) {
    return <div className="empty-state">今天很清爽</div>;
  }

  return (
    <ul className="task-list" aria-label="今日任务">
      {items.map((item) => (
        <TaskRow
          key={item.id}
          item={item}
          onToggleCompleted={onToggleCompleted}
          onToggleFavorite={onToggleFavorite}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}
