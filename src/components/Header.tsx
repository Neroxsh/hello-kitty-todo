import addButton from "../assets/icons/add_button.png";
import catHead from "../assets/icons/cat_head.png";
import filterButton from "../assets/icons/filter_button.png";
import topBow from "../assets/icons/top_bow.png";
import type { MouseEvent } from "react";
import type { FilterType } from "../types/todo";

interface HeaderProps {
  dateLabel: string;
  filter: FilterType;
  isFilterOpen: boolean;
  onAddClick: () => void;
  onFilterClick: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const FILTER_LABELS: Record<FilterType, string> = {
  all: "全部",
  active: "未完成",
  completed: "已完成",
  favorite: "收藏",
};

export function Header({
  dateLabel,
  filter,
  isFilterOpen,
  onAddClick,
  onFilterClick,
  onDragStart,
  onDragEnd,
}: HeaderProps) {
  function handleDragMouseDown(event: MouseEvent<HTMLElement>) {
    if (event.button !== 0) {
      return;
    }

    onDragStart();
  }

  return (
    <>
      <img className="top-bow" src={topBow} alt="" aria-hidden="true" />
      <header className="widget-header" onPointerUp={onDragEnd}>
        <div className="drag-zone cat-zone" data-tauri-drag-region onMouseDown={handleDragMouseDown}>
          <img className="cat-head" src={catHead} alt="" aria-hidden="true" />
        </div>
        <div className="title-group drag-zone" data-tauri-drag-region onMouseDown={handleDragMouseDown}>
          <h1>我的任务</h1>
          <p>{dateLabel}</p>
        </div>
        <div className="header-actions">
          <button
            className="image-button"
            type="button"
            title="添加任务"
            aria-label="添加任务"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onAddClick}
          >
            <img src={addButton} alt="" aria-hidden="true" />
          </button>
          <button
            className={`image-button ${isFilterOpen ? "active" : ""}`}
            type="button"
            title={`当前筛选：${FILTER_LABELS[filter]}`}
            aria-label="打开筛选菜单"
            aria-expanded={isFilterOpen}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onFilterClick}
          >
            <img src={filterButton} alt="" aria-hidden="true" />
          </button>
        </div>
      </header>
    </>
  );
}
