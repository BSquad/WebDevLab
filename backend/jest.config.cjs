module.exports = {
    preset: "ts-jest/presets/default-esm",
    testEnvironment: "node",

    extensionsToTreatAsEsm: [".ts"],

    transform: {
        "^.+\\.ts$": ["ts-jest", { useESM: true }],
    },

    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },

    collectCoverage: true,

    coverageDirectory: "coverage",

    collectCoverageFrom: ["src/**/*.ts", "!src/start-server.ts"],

    coverageReporters: ["text", "html"],
};
