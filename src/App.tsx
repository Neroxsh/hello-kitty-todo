import { useEffect, useMemo, useState } from "react";
import { AddTask } from "./components/AddTask";
import { FilterMenu } from "./components/FilterMenu";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { TaskList } from "./components/TaskList";
import { useTodos } from "./hooks/useTodos";
import { listenToWindowEvents, startWindowDrag } from "./hooks/useWidgetWindow";
import { formatTodayLabel } from "./utils/date";

export default function App() {
  const {
    state,
    visibleItems,
    addTodo,
    removeTodo,
    toggleCompleted,
    toggleFavorite,
    setFilter,
    setPinned,
    setWidgetPosition,
    setWidgetHeight,
    saveCurrentWindowPosition,
  } = useTodos();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const dateLabel = useMemo(() => formatTodayLabel(), []);

  useEffect(() => {
    let unlisten: VoidFunction = () => {};

    listenToWindowEvents(
      (pinned) => setPinned(pinned),
      (position) => setWidgetPosition(position),
      (position) => setWidgetPosition(position),
      (height) => setWidgetHeight(height),
    ).then((cleanup) => {
      unlisten = cleanup;
    });

    return () => unlisten();
  }, [setPinned, setWidgetPosition]);

  return (
    <main className="app-stage">
      <section className="widget-shell" aria-label="桌面待办小组件">
        <div id="widget-card" className="widget-card">
          <Header
            dateLabel={dateLabel}
            filter={state.filter}
            isFilterOpen={isFilterOpen}
            onAddClick={() => {
              setIsAdding(true);
              setIsFilterOpen(false);
            }}
            onFilterClick={() => {
              setIsFilterOpen((open) => !open);
              setIsAdding(false);
            }}
            onDragStart={startWindowDrag}
            onDragEnd={() => void saveCurrentWindowPosition()}
          />
          {isFilterOpen ? (
            <FilterMenu
              activeFilter={state.filter}
              onSelect={(filter) => {
                setFilter(filter);
                setIsFilterOpen(false);
              }}
            />
          ) : null}
          <div className="gingham-strip" aria-hidden="true" />
          <TaskList
            items={visibleItems}
            onToggleCompleted={toggleCompleted}
            onToggleFavorite={toggleFavorite}
            onRemove={removeTodo}
          />
          <div className="bottom-area">
            <AddTask isAdding={isAdding} onCancel={() => setIsAdding(false)} onAdd={addTodo} />
            <Footer pinned={state.alwaysOnTop} onTogglePinned={() => setPinned(!state.alwaysOnTop)} />
          </div>
        </div>
      </section>
    </main>
  );
}
