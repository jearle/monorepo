# Service Wiring

Service factory files construct and return dependencies only.

## Service Factories

Use service factories for dependencies such as:

- API clients
- Stores
- Domain services
- External adapters
- Shared clients that need env or logger configuration

Do not put app behavior, request handling, validation flow, output formatting, command-specific logic, or error formatting in service wiring files.

Service packages expose workflow behavior through their service surface unless
the package is intentionally a stateless utility package. Consumers should
receive a service from app composition and call methods on that service instead
of importing workflow functions directly from the package root.

App service composition files (`src/services/create-services.ts`) are the one
place that imports service and store constructors directly to wire them, so they
are exempt from the no-direct-workflow-import rule. Feature code outside
composition receives the composed service surface instead.

Feature implementation functions can remain in feature folders, but the public
package-level service contract should make the service entrypoint clear.
Service factories return a result object with a domain-named service key, such
as `thingService`, `projectsService`, or `llmProfilesService`. Exported service
types are derived from that factory return key with
`ReturnType<typeof createThingService>["thingService"]` so the factory object is
the single source of truth.

Service skeletons and package-generation templates model the current service
factory conventions, including domain-named service return keys and
factory-derived service types.

## Service Info

Every service factory exposes an `info` method on its service object. The method
returns the service identity (`{ serviceName }`) sourced from the package
`*_SERVICE_NAME` constant and logs it through the service-context logger. The
service names itself from its own constant instead of receiving the name through
context.

```ts
// constants.ts
export const THING_SERVICE_NAME = `thing` as const;
```

```ts
// info.ts
import { THING_SERVICE_NAME } from './constants';
import { type ThingServiceContext } from './types';

export const info = (ctx: ThingServiceContext) => {
  const { logger } = ctx;
  const result = {
    serviceName: THING_SERVICE_NAME,
  };

  logger.info(result);

  return result;
};
```

```ts
// create-thing-service.ts
const thingService = {
  info: () => info(ctx),
  createThing: (props: CreateThingProps) => createThing(ctx, props),
};
```

The `monorepo-conventions/require-service-info-method` rule enforces that every
non-empty service factory service object includes an `info` method.

## Workflow Service Contexts

Service factories that return workflow methods accept a real typed context.
Workflow methods wrap feature functions and pass the service context into those
functions.

The `...ServiceContext` type lives in the feature `types.ts` like other shared
context types. The factory-derived `...Service` type stays beside the factory so
the factory return object is its single source of truth.

```ts
// types.ts
export type ThingServiceContext = {
  readonly logger: Logger;
  readonly store: ThingStore;
};
```

```ts
// create-thing-service.ts
import { type ThingServiceContext } from './types';

export const createThingService = (ctx: ThingServiceContext) => {
  const thingService = {
    createThing: (props: CreateThingProps) => createThing(ctx, props),
  };

  const result = { thingService };
  return result;
};

export type ThingService = ReturnType<
  typeof createThingService
>[`thingService`];
```

Use `logger` in service contexts when workflow methods validate, reject,
transform, score, package, persist, or call external dependencies. Pass
service-owned config or adapters through the service context instead of reading
app globals inside workflow functions.

App composition constructs the service context from resolved app dependencies
and passes it to service factories. Tests construct a typed test service context
for non-empty service factories.

Pass full app `env` only to factories that own the complete app environment
contract. Service packages receive service-specific config derived from `env`.

## Empty Services

Service factories receive app composition dependencies, usually `env` and
`logger`. If a package has no real services yet, accept the typed props and
return an empty service object.

```ts
export type ServicesContext = {
  readonly env: Env;
  readonly logger: Logger;
};

export const createServices = (ctx: ServicesContext) => {
  void ctx;

  const services = {};

  const result = { services };
  return result;
};

export type Services = ReturnType<typeof createServices>[`services`];
```

Do not keep scaffold-only services such as `clock` just to demonstrate the pattern.

## Context Boundaries

Keep `env`, `logger`, and `services` as context fields unless they are themselves real service dependencies.

```ts
export type RepoCommandContext = {
  readonly env: Env;
  readonly logger: Logger;
  readonly services: Services;
};
```

Do not move `env` or `logger` into `services` just to reduce the number of context fields.
