import type { WidgetPosition } from "../types/todo";

function isTauriRuntime(): boolean {
  return "__TAURI_INTERNALS__" in window;
}

export async function startWindowDrag(): Promise<void> {
  if (!isTauriRuntime()) {
    return;
  }

  const { getCurrentWindow } = await import("@tauri-apps/api/window");
  await getCurrentWindow().startDragging();
}

export async function setWindowPinned(pinned: boolean): Promise<void> {
  if (!isTauriRuntime()) {
    return;
  }

  const { getCurrentWindow } = await import("@tauri-apps/api/window");
  await getCurrentWindow().setAlwaysOnTop(pinned);
}

export async function readWindowPosition(): Promise<WidgetPosition | undefined> {
  if (!isTauriRuntime()) {
    return undefined;
  }

  const { getCurrentWindow } = await import("@tauri-apps/api/window");
  const position = await getCurrentWindow().outerPosition();
  return { x: position.x, y: position.y };
}

export async function listenToWindowEvents(
  onPinChanged: (pinned: boolean) => void,
  onPositionReset: (position: WidgetPosition) => void,
): Promise<() => void> {
  if (!isTauriRuntime()) {
    return () => undefined;
  }

  const { listen } = await import("@tauri-apps/api/event");
  const unlistenPin = await listen<boolean>("pin-changed", (event) => onPinChanged(Boolean(event.payload)));
  const unlistenReset = await listen<WidgetPosition>("position-reset", (event) => onPositionReset(event.payload));

  return () => {
    unlistenPin();
    unlistenReset();
  };
}
