import { useEffect, useRef, useCallback } from 'react';

/**
 * useDebounce - Debounces a callback function with proper TypeScript support
 *
 * @param callback - The async function to debounce
 * @param delay - Delay in milliseconds
 * @param deps - Dependencies array that will trigger the debounced function
 * @returns A memoized debounced function that returns a Promise
 */
function useDebounce<T extends (...args: any[]) => Promise<any>>(
  callback: T,
  delay: number,
  deps: any[] = [],
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const callbackRef = useRef<T>(callback);
  const promiseRef = useRef<{
    resolve: (value: Awaited<ReturnType<T>>) => void;
    reject: (reason?: any) => void;
  } | null>(null);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Memoize the debounced function to prevent unnecessary re-renders
  const debouncedFn = useCallback(
    (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
      return new Promise((resolve, reject) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        promiseRef.current = { resolve, reject };

        timeoutRef.current = setTimeout(async () => {
          try {
            const result = await callbackRef.current(...args);
            promiseRef.current?.resolve(result);
          } catch (error) {
            promiseRef.current?.reject(error);
          } finally {
            promiseRef.current = null;
          }
        }, delay);
      });
    },
    [delay],
  );

  // Cleanup timeout on unmount or when deps change
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        promiseRef.current?.reject(new Error('Debounced function cancelled'));
        promiseRef.current = null;
      }
    };
  }, [...deps, delay]);

  return debouncedFn;
}

export default useDebounce;
