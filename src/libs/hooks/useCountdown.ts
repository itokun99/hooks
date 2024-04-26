import { useCallback, useEffect, useState } from "react";
import { useCounter } from "./useCounter";
import { useBoolean } from "./useBoolean";
import { useInterval } from "./useInterval";

// import { useBoolean, useCounter, useInterval } from '@features/_global/hooks';

type CountdownOptions = {
  countStart: number;

  intervalMs?: number;
  isIncrement?: boolean;

  countStop?: number;
  onTick?: () => void;
  onCompleted?: () => void;
};

// type CountdownControllers = {
//   startCountdown: () => void;
//   stopCountdown: () => void;
//   resetCountdown: () => void;
// };

export function useCountdown({
  countStart,
  countStop = 0,
  intervalMs = 1000,
  isIncrement = false,
}: CountdownOptions) {
  const [completed, setCompleted] = useState(false);

  const {
    count,
    increment,
    decrement,
    reset: resetCounter,
    setCount,
  } = useCounter(countStart);

  /*
   * Note: used to control the useInterval
   * running: If true, the interval is running
   * start: Should set running true to trigger interval
   * stop: Should set running false to remove interval.
   */
  const {
    value: isCountdownRunning,
    setTrue: startCountdown,
    setFalse: stopCountdown,
  } = useBoolean(false);

  // Will set running false and reset the seconds to initial value.
  const resetCountdown = useCallback(() => {
    stopCountdown();
    resetCounter();
  }, [stopCountdown, resetCounter]);

  const countdownCallback = useCallback(() => {
    if (count === countStop) {
      stopCountdown();
      return;
    }

    if (isIncrement) {
      increment();
    } else {
      decrement();
    }
  }, [count, countStop, decrement, increment, isIncrement, stopCountdown]);

  useEffect(() => {
    setCompleted(!count);
  }, [count]);

  useInterval(countdownCallback, isCountdownRunning ? intervalMs : null);

  return {
    count,
    startCountdown,
    stopCountdown,
    resetCountdown,
    completed,
    setCompleted,
    setCount,
  };
}
