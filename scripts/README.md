# Scripts Directory

This directory contains utility scripts for the AllInOneToolkitV2 project.

## Build Scripts

### `build-optimized.sh` (Linux/macOS) and `build-optimized.cmd` (Windows)

These scripts provide optimized builds for the AllInOneToolkitV2 application, helping avoid unnecessary recompilation of components.

#### Features

- Checks for file changes before rebuilding frontend or Rust code
- Supports multiple targets: desktop, android, ios
- Supports build types: release (default) and debug
- Maintains build artifacts caching to speed up repeated builds
- CI/CD friendly with environment variable support

#### Usage

```bash
# Make the script executable first
chmod +x scripts/build-optimized.sh

# Build for desktop (default to release)
./scripts/build-optimized.sh build desktop release

# Build for desktop debug
./scripts/build-optimized.sh build desktop debug

# Build for Android
./scripts/build-optimized.sh build android release

# Clean all build artifacts
./scripts/build-optimized.sh clean

# Set environment variable to force rebuild
FORCE_BUILD=true ./scripts/build-optimized.sh build
```

#### Usage (Windows)

```cmd
REM Build desktop release (default)
scripts\build-optimized.cmd build release

REM Build desktop debug
scripts\build-optimized.cmd build desktop debug

REM Build Android
scripts\build-optimized.cmd build android release

REM Clean all build artifacts
scripts\build-optimized.cmd clean
```

#### Advanced Usage

You can use the `FORCE_BUILD` environment variable to skip change detection and force a full rebuild:

```bash
FORCE_BUILD=true ./scripts/build-optimized.sh build
```

### `build-tauri-appimage-arch.sh`

A containerized build script that creates an AppImage for Tauri applications using Arch Linux and Podman. It uses Bun as the package manager exclusively and ensures all dependencies are properly installed in a containerized environment.

#### Usage

```bash
# Build an AppImage for the current architecture
./scripts/build-tauri-appimage-arch.sh
```

This script will:

- Run in a containerized Arch Linux environment
- Install all necessary dependencies
- Use Bun exclusively for package management
- Build the Tauri application
- Create an AppImage bundle

## Version Synchronization Script

### `sync-versions.sh`

This script ensures version consistency across all project files:

- `package.json` (frontend version)
- `src-tauri/Cargo.toml` (backend version)
- `src-tauri/tauri.conf.json` (Tauri configuration)
- `src/environments/environment.ts` (Angular environment configuration)
- `flatpak/com.tcs.allinonetoolkitv2.yml` (Flatpak manifest)
- `flatpak/com.tcs.allinonetoolkitv2.metainfo.xml` (App metadata)

#### Usage

```bash
# Update all files to a new version
./scripts/sync-versions.sh 1.2.3
```

This script will update the version in all the relevant files and add a new release entry to the metainfo.xml file with the current date.

#### Files Updated

When you run the script:

1. Updates the version field in `package.json`
2. Updates the version field in `Cargo.toml`
3. Updates the version field in `tauri.conf.json`
4. Updates the version field in `environment.ts`
5. Updates the version field in the Flatpak manifest
6. Adds a new release entry to the metainfo.xml with current date

This ensures consistency across all version references in the project.
