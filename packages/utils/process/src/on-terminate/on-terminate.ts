import { SIGNALS } from './constants';
import type { Signal, TerminateHandler } from './types';

export const onTerminate = (terminateHandler: TerminateHandler) => {
  let isShuttingDown = false;
  const signalHandler = async (signal: Signal) => {
    if (isShuttingDown) {
      return;
    }
    isShuttingDown = true;

    try {
      const { success } = await terminateHandler({ signal });
      const exitCode = success ? 0 : 1;
      process.exit(exitCode);
    } catch (err) {
      console.error(`Error during termination handler:`, err);
      process.exit(1);
    }
  };

  SIGNALS.forEach((signal) => {
    process.on(signal, signalHandler);
  });
};
