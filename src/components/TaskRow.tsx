import { useEffect } from "react";
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

function getProgressPercent(item: TodoItem): number {
  if (!item.deadline) return 0;
  const now = Date.now();
  if (now >= item.deadline) return 100;
  const totalDuration = item.deadline - item.createdAt;
  if (totalDuration <= 0) return 0;
  const elapsed = now - item.createdAt;
  const pct = (elapsed / totalDuration) * 100;
  return Math.min(99, Math.max(1, pct));
}

function formatDeadline(ts: number): string {
  const d = new Date(ts);
  const M = d.getMonth() + 1;
  const D = d.getDate();
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${M}/${D} ${h}:${m}`;
}

function isOverdue(ts: number): boolean {
  return Date.now() > ts;
}

export function TaskRow({ item, onToggleCompleted, onToggleFavorite, onRemove }: TaskRowProps) {
  const hasDeadline = typeof item.deadline === "number";

  useEffect(() => {
    if (!hasDeadline) return;
    const el = document.getElementById(`task-row-${item.id}`);
    if (!el) return;

    let rafId: number;
    function update() {
      const pct = getProgressPercent(item);
      el!.style.setProperty("--progress", `${pct}%`);
      rafId = requestAnimationFrame(update);
    }
    rafId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(rafId);
  }, [item.id, item.deadline, item.createdAt, hasDeadline]);

  const initialProgress = hasDeadline ? getProgressPercent(item) : 0;

  return (
    <li
      id={`task-row-${item.id}`}
      className={`task-row ${item.completed ? "completed" : ""} ${hasDeadline ? "has-progress" : ""}`}
      style={hasDeadline ? ({ "--progress": `${initialProgress}%` }) as React.CSSProperties : undefined}
    >
      <button
        className="status-button"
        type="button"
        title={item.completed ? "标记为未完成" : "标记为已完成"}
        aria-label={item.completed ? "标记为未完成" : "标记为已完成"}
        onClick={() => onToggleCompleted(item.id)}
      >
        <img src={item.completed ? checkFilled : checkEmpty} alt="" aria-hidden="true" />
      </button>
      <div className="task-text-wrap">
        <span className="task-text">{item.text}</span>
        <div className="task-meta">
          {item.importance > 0 && (
            <span className="task-importance" title={`${item.importance} 星重要`}>
              {Array.from({ length: item.importance }, (_, i) => (
                <span key={i}>★</span>
              ))}
            </span>
          )}
          {hasDeadline && (
            <span className={`task-deadline ${isOverdue(item.deadline!) && !item.completed ? "overdue" : ""}`}>
              📅 {formatDeadline(item.deadline!)}
            </span>
          )}
        </div>
      </div>
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