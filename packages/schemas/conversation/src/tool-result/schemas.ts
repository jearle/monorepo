import { z } from 'zod';
import { ZOD_ISSUE_CODE_CUSTOM } from '@jearle/lib-zod';

import {
  EntityAtSchema,
  EntityIdSchema,
  EntityMetadataSchema,
} from '@jearle/schema-entity';
import {
  PaginationQuerySchema,
  SuccessResponseDataSchema,
  SuccessResponseSchema,
} from '@jearle/schema-api';

import {
  TOOL_RESULT_STATUSES,
  TOOL_RESULT_STATUS_ERROR,
  TOOL_RESULT_STATUS_SUCCESS,
} from './constants';

export const ToolResultStatusSchema = z.literal(TOOL_RESULT_STATUSES);

export const ToolResultProjectIdSchema = z.object({
  projectId: z.uuid(),
});

export const ToolResultSessionIdSchema = z.object({
  sessionId: z.uuid(),
});

export const ToolResultToolCallIdSchema = z.object({
  toolCallId: z.uuid(),
});

export const ToolResultOutputSchema = z.object({
  output: z.record(z.string(), z.unknown()).nullable(),
});

export const ToolResultErrorSchema = z.object({
  error: z.string().nullable(),
});

export const ToolResultBaseSchema = z.object({
  status: ToolResultStatusSchema,
  ...ToolResultOutputSchema.shape,
  ...ToolResultErrorSchema.shape,
});

const ToolResultBaseUpdateSchema = ToolResultBaseSchema.partial();

const refineToolResultInvariant = (
  value: z.infer<typeof ToolResultBaseSchema>,
  ctx: z.RefinementCtx,
) => {
  if (value.status === TOOL_RESULT_STATUS_SUCCESS) {
    if (value.output === null) {
      ctx.addIssue({
        code: ZOD_ISSUE_CODE_CUSTOM,
        path: [`output`],
        message: `output is required when status is success`,
      });
    }

    if (value.error !== null) {
      ctx.addIssue({
        code: ZOD_ISSUE_CODE_CUSTOM,
        path: [`error`],
        message: `error must be null when status is success`,
      });
    }
  }

  if (value.status === TOOL_RESULT_STATUS_ERROR) {
    if (value.error === null) {
      ctx.addIssue({
        code: ZOD_ISSUE_CODE_CUSTOM,
        path: [`error`],
        message: `error is required when status is error`,
      });
    }

    if (value.output !== null) {
      ctx.addIssue({
        code: ZOD_ISSUE_CODE_CUSTOM,
        path: [`output`],
        message: `output must be null when status is error`,
      });
    }
  }
};

const refineToolResultUpdateInvariant = (
  value: z.infer<typeof ToolResultBaseUpdateSchema>,
  ctx: z.RefinementCtx,
) => {
  if (value.status === TOOL_RESULT_STATUS_SUCCESS) {
    if (value.output === undefined || value.output === null) {
      ctx.addIssue({
        code: ZOD_ISSUE_CODE_CUSTOM,
        path: [`output`],
        message: `output is required when status is success`,
      });
    }

    if (value.error !== undefined && value.error !== null) {
      ctx.addIssue({
        code: ZOD_ISSUE_CODE_CUSTOM,
        path: [`error`],
        message: `error must be null when status is success`,
      });
    }
  }

  if (value.status === TOOL_RESULT_STATUS_ERROR) {
    if (value.error === undefined || value.error === null) {
      ctx.addIssue({
        code: ZOD_ISSUE_CODE_CUSTOM,
        path: [`error`],
        message: `error is required when status is error`,
      });
    }

    if (value.output !== undefined && value.output !== null) {
      ctx.addIssue({
        code: ZOD_ISSUE_CODE_CUSTOM,
        path: [`output`],
        message: `output must be null when status is error`,
      });
    }
  }
};

export const ToolResultCreateRequestSchema = z
  .object({
    ...EntityMetadataSchema.shape,
    ...ToolResultBaseSchema.shape,
  })
  .superRefine(refineToolResultInvariant);

export const ToolResultEntitySchema = z
  .object({
    ...EntityIdSchema.shape,
    ...EntityAtSchema.shape,
    ...EntityMetadataSchema.shape,
    ...ToolResultProjectIdSchema.shape,
    ...ToolResultSessionIdSchema.shape,
    ...ToolResultToolCallIdSchema.shape,
    ...ToolResultBaseSchema.shape,
  })
  .superRefine(refineToolResultInvariant);

export const ToolResultEntityCreateSchema = z
  .object({
    ...EntityMetadataSchema.shape,
    ...ToolResultProjectIdSchema.shape,
    ...ToolResultSessionIdSchema.shape,
    ...ToolResultToolCallIdSchema.shape,
    ...ToolResultBaseSchema.shape,
  })
  .superRefine(refineToolResultInvariant);

export const ToolResultEntityUpdateSchema = z
  .object({
    ...EntityIdSchema.shape,
    ...EntityMetadataSchema.partial().shape,
    ...ToolResultBaseUpdateSchema.shape,
  })
  .superRefine(refineToolResultUpdateInvariant);

export const ToolResultSchema = ToolResultEntitySchema;

export const ToolResultCreateSchema = z
  .object({
    ...EntityMetadataSchema.shape,
    ...ToolResultProjectIdSchema.shape,
    ...ToolResultSessionIdSchema.shape,
    ...ToolResultToolCallIdSchema.shape,
    ...ToolResultBaseSchema.shape,
  })
  .superRefine(refineToolResultInvariant);

export const ToolResultUpdateSchema = z
  .object({
    ...EntityIdSchema.shape,
    ...EntityMetadataSchema.partial().shape,
    ...ToolResultBaseUpdateSchema.shape,
  })
  .superRefine(refineToolResultUpdateInvariant);

export const ToolResultsReadBySchema = z
  .object({
    ...EntityIdSchema.shape,
    ...EntityMetadataSchema.shape,
    ...ToolResultProjectIdSchema.shape,
    ...ToolResultSessionIdSchema.shape,
    ...ToolResultToolCallIdSchema.shape,
    ...ToolResultBaseSchema.shape,
  })
  .partial();

export const ToolResultsReadByQuerySchema = z.object({
  ...PaginationQuerySchema.shape,
  ...ToolResultsReadBySchema.shape,
});

export const ToolResultSuccessResponseDataSchema = z.object({
  ...SuccessResponseDataSchema.shape,
  toolResult: ToolResultSchema,
});

export const ToolResultSuccessResponseSchema = z.object({
  ...SuccessResponseSchema.shape,
  data: ToolResultSuccessResponseDataSchema,
});

export const ToolResultsSuccessResponseDataSchema = z.object({
  ...SuccessResponseDataSchema.shape,
  toolResults: z.array(ToolResultSchema),
});

export const ToolResultsSuccessResponseSchema = z.object({
  ...SuccessResponseSchema.shape,
  data: ToolResultsSuccessResponseDataSchema,
});
