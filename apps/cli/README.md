# Watermelon CLI

> CLI for installing Watermelon React Native components

Beautiful, accessible UI components for React Native and Expo applications. Install components from one or more shadcn-style registries with a single command.

## Installation

```bash
npm install -g watermelon-cli
```

## Quick Start

```bash
# Initialize in your project
watermelon init

# Add components
watermelon add button
watermelon add @watermelon/button
watermelon add @aceternity/card
```

## Commands

### `watermelon init`

Initialize Watermelon in your React Native/Expo project.

### `watermelon add <component...>`

Add one or more components to your project.

Examples:

```bash
watermelon add button
watermelon add @watermelon/button
watermelon add @aceternity/card --dry-run
watermelon add button --path src
watermelon add button --force
```

Flags:

- `--force` overwrite existing files
- `--path <path>` install into a custom directory
- `--dry-run` preview dependencies and file changes

## Configuration

Watermelon stores project config in `watermelon.json`.

```json
{
  "registries": {
    "@watermelon": {
      "name": "@watermelon",
      "homepage": "https://registry.watermelon.dev",
      "url": "https://registry.watermelon.dev/{name}.json",
      "description": "Official Watermelon component registry."
    },
    "@aceternity": {
      "name": "@aceternity",
      "homepage": "https://aceternity.com",
      "url": "https://aceternity.com/r/{name}.json",
      "description": "Aceternity UI component registry."
    }
  },
  "defaultRegistry": "https://registry.watermelon.dev/{name}.json"
}
```

See [examples/watermelon.json](./examples/watermelon.json) for a complete example.

## Registry Format

Any registry can work if it serves:

- `/<component>.json`
- `/files/<file>`

It can also use a shadcn-style directory entry with a URL template such as:

```json
{
  "name": "@8bitcn",
  "homepage": "https://www.8bitcn.com",
  "url": "https://www.8bitcn.com/r/{name}.json",
  "description": "A set of 8-bit styled retro components."
}
```

Example manifest:

```json
{
  "name": "button",
  "dependencies": ["clsx"],
  "files": [
    {
      "path": "components/ui/button.tsx",
      "url": "https://registry.watermelon.dev/files/components/ui/button.tsx"
    }
  ]
}
```

See [examples/button.json](./examples/button.json) for a full example.

## Features

- 🚀 **Fast Installation** - Install components in seconds
- 📦 **Auto Dependencies** - Automatically installs only missing packages
- 🌐 **Multi-Registry** - Resolve scoped components across different registries
- 🧪 **Dry Runs** - Preview file changes before writing anything
- 🔧 **Type-Safe** - Full TypeScript support

## Available Components

- **button** - Versatile button component with multiple variants
- **text** - Typography component with semantic variants

## Documentation

For full documentation, visit: https://github.com/vanshpatelx/RN/tree/main/watermelon

## License

MIT © Vansh Patel
