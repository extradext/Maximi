/**
 * Environment variable utilities
 */

export function getEnvVariable(key: string, defaultValue: string = ''): string {
  if (typeof window !== 'undefined') {
    // Client-side: use Next.js public env vars
    return (process.env as any)[`NEXT_PUBLIC_${key}`] || defaultValue;
  }
  // Server-side
  return process.env[key] || defaultValue;
}

export function isFeatureEnabled(feature: string): boolean {
  return getEnvVariable(feature) === 'true';
}