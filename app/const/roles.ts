export const ROLES = {
  PARENT: 'parent',
  NANNY: 'nanny',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

