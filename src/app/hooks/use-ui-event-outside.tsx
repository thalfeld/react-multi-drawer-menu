import { RefObject, useCallback, useEffect, useRef } from "react";

const useUiEventOutsideHandler = (rootRef: RefObject<HTMLDivElement>, eventHandler: () => void) => {
    const clickedElement = useRef<EventTarget>();

    const handleOutsideTarget = useCallback(
        (target: EventTarget | undefined) => {
            const domNode = rootRef.current;
            if (!domNode || (target && !domNode.contains(target as Node))) {
                eventHandler();
            }
        },
        [eventHandler, rootRef]
    );

    // Simply using "click" as the event handler unfortunately doesn't cover
    // edge cases such as dragging, where the intial DOM element is the one we want to check on.
    // That's why we need to save the element that was actually clicked on during "mousedown" and
    // use that during "mouseup" instead of simply `event.target`.
    const handleMouseUp = useCallback(() => {
        handleOutsideTarget(clickedElement.current);
        clickedElement.current = undefined;
    }, [handleOutsideTarget]);

    const handleMouseDown = useCallback((event: MouseEvent) => {
        clickedElement.current = event.target ? event.target : undefined;
    }, []);

    const handleKeyEvent = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                eventHandler();
            }
            if (event.key === "Tab" && event.target) {
                handleOutsideTarget(event.target);
            }
        },
        [eventHandler, handleOutsideTarget]
    );

    useEffect(() => {
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("keyup", handleKeyEvent);

        return () => {
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("keyup", handleKeyEvent);
        };
    }, [handleOutsideTarget, handleKeyEvent, handleMouseDown, handleMouseUp]);
};

export default useUiEventOutsideHandler;
