export function getBackendApiUrl(): string | null {
  const configuredUrl = process.env.BACKEND_API_URL?.trim()
  if (configuredUrl) return configuredUrl.replace(/\/+$/, '')
  return process.env.NODE_ENV === 'production' ? null : 'http://localhost:4000'
}
