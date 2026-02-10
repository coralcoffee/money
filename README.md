# Money

A cross-platform desktop application for personal finance management built with Electron, React, Vite, and electron-vite.

## 🚀 Features

- Cross-platform desktop application (Windows, macOS, Linux)
- Modern React UI with TypeScript
- Fast development with Rsbuild
- Hot reload during development
- Automated build and distribution

## 🛠️ Tech Stack

- **Frontend**: React 19.1.1 + TypeScript
- **Desktop Framework**: Electron 38.1.2
- **Build Tools**: Vite + electron-vite
- **Package Manager**: npm
- **Distribution**: electron-builder

## 📋 Prerequisites

- Node.js (LTS version recommended)
- npm

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd money

# Install dependencies
npm install
```

`npm install` at the repository root installs both root and `webui` dependencies via npm workspaces.

### Development

```bash
# Start development server with hot reload
npm run start

# Build desktop app assets with electron-vite
npm run build:ev

# Type checking
npm run type-check
```

The development server will start:
- Renderer process: http://127.0.0.1:3000
- Electron app will launch automatically

### Building

```bash
# Build for production
npm run build

# Package the app (creates distributable folder)
npm run pack

# Create distribution packages
npm run dist
```

## 📁 Project Structure

```
├── src/
│   ├── main/           # Electron main process
│   │   ├── main.ts     # Main process entry point
│   │   └── preload.ts  # Preload script
│   └── renderer/       # React renderer process
│       ├── App.tsx     # Main React component
│       ├── index.html  # HTML template
│       └── main.tsx    # Renderer entry point
├── scripts/
│   └── copy-after-build.mjs  # Post-build script
├── dist/               # Build output
├── release/            # Distribution packages
├── package.json
├── rsbuild.config.ts   # Rsbuild configuration
├── tsconfig.json       # TypeScript config (renderer)
├── tsconfig.main.json  # TypeScript config (main)
└── electron-builder.yml # Electron builder config
```

## 🔧 Configuration

### Desktop API Runtime Settings

The desktop app reads API mode settings from:

- Windows: `%APPDATA%/Money/settings.json`
- macOS: `~/Library/Application Support/Money/settings.json`
- Linux: `~/.config/Money/settings.json`

If the file does not exist, it is created automatically with defaults:

```json
{
  "api": {
    "mode": "auto",
    "remoteBaseUrl": "http://127.0.0.1:5000",
    "localBaseUrl": "http://127.0.0.1:5073",
    "healthPath": "/health",
    "localEnabled": true
  }
}
```

`mode` supports `remote`, `local`, or `auto`. `auto` tries remote first, then falls back to local if enabled.

### Electron-Vite Configuration

The project uses electron-vite for desktop build/preview (`build:ev`, `preview:ev`).
Development (`start`) also runs through electron-vite.

### Electron Builder

Configured for multi-platform distribution:
- **Windows**: NSIS installer
- **macOS**: Developer tools category
- **Linux**: AppImage format

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `npm run start` | Start desktop development with electron-vite |
| `npm run dev:webui` | Start only renderer development server |
| `npm run build:ev` | Build desktop assets with electron-vite |
| `npm run build` | Build entire application for production |
| `npm run pack` | Package app without creating installers |
| `npm run dist` | Create distribution packages |
| `npm run type-check` | Run TypeScript type checking |

## 🏗️ Build Output

- **Development**: Served from `http://127.0.0.1:3000`
- **Production**: Built to `dist/` directory
- **Packages**: Created in `release/` directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🐛 Troubleshooting

### Common Issues

1. **Build fails**: Ensure all dependencies are installed with `npm install`
2. **Electron doesn't start**: Check desktop asset build with `npm run build:ev`
3. **Hot reload not working**: Verify the development server is running on port 3000

### Development Tips

- Use the `render` script to develop the React UI independently
- The `DEV_SERVER_URL` environment variable points Electron to the development server
- Check the `dist/main/` directory for compiled main process files

## 📞 Support

If you encounter any issues or have questions, please open an issue in the repository.
