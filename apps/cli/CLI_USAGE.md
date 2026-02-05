# Watermelon CLI

Command-line tool for installing Watermelon components.

## Installation

```bash
# Build from source
pnpm install
pnpm build

# Link globally
npm link
```

## Usage

### Initialize a Project

```bash
watermelon init
```

This command will:
1. Prompt you for configuration options
2. Create a `watermelon.json` config file
3. Set up component and lib directories
4. Install required dependencies (clsx, tailwind-merge, etc.)

### Add Components

```bash
# Add a single component
watermelon add button

# Add multiple components
watermelon add button text
```

This command will:
1. Fetch component metadata from the registry
2. Resolve all dependencies (including registry dependencies)
3. Install required npm packages
4. Download component files
5. Transform imports to match your configuration
6. Write components to your project

## Configuration

The `watermelon.json` file stores your project configuration:

```json
{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "global.css",
    "baseColor": "slate"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

## Development

### File Structure

```
src/
├── index.ts              # Main CLI entry point
└── utils/
    ├── config.ts         # Configuration management
    ├── registry.ts       # Registry fetching
    ├── dependencies.ts   # Dependency installation
    └── files.ts          # File operations
```

### Adding New Commands

1. Import necessary utilities in `src/index.ts`
2. Add a new command using Commander.js
3. Implement the command logic
4. Build and test

## Registry

Components are fetched from the registry at:
```
https://raw.githubusercontent.com/watermelon/registry/main/packages/registry
```

The registry structure:
- `registry.json` - Component metadata
- `src/components/ui/` - Component source files

## Troubleshooting

### Module Not Found Errors

If you encounter "module not found" errors after adding components:
1. Ensure your `tsconfig.json` has the correct path aliases
2. Restart your development server
3. Clear Metro cache: `npx expo start --clear`

### Installation Failures

If dependency installation fails:
1. Check your internet connection
2. Try manually: `pnpm add <package-name>`
3. Ensure you're using a compatible package manager

### Component Fetching Issues

If components fail to download:
1. Check the GitHub repository is accessible
2. Verify the REGISTRY_URL in `src/utils/config.ts`
3. Ensure you have an active internet connection
