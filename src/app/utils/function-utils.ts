export function debounce<T extends (...args: any[]) => any>(func: T, wait: number, immediate = false) {
    let timeout: any;

    return function (...args: Parameters<typeof func>): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const context = this;

        const later = () => {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };

        const callNow = immediate && !timeout;
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
}

// Adapted from lodash (https://lodash.com/)
// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
export function throttle(
    func: () => unknown,
    wait: number,
    options?: { leading?: boolean; trailing?: boolean }
) {
    let context: any;
    let args: any;
    let result: any;
    let timeout: any = null;
    let previous = 0;
    if (!options) {
        options = {};
    }
    const later = () => {
        previous = options?.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) {
            context = args = null;
        }
    };
    return function () {
        const now = Date.now();
        if (!previous && options?.leading === false) {
            previous = now;
        }
        const remaining = wait - (now - previous);
        context = this;
        // eslint-disable-next-line prefer-rest-params
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) {
                context = args = null;
            }
        } else if (!timeout && options?.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}

export async function asyncNoop(): Promise<any> {
    return undefined;
}

export function isDefined<T>(item: T | undefined): item is T {
    return Boolean(item);
}
