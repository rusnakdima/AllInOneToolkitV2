#!/usr/bin/env bash
# build-tauri-appimage.sh — Official Tauri approach with proper dependencies (using bun only)

set -e

PROJECT_DIR="$(pwd)"
ARCH="$(uname -m)"

echo "Building Tauri AppImage for $ARCH (using bun only)…"
echo

# Determine the correct architecture for AppImage tools
case "$ARCH" in
x86_64)
	APPIMAGE_ARCH="x86_64"
	;;
aarch64)
	APPIMAGE_ARCH="aarch64"
	;;
amd64)
	APPIMAGE_ARCH="amd64"
	;;
*)
	echo "Unsupported architecture: $ARCH"
	exit 1
	;;
esac

echo "Using architecture: $APPIMAGE_ARCH"

# Check if podman is installed
if ! command -v podman &>/dev/null; then
	echo "Podman is not installed. Please install podman first."
	echo "On Ubuntu/Debian: sudo apt install podman"
	echo "On CentOS/RHEL: sudo dnf install podman"
	echo "On Arch: sudo pacman -S podman"
	exit 1
fi

echo "Podman is available, proceeding with build..."

# Check if the Arch Linux image exists, pull it if it doesn't
if ! podman image exists docker.io/library/archlinux:latest; then
	echo "Pulling Arch Linux image..."
	podman pull --arch "$ARCH" docker.io/library/archlinux:latest
else
	echo "Arch Linux image already exists"
fi

# Tag the image for later access
podman tag docker.io/library/archlinux:latest tauri-build-archlinux:"$ARCH"

podman run --rm \
	--arch "$ARCH" \
	-v "$PROJECT_DIR:/src:Z" \
	-w /src \
	tauri-build-archlinux:"$ARCH" \
	bash -c "
    set -e

    echo 'Updating system…'
    pacman -Syu --noconfirm

    echo 'Installing all required packages (correct Arch package names)…'
    # Set environment variables to make pacman non-interactive
    export PATH_ESCAPED=\"\$PATH\"
    export PKGEXT='.pkg.tar.zst'

    # # Install packages with default provider selection where needed
    pacman -S --noconfirm --needed base-devel rust nodejs git curl wget unzip \
      gtk3 webkit2gtk-4.1 librsvg libappindicator-gtk3 \
      squashfs-tools fuse2 desktop-file-utils \
      libappindicator-gtk3 libdbusmenu-gtk3 glib2 \
      libxtst libxt libxss libgudev libsecret python python-pip \
      ttf-dejavu  # explicitly install a font package to avoid provider selection prompt

    # Install bun
    echo 'Installing bun globally…'
    curl -fsSL https://bun.com/install | bash
    export PATH=\"\$PATH:/root/.bun/bin\"

    # # Install tauri-cli
    # echo 'Installing tauri-cli…'
    # cargo install tauri-cli --locked

    # Install Node.js packages using bun only
    echo 'Using bun for package management…'
    /root/.bun/bin/bun install

    # Set PATH to include bun
    export PATH=\"\$PATH:/root/.bun/bin:\$HOME/.cargo/bin\"

    # Run the build:smart script which will build the app with AppImage bundle
    echo 'Running build:smart to build the app with AppImage bundle...'
    bun run build:smart

    # List all files in the bundle directory to see what was created
    echo 'Contents of the bundle directory:'
    find src-tauri/target/release/bundle/appimage/ -type f -ls

    # Find and report on the AppImage file
    APPIMAGE_FILE=\$(find src-tauri/target/release/bundle/appimage/ -name '*.AppImage' | head -n1)
    if [ -n \"\$APPIMAGE_FILE\" ] && [ -f \"\$APPIMAGE_FILE\" ]; then
        echo
        echo 'SUCCESS! AppImage was created:'
        ls -lh \"\$APPIMAGE_FILE\"
        chmod +x \"\$APPIMAGE_FILE\"
    else
        echo
        echo 'ERROR: AppImage was not created successfully'
        echo 'Available bundle types:'
        ls -la src-tauri/target/release/bundle/ || echo 'Bundle directory does not exist'
        exit 1
    fi
  "

echo
echo "Build process completed! Checking for AppImage files:"
APPIMAGE_FILES=$(ls src-tauri/target/release/bundle/appimage/*.AppImage 2>/dev/null || true)
if [ -n "$APPIMAGE_FILES" ]; then
	ls -lh src-tauri/target/release/bundle/appimage/*.AppImage
	echo
	echo "AppImage build was successful!"
else
	echo "No AppImage found in output directory. Build may have failed."
	echo "Contents of bundle directory:"
	ls -la src-tauri/target/release/bundle/ 2>/dev/null || echo "Bundle directory does not exist"
fi

echo
echo "All done! Your AppImage should be in:"
echo "    $PROJECT_DIR/src-tauri/target/release/bundle/appimage/"
