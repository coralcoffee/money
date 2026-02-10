# Learning Log

## Rsbuild Configuration

### Entry Point Configuration

```typescript
entry: { index: "./src/renderer/main.tsx" },
```

**Explanation:**

This line defines the **entry point** for the Rsbuild bundler in an object format. Here's what each part means:

- **`entry`**: This is the configuration property that tells Rsbuild where to start building your application from
- **`{ index: ... }`**: This is an object syntax that creates a named entry point called "index"
- **`"./src/renderer/main.tsx"`**: This is the relative path to the actual entry file

#### Why Use Object Syntax?

The object syntax `{ index: "..." }` instead of just a string `"..."` provides several benefits:

1. **Named Chunks**: The key "index" becomes the name of the generated JavaScript bundle
2. **URL Structure**: In development, this creates the route structure (e.g., `http://localhost:3000/`)
3. **Multiple Entries**: You can define multiple entry points if needed:

   ```typescript
   entry: {
     index: "./src/renderer/main.tsx",
     admin: "./src/admin/admin.tsx"  // Would create /admin route
   }
   ```

#### Entry Point Naming Impact

- **"index"**: Creates the root path (`/`) - standard for main application pages
- **"app"**: Would create `/app` path - requires navigating to a sub-route
- **"main"**: Would create `/main` path

#### File Structure Context

In this Electron application:

- **Main Process**: `src/main/main.ts` (Node.js environment, manages windows)
- **Renderer Process**: `src/renderer/main.tsx` (Browser environment, React UI)

The entry point `./src/renderer/main.tsx` is specifically for the **renderer process** - the part that displays the user interface using React.

#### Best Practices

- Use "index" for the primary application entry point
- Keep entry files in dedicated directories (`src/renderer/` for Electron renderer)
- Entry files should be minimal and primarily handle initialization and mounting

#### Related Configuration

This entry point works together with:

- `html.template`: Points to the HTML file that will load this JavaScript
- `output.distPath`: Determines where the bundled files are placed
- React components imported from this entry point build the entire UI tree

## Troubleshooting: Entry Point Naming Issue

### Problem Encountered

**Initial Mistake**: Used `'app'` as the entry point name:

```typescript
entry: { app: "./src/renderer/main.tsx" },
```

**Issue**: This caused the application to be accessible at `http://127.0.0.1:3000/app` instead of the root URL `http://127.0.0.1:3000/`.

### Root Cause

When using object syntax for entry points, the key name becomes part of the URL structure:

- `{ app: "..." }` → Creates `/app` route
- `{ index: "..." }` → Creates `/` (root) route

### Solution Applied

**Fix**: Changed entry point name from `'app'` to `'index'`:

```typescript
// Before (problematic)
entry: { app: "./src/renderer/main.tsx" },

// After (fixed)
entry: { index: "./src/renderer/main.tsx" },
```

### Result

- ✅ Application now accessible at root URL: `http://127.0.0.1:3000/`
- ✅ Electron main process can load the renderer correctly
- ✅ Development server works as expected

### Key Takeaway

Always use `'index'` as the entry point name for the main application to ensure it serves from the root path, which is the standard expectation for web applications and Electron apps.

## TypeScript Configuration for Electron Apps

### ES Modules Best Practice

For new Electron applications, prefer **ES modules** over CommonJS. This provides better tree-shaking, modern syntax support, and aligns with current JavaScript standards.

### TypeScript Module Configuration Strategy

#### Main Process & Preload Scripts (Node.js Context)

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}
```

**Why NodeNext?**

- Handles Node.js native ES modules correctly
- Supports both `.js` and `.mjs` file extensions
- Proper handling of `package.json` `"type": "module"`
- Compatible with Node.js runtime environment

#### Renderer Process (Browser Context)

```json
{
  "compilerOptions": {
    "module": "ESNext", 
    "moduleResolution": "Bundler"
  }
}
```

**Why ESNext + Bundler?**

- **ESNext**: Latest JavaScript module syntax for optimal bundler compatibility
- **Bundler**: TypeScript 5.0+ module resolution specifically designed for bundlers (Rsbuild/Webpack/Vite)
- Enables advanced bundler features like tree-shaking and code splitting

### Configuration Files in This Project

This project uses the dual TypeScript configuration approach:

1. **`tsconfig.main.json`** - For main process and preload scripts
   - Uses `"module": "NodeNext"` and `"moduleResolution": "NodeNext"`
   - Compiles to Node.js compatible code

2. **`tsconfig.json`** - For renderer process  
   - Uses `"module": "ESNext"` and `"moduleResolution": "Bundler"`
   - Optimized for Rsbuild bundling

### Benefits of This Approach

- **Type Safety**: Full TypeScript support across all processes
- **Modern Standards**: Uses latest ES module specifications
- **Bundler Optimization**: Renderer benefits from advanced bundling features
- **Runtime Compatibility**: Main process works correctly with Node.js ES modules
- **Development Experience**: Better IDE support and error detection