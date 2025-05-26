module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/singleton.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
