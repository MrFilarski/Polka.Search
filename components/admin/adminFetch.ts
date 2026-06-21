export function adminFetch(url: string, opts: RequestInit = {}) {
  const pw = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('admin_pw') ?? '' : '';
  return fetch(url, { ...opts, headers: { ...(opts.headers ?? {}), 'x-admin-password': pw } });
}
