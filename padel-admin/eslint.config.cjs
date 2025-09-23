const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const angularEslint = require("@angular-eslint/eslint-plugin");
const _import = require("eslint-plugin-import");

const {
    fixupPluginRules,
    fixupConfigRules,
    fixupConfigRules,
} = require("@eslint/compat");

const parser = require("@angular-eslint/template-parser");
const angularEslintTemplate = require("@angular-eslint/eslint-plugin-template");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([
    {},
    globalIgnores(["**/dist", "**/node_modules", "**/.angular", "**/*.js.map"]),
    {
        files: ["**/*.ts"],

        languageOptions: {
            parser: tsParser,

            parserOptions: {
                project: ["./tsconfig.json"],
                tsconfigRootDir: __dirname,
                createDefaultProgram: true,
            },
        },

        plugins: {
            "@typescript-eslint": typescriptEslint,
            "@angular-eslint": angularEslint,
            import: fixupPluginRules(_import),
        },

        extends: fixupConfigRules(compat.extends(
            "plugin:@angular-eslint/recommended",
            "plugin:@typescript-eslint/recommended",
            "plugin:import/recommended",
            "plugin:import/typescript",
            "prettier",
        )),

        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/explicit-module-boundary-types": "off",

            "@typescript-eslint/no-unused-vars": ["error", {
                argsIgnorePattern: "^_",
            }],

            "import/order": ["warn", {
                groups: [["builtin", "external"], "internal", ["parent", "sibling", "index"]],
                "newlines-between": "always",
            }],
        },
    },
    {
        files: ["**/*.html"],

        languageOptions: {
            parser: parser,
        },

        plugins: {
            "@angular-eslint/template": fixupPluginRules(angularEslintTemplate),
        },

        extends: fixupConfigRules(compat.extends("plugin:@angular-eslint/template/recommended")),
        rules: {},
    },
    globalIgnores([
        "**/node_modules",
        "**/dist",
        "**/.angular",
        "**/.vscode",
        "**/*.js.map",
        "**/package-lock.json",
    ]),
]);