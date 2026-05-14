import { listen } from "@tauri-apps/api/event";
import { PhysicalPosition, PhysicalSize } from "@tauri-apps/api/dpi";
import { getCurrentWindow } from "@tauri-apps/api/window";
import type { WidgetPosition } from "../types/todo";

function isTauriRuntime(): boolean {
  return "__TAURI_INTERNALS__" in window;
}

export function startWindowDrag(): void {
  if (!isTauriRuntime()) {
    return;
  }

  // Must be called synchronously inside a mouse event so Tauri can keep the native drag context alive.
  getCurrentWindow().startDragging().catch(() => undefined);
}

export async function setWindowPinned(pinned: boolean): Promise<void> {
  if (!isTauriRuntime()) {
    return;
  }

  await getCurrentWindow().setAlwaysOnTop(pinned);
}

export async function setWindowPosition(position?: WidgetPosition): Promise<void> {
  if (!isTauriRuntime() || !position) {
    return;
  }

  await getCurrentWindow().setPosition(new PhysicalPosition(Math.round(position.x), Math.round(position.y)));
}

export async function readWindowPosition(): Promise<WidgetPosition | undefined> {
  if (!isTauriRuntime()) {
    return undefined;
  }

  const position = await getCurrentWindow().outerPosition();
  return { x: position.x, y: position.y };
}

export async function setWidgetWindowHeight(height: number): Promise<void> {
  if (!isTauriRuntime() || height <= 0) {
    return;
  }

  const window = getCurrentWindow();
  const currentSize = await window.outerSize();
  await window.setSize(new PhysicalSize(currentSize.width, Math.round(height)));
}

export async function readWindowHeight(): Promise<number | undefined> {
  if (!isTauriRuntime()) {
    return undefined;
  }

  const size = await getCurrentWindow().outerSize();
  return size.height;
}

export async function listenToWindowEvents(
  onPinChanged: (pinned: boolean) => void,
  onPositionReset: (position: WidgetPosition) => void,
  onWindowMoved: (position: WidgetPosition) => void,
): Promise<() => void> {
  if (!isTauriRuntime()) {
    return () => undefined;
  }

  const unlistenPin = await listen<boolean>("pin-changed", (event) => onPinChanged(Boolean(event.payload)));
  const unlistenReset = await listen<WidgetPosition>("position-reset", (event) => onPositionReset(event.payload));
  const unlistenMoved = await getCurrentWindow().onMoved(({ payload }) => onWindowMoved({ x: payload.x, y: payload.y }));

  return () => {
    unlistenPin();
    unlistenReset();
    unlistenMoved();
  };
}
