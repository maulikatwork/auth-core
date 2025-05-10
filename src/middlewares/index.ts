import { attachUser } from './attachUser';
import { attachRole } from './attachRole';
import { attachOrg } from './attachOrg';

export const authMiddleware = ({ include = [] }: { include?: string[] } = {}) => {
  const stack = [];

  if (include.includes('user')) stack.push(attachUser);
  if (include.includes('role')) stack.push(attachRole);
  if (include.includes('org')) stack.push(attachOrg);

  return stack;
};