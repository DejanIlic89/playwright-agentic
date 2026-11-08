import type { WebTableRecord } from '../types/web-table-record.js';

// Returns a new record on every call; overrides replace the matching defaults.
export function createWebTableRecord(
  overrides: Partial<WebTableRecord> = {},
): WebTableRecord {
  return {
    firstName: 'Jordan',
    lastName: 'Reed',
    email: 'jordan.reed@example.test',
    age: '30',
    salary: '4000',
    department: 'Operations',
    ...overrides,
  };
}
