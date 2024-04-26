import { useCallback, useMemo, useSyncExternalStore } from "react";

enum Breakpoints {
  sm = "40rem", // 640px
  md = "48rem", // 768px
  lg = "64rem", // 1024px
  xl = "80rem", // 1280px
  "2xl" = "96rem", // 1536px
}

function generateQuery(breakpointString: string) {
  const bp = Breakpoints[breakpointString as keyof typeof Breakpoints];
  if (bp) {
    return `(min-width: ${bp})`;
  }

  return breakpointString;
}

export function useMediaQuery(breakpoint: keyof typeof Breakpoints) {
  const query = useMemo(() => generateQuery(breakpoint), [breakpoint]);

  const subscribe = useCallback(
    (callback: () => void) => {
      const matchMedia = window.matchMedia(query);
      matchMedia.addEventListener("change", callback);
      return () => {
        matchMedia.removeEventListener("change", callback);
      };
    },
    [query],
  );

  const getSnapshot = () => {
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => {
    throw Error("useMediaQuery is a client-only hook");
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
