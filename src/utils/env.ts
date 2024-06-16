import { config } from "dotenv";
import { resolve } from "path";

const envPath = process.env.NODE_ENV === "development" ? ".dev.env" : ".env";
config({ path: resolve(envPath) });

const getEnvVar = (name: string, fallback?: string): string => {
    const value = process.env[name] ?? fallback;
    if (!value) {
        throw new Error(`Environmental variable ${name} is not set!`);
    }
    return value;
};

export default getEnvVar;
