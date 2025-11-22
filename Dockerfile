FROM --platform=$TARGETPLATFORM ubuntu:22.04 AS builder

ENV DEBIAN_FRONTEND=noninteractive
ENV RUST_BACKTRACE=1
ENV NODE_ENV=production

# Install dependencies including AppImage build requirements
RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential curl wget git ca-certificates unzip \
  libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev \
  libjavascriptcoregtk-4.1-dev libxdo-dev libssl-dev pkg-config \
  patchelf python3 python3-pip fuse3 desktop-file-utils \
  librsvg2-dev libgdk-pixbuf2.0-dev \
  # Additional dependencies for AppImage building
  libdbusmenu-gtk3-dev \
  libglib2.0-dev libxss-dev libxt-dev libxtst-dev libgudev-1.0-dev \
  libgirepository1.0-dev libsecret-1-dev \
  # Additional tools for AppImage
  binutils file \
  && rm -rf /var/lib/apt/lists/*

# Node.js v22
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
  apt-get install -y nodejs

# Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable
ENV PATH="/root/.cargo/bin:$PATH"

WORKDIR /app

# Copy all files first
COPY . .

# Install dependencies with retry logic and multiple fallbacks
RUN if [ -f "bun.lockb" ]; then \
  echo "Installing using bun..." && \
  if ! bun install --frozen-lockfile; then \
  echo "bun install failed, trying with --no-verify flag..." && \
  if ! bun install --no-verify; then \
  echo "bun install failed, trying with npm..." && \
  npm config set registry https://registry.npmjs.org/ && \
  npm install --legacy-peer-deps; \
  fi; \
  fi; \
  else \
  echo "No bun.lockb found, trying to install with npm..." && \
  npm config set registry https://registry.npmjs.org/ && \
  npm install --legacy-peer-deps; \
  fi

# Make sure the build script is executable
RUN chmod +x ./scripts/build-optimized.sh

# Build the application using the build:smart script (which will create the AppImage)
RUN echo "Building application with build:smart..." && \
  bun run build:smart

# List and verify the AppImage was created
RUN find . -name "*.AppImage" -exec ls -lh {} \; || echo "AppImage not found!"

# Verify AppImage file
RUN APPIMAGE_FILE=$(find . -name "*.AppImage" | head -n1) && \
  if [ -n "$APPIMAGE_FILE" ] && [ -f "$APPIMAGE_FILE" ]; then \
  echo "AppImage found: $APPIMAGE_FILE"; \
  chmod +x "$APPIMAGE_FILE"; \
  file "$APPIMAGE_FILE"; \
  else \
  echo "ERROR: AppImage was not created successfully"; \
  exit 1; \
  fi

# Final stage – just export the AppImage
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y --no-install-recommends \
  fuse3 ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /output
COPY --from=builder /app/src-tauri/target/release/bundle/appimage/*.AppImage ./
# To copy the AppImage to host system, run:
# podman create --name temp-container <image_name>
# podman cp temp-container:/output/allinonetoolkitv2_0.4.5_amd64.AppImage ./src-tauri/target/release/bundle/appimage/
CMD ["ls", "-la", "/output"]