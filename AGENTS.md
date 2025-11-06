# Agents Guide

## Build & Test Commands

**Project**: Freesound.org JavaScript library wrapper  
**Language**: ES6 (transpiled to ES5 via Babel)  
**Test Framework**: Tape with tap-spec reporter

- `npm test` - Run all tests (uses babel-tape-runner)
- `npm run transpile` - Transpile src/ to root (ES6 → ES5 for CommonJS)
- `npm run bundle` - Build UMD bundle + minified version
- `npm run watch` - Watch src/ and auto-transpile on changes
- `npm run doc` - Generate JSDoc documentation

## Code Style Guidelines

**Imports**: ES6 modules (`import`/`export`). Entry points are CommonJS-compatible.  
**Formatting**: 2-space indentation, semicolons required.  
**Types**: JSDoc annotations (no TypeScript).  
**Naming**: camelCase for functions/variables, PascalCase for classes. Private members use `_` prefix (e.g., `_buffers`).  
**Error Handling**: Promise-based with `.then()` chains; throw errors for invalid input.  
**Structure**: Separate `src/{client,server,common}` — transpiled to root-level `{client,server,common}` directories.

## Key Patterns

- Classes inherit from base classes (`extends FreesoundQuery`)
- Use Array methods (`.map()`, `.filter()`) over loops
- Bind instance methods in constructor (`this._method = this._method.bind(this)`)
- JSDoc comments document class members, parameters, return types, and examples
- Default parameters allowed (`storeSoundsInfo = false`)
