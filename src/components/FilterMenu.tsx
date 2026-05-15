import type { FilterType, SortMode } from "../types/todo";

interface FilterMenuProps {
  activeFilter: FilterType;
  sortMode: SortMode;
  onSelect: (filter: FilterType) => void;
  onSortChange: (mode: SortMode) => void;
}

const filters: Array<{ value: FilterType; label: string }> = [
  { value: "all", label: "全部" },
  { value: "active", label: "未完成" },
  { value: "completed", label: "已完成" },
  { value: "favorite", label: "收藏" },
];

const sorts: Array<{ value: SortMode; label: string }> = [
  { value: "manual", label: "📋 默认顺序" },
  { value: "importance", label: "⭐ 重要程度" },
  { value: "deadline", label: "📅 截止日期" },
  { value: "smart", label: "🧠 智能排序" },
];

export function FilterMenu({ activeFilter, sortMode, onSelect, onSortChange }: FilterMenuProps) {
  return (
    <div className="filter-menu" role="menu" aria-label="筛选与排序">
      {filters.map((filter) => (
        <button
          key={filter.value}
          className={activeFilter === filter.value ? "selected" : ""}
          type="button"
          role="menuitemradio"
          aria-checked={activeFilter === filter.value}
          onClick={() => onSelect(filter.value)}
        >
          {filter.label}
        </button>
      ))}
      <div className="filter-divider" />
      {sorts.map((sort) => (
        <button
          key={sort.value}
          className={sortMode === sort.value ? "selected" : ""}
          type="button"
          role="menuitemradio"
          aria-checked={sortMode === sort.value}
          onClick={() => onSortChange(sort.value)}
        >
          {sort.label}
        </button>
      ))}
    </div>
  );
}