# Scripts Directory

This directory contains utility scripts for the AllInOneToolkitV2 project.

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

## Build Scripts

### `build-optimized.sh`

An optimized build script that helps avoid unnecessary recompilation of Tauri components by checking if frontend or Rust code has changed since the last build.

#### Usage

```bash
# Build for desktop (default to release)
./scripts/build-optimized.sh build desktop release

# Build for desktop in debug mode
./scripts/build-optimized.sh build desktop debug

# Build for Android APK
./scripts/build-optimized.sh build android-apk release

# Build for Android AAB
./scripts/build-optimized.sh build android-aab release

# Clean all build artifacts
./scripts/build-optimized.sh clean
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