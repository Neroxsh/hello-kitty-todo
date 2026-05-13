import type { FilterType } from "../types/todo";

interface FilterMenuProps {
  activeFilter: FilterType;
  onSelect: (filter: FilterType) => void;
}

const filters: Array<{ value: FilterType; label: string }> = [
  { value: "all", label: "全部" },
  { value: "active", label: "未完成" },
  { value: "completed", label: "已完成" },
  { value: "favorite", label: "收藏" },
];

export function FilterMenu({ activeFilter, onSelect }: FilterMenuProps) {
  return (
    <div className="filter-menu" role="menu" aria-label="筛选任务">
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
    </div>
  );
}
