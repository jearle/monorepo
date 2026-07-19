# @jearle/util-template

Template rendering utilities for Monorepo packages, backed internally by LiquidJS.

## Public client

```ts
const { templateClient } = createTemplateClient({
  root: './templates',
  filters: {
    shout: (value) => String(value).toUpperCase(),
  },
});

const result = await templateClient.render('Hello {{ user.name | shout }}', {
  user: {
    name: 'Ada',
  },
});
```

## Defaults

Call `createTemplateClient()` with no arguments for the default Monorepo template
behavior.

```ts
const { templateClient } = createTemplateClient();

const result = await templateClient.render('Hello {{ name }}', {
  name: 'Ada',
});
```

The client is backed by LiquidJS internally and returns Monorepo `Result` values.
The package exports Monorepo-owned public types.

Default behavior enables:

- `strictVariables`
- `strictFilters`
- `ownPropertyOnly`
- template caching
- parse, render, memory, and template limits

## Result handling

All client methods return Monorepo `Result` values.

```ts
const result = await templateClient.render('Hello {{ name }}', data);

if (result.status === 'ERROR') {
  console.error(result.error);
  return;
}

const renderedTemplate = result.data;
```

## File rendering

Use `renderFile(...)` for templates loaded from the configured template root.

```ts
const { templateClient } = createTemplateClient({
  root: './templates',
});

const result = await templateClient.renderFile('welcome.liquid', {
  user: {
    name: 'Ada',
  },
});
```

Configured template roots are anchored and canonicalized when the client is
created. Later changes to the process working directory do not change file
resolution.

Use `parse(...)` to validate inline Liquid syntax and every statically named
import against those configured client roots without rendering or executing
custom filters. Dynamic imports remain deferred to native rendering with real
data.

## Source-aware inline templates

Use `renderSource(...)` when inline Liquid was authored inside another file,
such as a JSON config. The source path is operation metadata and does not need
to be embedded in the config value.

```ts
const source = {
  extname: `.templ`,
  importRoots: {},
  sourcePath: `/workspace/bands/lt-100/config.json`,
  template: `{% include "retry/common" %} {{ retry.attemptNumber }}`,
};
const result = await templateClient.renderSource(source, data);
```

`sourcePath` must name an existing absolute file. The client canonicalizes it
before parsing. `extname` overrides the client extension for the operation.
When `importRoots` is omitted, bare imports use the client roots. An explicit
`importRoots` object replaces those roots, so an empty object limits imports to
the current authored file hierarchy. `./` and `../` imports resolve from the
file containing each import, including recursively imported files. Absolute
import names are rejected.

Use `parseSource(...)` for syntax and static import-graph validation without
rendering. Canonical file identities make nested imports stable across symlink
spellings. Import cycles, missing static files, and invalid imported Liquid
fail before the operation returns. It does not execute custom filters or
resolve dynamic imports.
`renderSource(...)` parses the root template and performs one native Liquid
render with the supplied data, globals, filters, strictness, limits, and
operation roots. Liquid loads imports and executes branches only when reached;
dynamic imports and custom-filter-derived selectors resolve from their real
runtime values.

## Structured text

Templates can render longer structured text with conditionals and loops.

```ts
const template = `
# {{ title }}

{% if summary %}
Summary: {{ summary }}
{% endif %}

{% for item in items %}
- {{ item.label }}: {{ item.value }}
{% endfor %}
`;

const result = await templateClient.render(template, {
  title: 'Daily Report',
  summary: 'Three records need review.',
  items: [
    {
      label: 'Open',
      value: 3,
    },
    {
      label: 'Closed',
      value: 12,
    },
  ],
});
```

## Branching and defaults

Use Liquid conditions for value-based branches. Use `contains` for membership
checks against arrays or strings.

```ts
const template = `
{% if labels contains "blocked" %}
Status: blocked
{% elsif status == "ready" %}
Status: ready
{% else %}
Status: pending
{% endif %}

Owner: {{ ownerName | default: "Unassigned" }}
Labels: {{ labels | join: ", " }}
`;

const result = await templateClient.render(template, {
  labels: ['review'],
  ownerName: null,
  status: 'ready',
});
```

With the default strict variable behavior, include optional values in the render
data. Use `null` when a value is intentionally empty.

## Reusable transforms

Filters are the template extension point for reusable transformations.

```ts
const { templateClient } = createTemplateClient({
  filters: {
    surround: (value, left = '[', right = ']') => {
      const result = `${left}${String(value)}${right}`;

      return result;
    },
  },
});

const result = await templateClient.render(
  '{{ status | upcase | surround: "(", ")" }}',
  {
    status: 'ready',
  },
);
```

## Prepared values

Liquid syntax handles interpolation, branching, loops, and filters. Prepare
derived strings and structured values in application code before rendering. Put
reusable render-time transforms in custom filters.

For compact JSON output, use Liquid's built-in `json` filter.

```ts
const checklist = [
  {
    label: 'Open',
    value: 3,
  },
  {
    label: 'Closed',
    value: 12,
  },
];
const metadata = {
  generatedBy: 'system',
  version: 1,
};
const data = {
  checklistText: checklist
    .map((item) => `- ${item.label}: ${item.value}`)
    .join('\n'),
  metadata,
  metadataJson: JSON.stringify(metadata, null, 2),
  title: 'Daily Report',
};

const template = `
# {{ title }}

Checklist:
{{ checklistText }}

Metadata:
{{ metadataJson }}

Compact metadata:
{{ metadata | json }}
`;

const result = await templateClient.render(template, data);
```

## Analysis

Use `analyze(...)` to inspect the global variables referenced by a template.

```ts
const result = templateClient.analyze(
  '{% assign label = user.name %}{{ label }} {{ project.id }}',
);
```

A successful analysis result is shaped as `{ variables }`. `variables`
contains sorted unique variable paths such as
`['project.id', 'user.name']`.

This can be used as a preflight check before rendering saved or user-provided
templates.

```ts
const analysisResult = templateClient.analyze(template);

if (analysisResult.status === 'ERROR') {
  return analysisResult;
}

const requiredVariables = analysisResult.data.variables;
```

Source-template failures return stable error codes and safe source-relative
paths or import chains. They do not include template contents, rendered output,
Liquid token context, or absolute local roots.

Use `analyzeSourceDependencies(...)` when a caller needs the validated file
dependency closure. It uses the same source path, import roots, importer-relative
resolution, canonical file identities, and limits as `parseSource(...)`, without
rendering or executing filters. Successful results contain only
`hasDynamicFileImports` and sorted unique canonical `staticImportPaths`. The
root authored file is not included in `staticImportPaths`.

## Runtime rules

- `templateClient.render(template, data, options?)` renders a template string and returns `Result<string>`.
- `templateClient.renderFile(path, data, options?)` renders a template file from the configured root and returns `Result<string>`.
- `templateClient.analyze(template)` returns `Result<{ variables }>` for referenced global variables in one inline template.
- `templateClient.analyzeSourceDependencies(source)` returns canonical static import paths and whether any dynamic file import exists, without rendering or returning template contents.
- `templateClient.parse(template, options?)` parses inline Liquid and, by default, statically named imports from configured client roots without rendering. Set `resolveStaticImports: false` when only import presence is needed for source-ownership validation.
- `templateClient.parseSource(source)` parses source-aware inline Liquid and every statically named import without rendering.
- `templateClient.renderSource(source, data, options?)` parses the root and performs one native source-aware render that loads only reached imports.
- Monorepo `Result` errors cover missing variables, invalid templates, render failures, file render failures, analysis failures, and invalid options.
- Custom filters are configured through `createTemplateClient({ filters })`.
- LiquidJS stays internal to this package.
