import { useEffect, useState } from "react";
import { throttle } from "../utils/function-utils";

export function useWindowSize() {
    const currentSize = global.window ? { x: window.innerWidth, y: window.innerHeight } : { x: 0, y: 0 };

    const [viewPortSize, setViewportSize] = useState<{
        x: number;
        y: number;
    }>(currentSize);

    const handleWindowSizeChange = () => {
        setViewportSize(currentSize);
    };

    const throttledHandler = throttle(handleWindowSizeChange, 50);

    useEffect(() => {
        if (global.window) {
            window.addEventListener("resize", throttledHandler);
            return () => {
                window.removeEventListener("resize", throttledHandler);
            };
        }
    }, [throttledHandler]);

    return viewPortSize;
}
