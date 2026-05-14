import { type MouseEvent, useCallback, useRef } from "react";
import { readWindowHeight, setWidgetWindowHeight } from "../hooks/useWidgetWindow";

interface ResizeHandleProps {
  minHeight: number;
  onResizeEnd: (height: number) => void;
}

export function ResizeHandle({ minHeight, onResizeEnd }: ResizeHandleProps) {
  const startY = useRef(0);
  const startHeight = useRef(0);

  const onMouseDown = useCallback(
    async (event: MouseEvent<HTMLElement>) => {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      startY.current = event.screenY;
      startHeight.current = (await readWindowHeight()) ?? 0;

      function onMouseMove(moveEvent: globalThis.MouseEvent) {
        const deltaY = moveEvent.screenY - startY.current;
        const nextHeight = Math.max(minHeight, startHeight.current + deltaY);
        void setWidgetWindowHeight(nextHeight);
      }

      function onMouseUp(_upEvent: globalThis.MouseEvent) {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        const el = document.getElementById("widget-card") as HTMLElement | null;
        if (el) {
          onResizeEnd(el.offsetHeight);
        }
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [minHeight, onResizeEnd],
  );

  return <div className="resize-handle" onMouseDown={onMouseDown} />;
}