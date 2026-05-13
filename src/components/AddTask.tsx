import { KeyboardEvent, useEffect, useRef, useState } from "react";

interface AddTaskProps {
  isAdding: boolean;
  onCancel: () => void;
  onAdd: (text: string) => void;
}

export function AddTask({ isAdding, onCancel, onAdd }: AddTaskProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus();
    } else {
      setText("");
    }
  }, [isAdding]);

  function saveTask() {
    if (text.trim()) {
      onAdd(text);
      setText("");
      onCancel();
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      saveTask();
    }

    if (event.key === "Escape") {
      setText("");
      onCancel();
    }
  }

  if (isAdding) {
    return (
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
            onCancel();
          }}
        >
          ×
        </button>
      </div>
    );
  }

  return null;
}
