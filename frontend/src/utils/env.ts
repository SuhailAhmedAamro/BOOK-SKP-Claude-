/**
 * Environment configuration with validation
 * For Docusaurus/Vite, use import.meta.env instead of process.env
 */

const getEnvVar = (key: string, defaultValue?: string): string => {
  // @ts-ignore - import.meta.env exists in Vite
  const value = import.meta.env?.[key];

  if (!value && !defaultValue) {
    console.error(`Missing required environment variable: ${key}`);
    return '';
  }

  return value || defaultValue!;
};

export const ENV = {
  API_URL: getEnvVar('VITE_API_URL', 'http://localhost:8000'),
  // @ts-ignore
  IS_PRODUCTION: import.meta.env?.MODE === 'production',
  // @ts-ignore
  IS_DEVELOPMENT: import.meta.env?.MODE === 'development',
} as const;

// Validate critical environment variables on startup
export const validateEnv = () => {
  const errors: string[] = [];

  if (!ENV.API_URL) {
    errors.push('VITE_API_URL is not set');
  }

  if (errors.length > 0) {
    console.error('Environment validation failed:', errors);
    if (ENV.IS_PRODUCTION) {
      throw new Error('Critical environment variables missing');
    }
  }

  console.log('✓ Environment validated:', {
    API_URL: ENV.API_URL,
    // @ts-ignore
    MODE: import.meta.env?.MODE || 'development',
  });
};
