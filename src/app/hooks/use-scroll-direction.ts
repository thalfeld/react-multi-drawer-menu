import { useEffect, useRef, useState } from "react";
import { throttle } from "../utils/function-utils";

export enum ScrollDirection {
    UP,
    DOWN,
}

export function useScrollPosition() {
    const lastScrollPosition = useRef<number | undefined>(undefined);
    const directionRef = useRef(ScrollDirection.UP);
    const [direction, setDirection] = useState<{
        direction: ScrollDirection;
        x: number;
        y: number;
    }>({
        direction: ScrollDirection.UP,
        x: global.window ? window.pageXOffset : 0,
        y: global.window ? window.pageYOffset : 0,
    });

    function scrollingDown(oldPosition: number, newPosition: number) {
        if (newPosition < 0) {
            // This may occur due to a rubber-band effect
            return false;
        }
        return oldPosition < newPosition;
    }

    const handleDirectionChange = () => {
        if (!lastScrollPosition.current) {
            lastScrollPosition.current = window.pageYOffset;
            return;
        }

        if (lastScrollPosition.current === window.pageYOffset) {
            return;
        }

        const newScrollDirection = scrollingDown(lastScrollPosition.current, window.pageYOffset)
            ? ScrollDirection.DOWN
            : ScrollDirection.UP;

        lastScrollPosition.current = window.pageYOffset;

        setDirection({
            direction: newScrollDirection,
            x: window.pageXOffset,
            y: window.pageYOffset,
        });
        directionRef.current = newScrollDirection;
    };

    const throttledHandler = throttle(handleDirectionChange, 50);

    useEffect(() => {
        if (global.window) {
            window.addEventListener("scroll", throttledHandler);
            return () => {
                window.removeEventListener("scroll", throttledHandler);
            };
        }
        // TODO: Fix Dependency list
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return direction;
}
