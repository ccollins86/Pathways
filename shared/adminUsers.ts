export const ADMIN_USERNAMES: string[] = [
  "admin",
  "nestor",
];

export function isAdmin(username: string): boolean {
  return ADMIN_USERNAMES.includes(username.toLowerCase());
}
