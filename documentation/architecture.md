### Monorepo Architecture and Coding Philosophy

This document outlines the development standards for the monorepo.

#### I. Monorepo Structure

The monorepo uses a feature-based architecture organized by package type at the highest level. PNPM or Bun are the preferred package managers.

- **`packages/apps/`**: Contains consumer applications (e.g., Next.js, Vite apps).
- **`packages/uis/`**: Contains shared, generic UI components.
- **`packages/utils/`**: Contains shared, pure utility functions.
- **`packages/schemas/`**: Contains data validation schemas.
- **`packages/configs/`**: Contains shared configurations.
- **`packages/designs/`**: Contains design tokens and assets.

**Example Structure:**

```
monorepo/
└── packages/
    ├── apps/
    │   └── my-app/
    │       └── src/
    │           ├── auth/
    │           ├── orders/
    │           └── user/
    ├── configs/
    │   ├── eslint-config/
    │   └── tsconfig/
    ├── uis/
    │   └── components/
    │       └── src/
    │           ├── button/
    │           └── input/
    └── utils/
        └── math/
            └── src/
                ├── floor/
                │   ├── index.ts
                │   ├── floor.ts
                │   └── floor.test.ts
                └── round/
                    ├── index.ts
                    ├── round.ts
                    └── round.test.ts
```

#### II. Dependency Management

A single version of core external dependencies (e.g., React, Zustand, Styled Components) is enforced at the monorepo root `package.json`. Workspace packages that use these libraries must declare them as `peerDependencies` to ensure version consistency across the entire project.

#### III. Module API Design

1.  **Public API Enforcement:** Each feature module should expose its public API through a single `index.ts` file. Imports should not be made from internal files of other modules.
2.  **Function Signatures:** Functions are defined as `const` arrow functions. They accept a single `readonly` argument object, conventionally suffixed with `Props`. Return types are inferred by TypeScript, and the return value is assigned to a `result` variable before being returned to aid debugging.

**Example:**

```typescript
// BAD: Prone to argument order errors, mutable, hard to extend
function updateUser(
  id: string,
  data: UserData,
  shouldNotify: boolean,
): User | null {}

// GOOD: Arguments and results are explicit, immutable, and extensible
// Note: The 'User' type is inferred from a Zod schema defined in Section IV.
type UpdateUserProps = {
  readonly id: string;
  readonly data: User;
  readonly shouldNotify: boolean;
};

// Statuses are derived from a const array to prevent typos and allow for easy iteration.
const SUCCESS = 'SUCCESS';
const NOT_FOUND = 'NOT_FOUND';
const ERROR = 'ERROR';
const STATUSES = [SUCCESS, NOT_FOUND, ERROR] as const;
type Status = (typeof STATUSES)[number];

const updateUser = (props: UpdateUserProps) => {
  // ... implementation ...

  // The result is assigned to a variable for easy debugging before returning.
  // The return type is inferred by TypeScript.
  const result = { status: SUCCESS as Status, user: updatedUser };

  return result;
};
```

#### IV. Data Validation & Schemas

Zod is used for data validation, especially when parsing data from unknowable sources such as JSON API calls.

1.  **Schema-First:** Always define a Zod schema first.
2.  **Type Inference:** Use `z.infer<typeof a>` to generate a TypeScript type from the schema. Do not write manual `type` or `interface` definitions for data structures that have a schema.
3.  **Safe Parsing:** Use `safeParse` for validation to handle errors without throwing exceptions. This provides a predictable result object that is easy to work with.

**Example:**

```typescript
import { z } from 'zod';
import axios, { type AxiosResponse } from 'axios';

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
});

export type User = z.infer<typeof UserSchema>;

type FetchUserProps = {
  readonly userId: string;
};

const SUCCESS = 'SUCCESS';
const VALIDATION_ERROR = 'VALIDATION_ERROR';
const NOT_FOUND = 'NOT_FOUND';
const NETWORK_ERROR = 'NETWORK_ERROR';

const STATUSES = [SUCCESS, VALIDATION_ERROR, NOT_FOUND, NETWORK_ERROR] as const;

type Status = (typeof STATUSES)[number];

const fetchUser = async (props: FetchUserShorthand) => {
  const { userId } = props;

  const handleSuccess = (response: AxiosResponse) => {
    const responseData = response.data;
    const validationResult = UserSchema.safeParse(responseData);
    const { success: isSuccess } = validationResult;

    if (!isSuccess) {
      const { error: validationError } = validationResult;
      console.error(validationError.format());
      const errorResult = { status: VALIDATION_ERROR, user: null };
      return errorResult;
    }

    const { data: user } = validationResult;
    const successResult = { status: SUCCESS, user };
    return successResult;
  };

  const handleError = (error: unknown) => {
    const isAxiosError = axios.isAxiosError(error);
    const responseStatus = error.response?.status;
    const isNotFoundError = isAxiosError && responseStatus === 404;

    if (isNotFoundError) {
      const notFoundResult = { status: NOT_FOUND, user: null };
      return notFoundResult;
    }

    const networkErrorResult = { status: NETWORK_ERROR, user: null };
    return networkErrorResult;
  };

  const apiUrl = `/api/users/${userId}`;
  const apiPromise = axios.get(apiUrl).then(handleSuccess).catch(handleError);
  const result = await apiPromise;

  return result;
};
```

#### V. State Management

State is managed using Jotai's atomic model. The approach separates an asynchronous data source from derived, synchronous states consumed by the UI.

1.  **Async Source Atom:** Define a base `async` atom that fetches the raw resource or performs an async operation.
2.  **Loadable Wrapper:** Wrap the async atom with the `loadable` utility. This provides a state object (`{ state: 'loading' | 'hasData' | 'hasError', ... }`) and prevents React Suspense boundaries.
3.  **Derived State Atoms:** Create small, derived, read-only atoms for each piece of state (`isLoading`, `error`, `data`). This ensures components only re-render when the specific data they subscribe to changes.
4.  **Custom Hooks:** Expose the derived atoms to components through simple, reusable hooks that return a result object.

**Example:**

```typescript
import { atom, useAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { configState } from '@/config';

// 1. The async source atom fetches/creates the API client.
const userAPIAsyncState = atom(async (get) => {
  const config = await get(configState);
  const { userURL } = config;
  const userAPI = createUserAPI({ url: userURL });
  return userAPI;
});

// 2. The loadable utility wraps the async atom.
const userAPILoadableState = loadable(userAPIAsyncState);

// 3. Derived atoms select specific pieces of state.
const isLoadingUserAPIState = atom(
  (get) => get(userAPILoadableState).state === 'loading',
);

const userAPIErrorState = atom((get) => {
  const loadable = get(userAPILoadableState);
  return loadable.state === 'hasError' ? loadable.error : null;
});

const userAPIState = atom((get) => {
  const loadable = get(userAPILoadableState);
  return loadable.state === 'hasData' ? loadable.data : null;
});

// 4. Custom hooks expose state to components.
export const useIsLoadingUserAPI = () => {
  const [isLoadingUserAPI] = useAtom(isLoadingUserAPIState);
  const result = { isLoadingUserAPI };
  return result;
};

export const useUserAPIError = () => {
  const [userAPIError] = useAtom(userAPIErrorState);
  const result = { userAPIError };
  return result;
};

export const useUserAPI = () => {
  const [userAPI] = useAtom(userAPIState);
  const result = { userAPI };
  return result;
};
```

#### VI. Coding Style

Code should follow a "1 line, 1 operation, assign to variable" style. This enhances clarity for debugging, as each step of a computation can be inspected individually.

**Example:**

```typescript
// BAD: Hard to debug the intermediate value
const finalPrice = calculateDiscount(item.price * quantity * (1 + taxRate));

// GOOD: Each step is inspectable
const subtotal = item.price * quantity;
const totalWithTax = subtotal * (1 + taxRate);
const finalPrice = calculateDiscount(totalWithTax);
```

#### VII. Scaffolding & Tooling

New packages are generated from skeleton templates using a custom CLI tool. This ensures all new packages adhere to the established structure, build configuration, and quality gates from inception.

#### VIII. Testing & Development

1.  **Black-Box Testing:** Tests focus exclusively on a module's public API as exported from `index.ts`. Internal implementation details are not tested directly. This allows internals to be refactored freely without breaking tests. Test files are co-located with the source file (e.g., `feature.ts` and `feature.test.ts`).
2.  **Live Examples:** UI packages should include co-located `Example.tsx` files. These provide a simple, isolated canvas for developing and reviewing a component's functionality within the main application's dev server.
3.  **Formal Documentation:** A dedicated Storybook package is maintained for formal, interactive documentation of the UI library.
