import { KeyboardEvent, useEffect, useRef, useState } from "react";

interface AddTaskProps {
  isAdding: boolean;
  onCancel: () => void;
  onAdd: (text: string, importance: number, deadline?: number) => void;
}

function toDatetimeStr(ts: number): string {
  const d = new Date(ts);
  const Y = d.getFullYear();
  const M = String(d.getMonth() + 1).padStart(2, "0");
  const D = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${Y}-${M}-${D}T${h}:${m}`;
}

const STAR_COUNT = 5;

export function AddTask({ isAdding, onCancel, onAdd }: AddTaskProps) {
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [importance, setImportance] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus();
    } else {
      setText("");
      setDeadline("");
      setImportance(0);
      setHoverStar(0);
    }
  }, [isAdding]);

  function saveTask() {
    const trimmed = text.trim();
    if (!trimmed) return;

    const deadlineTs = deadline ? new Date(deadline).getTime() : undefined;
    onAdd(trimmed, importance, deadlineTs);
    setText("");
    setDeadline("");
    setImportance(0);
    setHoverStar(0);
    onCancel();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      saveTask();
    }
    if (event.key === "Escape") {
      setText("");
      setDeadline("");
      setImportance(0);
      setHoverStar(0);
      onCancel();
    }
  }

  if (!isAdding) {
    return null;
  }

  const minDate = toDatetimeStr(Date.now());

  return (
    <div className="add-task-panel">
      <div className="add-task-input-shell">
        <input
          ref={inputRef}
          value={text}
          placeholder="今天要做什么？"
          aria-label="今天要做什么？"
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="button" title="保存任务" aria-label="保存任务" onClick={saveTask}>
          ✓
        </button>
        <button
          type="button"
          className="cancel-add"
          title="取消添加"
          aria-label="取消添加"
          onClick={() => {
            setText("");
            setDeadline("");
            setImportance(0);
            setHoverStar(0);
            onCancel();
          }}
        >
          ×
        </button>
      </div>
      <div className="add-task-extra">
        <label className="deadline-field">
          <span className="field-label">📅 截止日期</span>
          <input
            type="datetime-local"
            value={deadline}
            min={minDate}
            onChange={(e) => setDeadline(e.target.value)}
          />
          {deadline && (
            <button
              type="button"
              className="clear-field"
              title="清除日期"
              aria-label="清除日期"
              onClick={() => setDeadline("")}
            >
              ×
            </button>
          )}
        </label>
        <div className="importance-field">
          <span className="field-label">⭐ 重要程度</span>
          <div className="star-row">
            {Array.from({ length: STAR_COUNT }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`star-btn ${i < (hoverStar || importance) ? "active" : ""}`}
                title={`${i + 1} 星`}
                aria-label={`${i + 1} 星`}
                onMouseEnter={() => setHoverStar(i + 1)}
                onMouseLeave={() => setHoverStar(0)}
                onClick={() => setImportance(i + 1 === importance ? 0 : i + 1)}
              >
                ★
              </button>
            ))}
            {importance > 0 && (
              <button
                type="button"
                className="clear-field"
                title="清除重要程度"
                aria-label="清除重要程度"
                onClick={() => setImportance(0)}
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}