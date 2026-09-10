export function hasSessionCookie(
  cookies: ReadonlyArray<{ name: string; value: string }>,
): boolean {
  return cookies.some(
    (cookie) => cookie.name.includes("session_token") && Boolean(cookie.value),
  );
}
