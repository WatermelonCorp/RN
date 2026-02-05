# 🍉 Watermelon Design System

A beautiful, accessible component library for React Native and Expo applications. Built with NativeWind (Tailwind CSS) and inspired by shadcn/ui.

## Features

- 🎨 **Beautiful Components** - Carefully crafted UI components
- ⚡ **Fast Setup** - Get started in minutes with the CLI
- 🎯 **Type-Safe** - Written in TypeScript
- 📱 **Cross-Platform** - Works on iOS, Android, and Web
- 🎨 **Customizable** - Tailwind-based styling system
- 🔧 **CLI Tool** - Easy component installation

## Quick Start

### 1. Install the CLI

```bash
# Clone the repository
git clone https://github.com/vanshpatelx/RN.git
cd RN/watermelon

# Build the CLI
pnpm install
pnpm --filter watermelon-cli build

# Link CLI globally
cd apps/cli
npm link
```

### 2. Initialize in Your Project

```bash
# Navigate to your Expo project
cd your-expo-app

# Initialize Watermelon
watermelon init
```

This will:
- Create a `watermelon.json` config file
- Set up component directories
- Install required dependencies
- Create utility functions

### 3. Add Components

```bash
# Add the button component
watermelon add button

# Add multiple components
watermelon add button text
```

### 4. Use Components

```tsx
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function App() {
  return (
    <>
      <Text variant="h1">Hello Watermelon!</Text>
      <Button onPress={() => console.log('Pressed!')}>
        Click Me
      </Button>
    </>
  );
}
```

## Available Components

- **Button** - Versatile button component with multiple variants
- **Text** - Typography component with semantic variants (h1-h4, p, etc.)

## CLI Commands

### `watermelon init`

Initialize Watermelon in your project.

**Options:**
- Tailwind config path
- Global CSS path
- Component import alias
- Utils import alias

### `watermelon add <component>`

Add one or more components to your project.

**Example:**
```bash
watermelon add button
watermelon add button text
```

This will:
- Download component files from the registry
- Install required dependencies
- Transform imports to match your configuration
- Create component files in your project

## Project Structure

```
watermelon/
├── apps/
│   ├── cli/           # CLI tool
│   ├── docs/          # Documentation site
│   └── showcase/      # Component showcase app
├── packages/
│   └── registry/      # Component registry
└── templates/
    └── base/          # Test template
```

## Development

### Build the CLI

```bash
pnpm --filter watermelon-cli build
```

### Run the Showcase App

```bash
pnpm dev:showcase:web
```

### Test with Template

```bash
# Copy template to test directory
cp -r templates/base /tmp/watermelon-test
cd /tmp/watermelon-test

# Install dependencies
pnpm install

# Initialize and add components
watermelon init
watermelon add button

# Run the app
npx expo start --web
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

---

Built with ❤️ using React Native, Expo, and NativeWind
