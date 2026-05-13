import addButton from "../assets/icons/add_button.png";
import catHead from "../assets/icons/cat_head.png";
import filterButton from "../assets/icons/filter_button.png";
import topBow from "../assets/icons/top_bow.png";
import type { FilterType } from "../types/todo";

interface HeaderProps {
  dateLabel: string;
  filter: FilterType;
  isFilterOpen: boolean;
  onAddClick: () => void;
  onFilterClick: () => void;
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
  onDragEnd,
}: HeaderProps) {
  return (
    <>
      <img className="top-bow" src={topBow} alt="" aria-hidden="true" />
      <header className="widget-header">
        <img className="cat-head" src={catHead} alt="" aria-hidden="true" data-tauri-drag-region onPointerUp={onDragEnd} />
        <div className="title-group" data-tauri-drag-region onPointerUp={onDragEnd}>
          <h1>我的任务</h1>
          <p>{dateLabel}</p>
        </div>
        <div className="header-actions">
          <button
            className="image-button"
            type="button"
            title="添加任务"
            aria-label="添加任务"
            onPointerDown={(event) => event.stopPropagation()}
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
            onPointerDown={(event) => event.stopPropagation()}
            onClick={onFilterClick}
          >
            <img src={filterButton} alt="" aria-hidden="true" />
          </button>
        </div>
      </header>
    </>
  );
}
