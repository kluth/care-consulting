import { z } from 'zod';

const envSchema = z.object({
  production: z.boolean(),
  apiUrl: z.string().url(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(env: unknown): Env {
  try {
    return envSchema.parse(env);
  } catch (error) {
    console.error('❌ Invalid environment configuration:', error);
    throw error;
  }
}
