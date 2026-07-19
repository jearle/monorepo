import pino, { type Level } from 'pino';

import {
  type NodeEnv,
  NODE_ENV_DEVELOPMENT,
  NODE_ENV_TEST,
} from '@jearle/util-env';

type GetTransportPropProps = {
  readonly nodeEnv: NodeEnv;
};
const getTransportProp = (props: GetTransportPropProps) => {
  const { nodeEnv } = props;

  const shouldUsePinoPretty =
    nodeEnv === NODE_ENV_DEVELOPMENT || nodeEnv === NODE_ENV_TEST;

  if (shouldUsePinoPretty) {
    const result = { transport: { target: `pino-pretty` } };

    return result;
  }

  const result = {};

  return result;
};
export type CreateLoggerProps = {
  readonly name: string;
  readonly level: Level;
  readonly nodeEnv: NodeEnv;
};
export const createLogger = (props: CreateLoggerProps) => {
  const { name, level, nodeEnv } = props;

  const transportProp = getTransportProp({ nodeEnv });

  const logger = pino({ ...transportProp, name, level });

  const result = { logger };

  return result;
};
