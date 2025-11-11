import pino, { type Level } from 'pino';

import {
  NODE_ENV_DEVELOPMENT,
  NODE_ENV_TEST,
  type NodeEnv,
} from '@jearle/util-env';

type PropsGetTransportProp = {
  readonly nodeEnv: NodeEnv;
};
const getTransportProp = (props: PropsGetTransportProp) => {
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
type PropsCreateLogger = {
  readonly name: string;
  readonly level: Level;
  readonly nodeEnv: NodeEnv;
};
export const createLogger = (props: PropsCreateLogger) => {
  const { name, level, nodeEnv } = props;

  const transportProp = getTransportProp({ nodeEnv });

  const logger = pino({ ...transportProp, name, level });

  const result = { logger };

  return result;
};
