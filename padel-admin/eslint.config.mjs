import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([globalIgnores([
    "**/node_modules",
    "**/dist",
    "**/.angular",
    "**/.vscode",
    "**/*.js.map",
    "**/package-lock.json",
])]);