import type { Config } from '@jest/types';
import path from 'path';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  roots: [path.join(__dirname, 'src', 'tests')],
  testMatch: ['**/?(*.)+(e2e|integration).[tj]s'], 
  detectOpenHandles: true,
};

export default config;
