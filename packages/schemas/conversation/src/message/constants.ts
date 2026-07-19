export const MESSAGE_ROLE_SYSTEM = `system` as const;
export const MESSAGE_ROLE_DEVELOPER = `developer` as const;
export const MESSAGE_ROLE_USER = `user` as const;
export const MESSAGE_ROLE_ASSISTANT = `assistant` as const;
export const MESSAGE_ROLE_TOOL = `tool` as const;

export const MESSAGE_ROLES = [
  MESSAGE_ROLE_SYSTEM,
  MESSAGE_ROLE_DEVELOPER,
  MESSAGE_ROLE_USER,
  MESSAGE_ROLE_ASSISTANT,
  MESSAGE_ROLE_TOOL,
] as const;
