import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';

import { expect, test } from 'bun:test';

import {
  SKELETON_RESULT_STATUS_ERROR,
  SKELETON_RESULT_STATUS_SUCCESS,
  resolveSkeletonTemplate,
} from '.';

test(`resolveSkeletonTemplate({ repoRoot, packageFamily, template, name }) resolves source and target`, async () => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), `monorepo-lib-repo-`));

  try {
    const sourcePath = path.join(
      repoRoot,
      `packages`,
      `apps`,
      `__skeleton-cli`,
    );
    const targetPath = path.join(repoRoot, `packages`, `apps`, `foobar`);
    await mkdir(sourcePath, { recursive: true });
    await writeFile(path.join(repoRoot, `package.json`), `{}`);

    const result = await resolveSkeletonTemplate({
      repoRoot,
      packageFamily: `apps`,
      template: `cli`,
      name: `foobar`,
    });
    expect(result.status).toBe(SKELETON_RESULT_STATUS_SUCCESS);

    if (result.status !== SKELETON_RESULT_STATUS_SUCCESS) {
      expect.unreachable();
    }

    const { skeletonTemplate } = result.data;

    expect(skeletonTemplate.sourcePath).toBe(sourcePath);
    expect(skeletonTemplate.targetPath).toBe(targetPath);
    expect(skeletonTemplate.templateName).toBe(`__skeleton-cli`);
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test(`resolveSkeletonTemplate({ repoRoot, packageFamily, name }) resolves default family templates`, async () => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), `monorepo-lib-repo-`));

  try {
    const sourcePath = path.join(repoRoot, `packages`, `schemas`, `__skeleton`);
    const targetPath = path.join(repoRoot, `packages`, `schemas`, `example`);
    await mkdir(sourcePath, { recursive: true });
    await writeFile(path.join(repoRoot, `package.json`), `{}`);

    const result = await resolveSkeletonTemplate({
      repoRoot,
      packageFamily: `schemas`,
      name: `example`,
    });
    expect(result.status).toBe(SKELETON_RESULT_STATUS_SUCCESS);

    if (result.status !== SKELETON_RESULT_STATUS_SUCCESS) {
      expect.unreachable();
    }

    const { skeletonTemplate } = result.data;

    expect(skeletonTemplate.sourcePath).toBe(sourcePath);
    expect(skeletonTemplate.targetPath).toBe(targetPath);
    expect(skeletonTemplate.templateName).toBe(`__skeleton`);
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test(`resolveSkeletonTemplate({ repoRoot, packageFamily, name }) rejects existing targets`, async () => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), `monorepo-lib-repo-`));

  try {
    const sourcePath = path.join(
      repoRoot,
      `packages`,
      `services`,
      `__skeleton`,
    );
    const targetPath = path.join(repoRoot, `packages`, `services`, `example`);
    await mkdir(sourcePath, { recursive: true });
    await mkdir(targetPath, { recursive: true });
    await writeFile(path.join(repoRoot, `package.json`), `{}`);

    const result = await resolveSkeletonTemplate({
      repoRoot,
      packageFamily: `services`,
      name: `example`,
    });

    expect(result.status).toBe(SKELETON_RESULT_STATUS_ERROR);

    if (result.status === SKELETON_RESULT_STATUS_SUCCESS) {
      expect.unreachable();
    }

    expect(result.error.message).toContain(`Target package already exists`);
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});
