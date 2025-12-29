import { config } from "dotenv";
import { resolve } from "path";

const envPath = process.env.NODE_ENV === "development" ? ".dev.env" : ".env";
config({ path: resolve(envPath) });

function getEnvVar<T = string>(name: string, fallback?: T): T {
    const value = process.env[name] ?? fallback;
    if (!value) {
        throw new Error(`Environmental variable ${name} is not set!`);
    }
    return value as T;
}

export default getEnvVar;
