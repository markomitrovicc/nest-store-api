export function getAdminUserId(): string {
  return process.env.ADMIN_USER_ID ?? '6aa4ab58e2368e600b79c460';
}

export function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL ?? 'admin@gmail.com').trim().toLowerCase();
}

export function isAdminUser(user: {
  id?: string | null;
  email?: string | null;
}): boolean {
  if (user.id && user.id === getAdminUserId()) {
    return true;
  }

  if (user.email && user.email.trim().toLowerCase() === getAdminEmail()) {
    return true;
  }

  return false;
}
