# Greater Manchester Explorer

[![CI](https://github.com/vfc2/gm-map/actions/workflows/ci.yml/badge.svg)](https://github.com/vfc2/gm-map/actions/workflows/ci.yml)

An interactive map application for Greater Manchester using SvelteKit, TypeScript, and MapLibre.

## Features

- Interactive full-window map centered on Greater Manchester
- Zoom and scale controls
- Restricted viewport to Greater Manchester area
- Search functionality with two implementation approaches:
  - API-based search using OpenStreetMap Nominatim (Approach 1)
  - Local dataset search for faster performance (Approach 2)

## Search Implementation

Located in `src/lib/localSearchModule.ts` and `src/lib/data/manchesterLocations.ts`

This approach uses a local dataset of Greater Manchester locations:

**Pros:**

- Fast performance with no API latency
- Works offline without network connectivity
- Full control over search ranking and priorities
- Can prioritize major locations like towns over streets

**Cons:**

- Limited to locations in the curated dataset
- Requires maintenance to keep the dataset updated
- Increased application bundle size

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Switching Between Search Approaches

To switch between the two search implementations:

1. In `MapComponent.svelte`, change the import from:

   ```typescript
   import { searchLocations, type SearchResult, type SearchError } from '$lib/localSearchModule';
   ```

   to:

   ```typescript
   import { SearchService } from '$lib/searchModule';
   ```

2. Update the corresponding type references and function calls.

3. Do the same in `SearchBar.svelte` to ensure consistent search behavior.

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Testing and CI/CD

This project includes automated testing and Continuous Integration workflows:

```bash
# Run tests in watch mode
npm run test

# Run tests once (used by CI)
npm run test:ci

# Run tests with UI
npm run test:ui

# Generate test coverage report
npm run test:coverage

# Check code formatting
npm run format

# Run linting
npm run lint

# Run type checking
npm run check
```

### Pull Request Process

All branches require a Pull Request before merging to main. The CI workflow will automatically run:

1. Code formatting check
2. Linting
3. Type checking
4. Tests
5. Build verification

Any warnings or errors will cause the CI check to fail, preventing merge to main.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
