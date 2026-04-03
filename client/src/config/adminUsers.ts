const ADMIN_USERNAMES: string[] = [
  "admin",
  "teacher",
  "instructor",
  "demo",
];

export function isAdmin(username: string): boolean {
  return ADMIN_USERNAMES.includes(username.toLowerCase());
}
