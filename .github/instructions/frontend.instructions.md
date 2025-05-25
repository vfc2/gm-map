---
applyTo: '**'
---

This is a SvelteKit and Typescript based repository. It is a data visualisation app based on a map. Please follow these guidelines when contributing:

## Code Standards

### Required Before Each Commit

- Run `npm run format` before committing any changes to ensure proper code formatting.
- Run `npm run lint` before committing any changes and ensure that there are no warnings or errors. If there are, they need fixing.
- Run `npm run check` to ensure type safety and that there are no type errors in the codebase.
- Run `npm run build` to ensure that the code compiles without errors or warnings.
- Run `npm run test:ci` to ensure that all tests pass before committing.

## Key Guidelines

1. Follow Go best practices and idiomatic patterns
2. Maintain existing code structure and organization
3. Write unit tests for new functionality. Use table-driven unit tests when possible.
4. Document public APIs and complex logic. Suggest changes to the `docs/` folder when appropriate
5. Alwats ask before adding new dependencies of complexity.
