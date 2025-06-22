# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check
npm run check:watch

# Testing
npm run test:unit

# Linting and formatting
npm run lint
npm run format
```

## Project Architecture

### Core Technology Stack
- **Framework**: SvelteKit with TypeScript
- **Authentication**: Auth0 via @auth/sveltekit
- **Database**: MongoDB with connection pooling
- **Editor**: Monaco Editor for code editing
- **Compiler**: Custom ASM80 compiler using web workers
- **Styling**: Bulma CSS framework + custom SCSS

### Key Directory Structure
- `src/routes/` - SvelteKit routes and pages
- `src/lib/` - Reusable Svelte components
- `src/util/` - Utility functions and helpers
- `src/db/` - Database connection and operations
- `src/workers/` - Web Workers for compilation
- `src/assets/` - Static assets (CSS frameworks, icons)

### Important Aliases (svelte.config.js)
- `$db` → `./src/db` - Database modules
- `$util` → `./src/util` - Utility functions

### State Management
- **Project Store**: `src/lib/shared/stores/project.js` - Current project data
- **Local FS Store**: `src/lib/shared/stores/localfs.js` - Browser localStorage file system
- **File Store**: `src/util/stores/fileStore.js` - File management

### Core Components
- **Editor**: `src/lib/editor/editor.svelte` - Main code editor with Monaco
- **File Tree**: `src/lib/sbtree/sbtree.svelte` - Project file browser
- **Nav**: `src/lib/nav.svelte` - Main navigation
- **Project Selector**: `src/lib/projectSelector/projectSelector.svelte`

### Compilation System
- Uses ASM80 compiler (`@asm80/core`) in web workers
- Compiles `.a80` assembly files to `.hex` and `.lst` outputs
- File system abstraction allows local and remote storage
- Compilation triggered via UI button or shortcuts

### Authentication Flow
- Auth0 provider configuration in `src/auth.js`
- User data stored in MongoDB with auto-generated usernames
- Session management with 30-minute timeout
- User projects tied to authenticated accounts

### File System Architecture
- Abstracted FS layer supporting multiple backends
- Local storage via browser localStorage (JSON serialized)
- Remote storage via API endpoints
- File operations: read, write, rename, delete with tree rebuilding

### Key Data Flows
1. **Project Loading**: Load from `_project.toml` → parse TOML → update stores
2. **File Operations**: UI action → FS abstraction → rebuild tree → update UI  
3. **Compilation**: User action → web worker → ASM80 compiler → write outputs
4. **Tab Management**: File open → add to tabs array → Monaco editor instance

### Important Notes
- All file paths use forward slashes internally
- Project configuration stored in `_project.toml` files
- IDE size setting (small/medium/big) affects UI layout
- Drag and drop file moving implemented with custom events