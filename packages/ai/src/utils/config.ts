import { existsSync, readFileSync } from "fs";

const loadAIConfig = () => {
    if (process.env.ANYCRAWL_AI_CONFIG_PATH) {
        if (!existsSync(process.env.ANYCRAWL_AI_CONFIG_PATH)) {
            throw new Error(`AI config file not found at: ${process.env.ANYCRAWL_AI_CONFIG_PATH}`);
        }
        const config = JSON.parse(readFileSync(process.env.ANYCRAWL_AI_CONFIG_PATH, 'utf8'));
        return config;
    }
    return null;
}

export { loadAIConfig };