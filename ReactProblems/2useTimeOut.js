import { useEffect, useRef, useState } from "react"; 

/**
 * Custom hook that runs `callback` once after `delay` milliseconds.
 * @param callback - function to call after the timeout
 * @param delay    - time in ms before callback is invoked
 */
export function useTimeout(callback: () => void, delay: number) {
  // Store callback in a ref so we always call the latest version,
  // without having to re-run the effect when callback changes.
  const callbackRef = useRef(callback);
  callbackRef.current = callback; // update ref each render

  useEffect(() => {
    // Start a timer when the hook mounts or when `delay` changes
    const timerId = setTimeout(() => {
      callbackRef.current(); // call the latest callback from the ref
    }, delay);

    // Cleanup: if `delay` changes or component unmounts, clear the timer
    return () => {
      clearTimeout(timerId);
    };
  }, [delay]); // only re-run effect when `delay` changes
}
