import { createDebugLogger } from "./logger";

interface Callbacks {
  onSelect?: (anchorNode: Node, focusNode: Node, text: string) => void;
  onMouseDown?: () => void;
}
const logger = createDebugLogger("components:setup-select-callback");
/**
 *
 * @param onSelect
 * @returns
 */
export function setSelectCallback(callbacks: Callbacks): () => void {
  const onMouseUp = () => {
    const selection = document.getSelection();
    if (!selection || !selection.rangeCount || selection.isCollapsed) {
      logger("No selection or collapsed selection");
      return;
    }

    const anchorNode = selection.anchorNode;
    const focusNode = selection.focusNode;
    if (!anchorNode || !focusNode) {
      logger("No anchor or focus node found");
      return;
    }
    callbacks.onSelect?.(anchorNode, focusNode, selection.toString());
    // Clear the selection after handling the callback
  };

  const onMouseDown = () => {
    // This can be used to handle mouse down events if needed
    callbacks.onMouseDown?.();
    logger("Mouse down event handled");
  };

  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("mousedown", onMouseDown);

  logger("Selection callback installed");

  return () => {
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("mousedown", onMouseDown);
    logger("Selection callback removed");
  };
}
