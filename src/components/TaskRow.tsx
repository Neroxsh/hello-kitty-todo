import checkEmpty from "../assets/icons/check_empty.png";
import checkFilled from "../assets/icons/check_filled.png";
import heartFilled from "../assets/icons/heart_filled.png";
import heartOutline from "../assets/icons/heart_outline.png";
import type { TodoItem } from "../types/todo";

interface TaskRowProps {
  item: TodoItem;
  onToggleCompleted: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
}

export function TaskRow({ item, onToggleCompleted, onToggleFavorite, onRemove }: TaskRowProps) {
  return (
    <li className={`task-row ${item.completed ? "completed" : ""}`}>
      <button
        className="status-button"
        type="button"
        title={item.completed ? "标记为未完成" : "标记为已完成"}
        aria-label={item.completed ? "标记为未完成" : "标记为已完成"}
        onClick={() => onToggleCompleted(item.id)}
      >
        <img src={item.completed ? checkFilled : checkEmpty} alt="" aria-hidden="true" />
      </button>
      <span className="task-text">{item.text}</span>
      <button
        className="favorite-button"
        type="button"
        title={item.favorite ? "取消收藏" : "收藏任务"}
        aria-label={item.favorite ? "取消收藏" : "收藏任务"}
        onClick={() => onToggleFavorite(item.id)}
      >
        <img src={item.favorite ? heartFilled : heartOutline} alt="" aria-hidden="true" />
      </button>
      <button
        className="delete-button"
        type="button"
        title="删除任务"
        aria-label="删除任务"
        onClick={() => onRemove(item.id)}
      >
        ×
      </button>
    </li>
  );
}
