#!/bin/bash
set -e

# Script to synchronize version across all relevant files
# Usage: ./sync-versions.sh <new-version>

if [ $# -eq 0 ]; then
	echo "Usage: $0 <new-version>"
	echo "Example: $0 1.0.0"
	exit 1
fi

NEW_VERSION="$1"
CURRENT_DATE=$(date +%Y-%m-%d)

echo "Synchronizing version to: $NEW_VERSION"
echo "Release date: $CURRENT_DATE"

# Update package.json
if [ -f "package.json" ]; then
	sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$NEW_VERSION\"/" package.json
	echo "✓ Updated package.json"
fi

# Update Cargo.toml (app version only, not dependencies)
if [ -f "src-tauri/Cargo.toml" ]; then
	# Use a more specific pattern that matches the package version near the beginning of the file
	sed -i '0,/^version = "[^"]*"/s/version = "[^"]*"/version = "'"$NEW_VERSION"'"/' src-tauri/Cargo.toml
	echo "✓ Updated src-tauri/Cargo.toml"
fi

# Update tauri.conf.json
if [ -f "src-tauri/tauri.conf.json" ]; then
	sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$NEW_VERSION\"/" src-tauri/tauri.conf.json
	echo "✓ Updated src-tauri/tauri.conf.json"
fi

# Update environment.ts
if [ -f "src/environments/environment.ts" ]; then
	sed -i "s/version: \"[^\"]*\"/version: \"$NEW_VERSION\"/" src/environments/environment.ts
	echo "✓ Updated src/environments/environment.ts"
fi

# Update Flatpak manifest - only update the app version, not runtime-version or sdk version
if [ -f "flatpak/com.tcs.allinonetoolkitv2.yml" ]; then
	# Update only the version field (not runtime-version or sdk version)
	sed -i "s/^version: .*/version: '$NEW_VERSION'/" flatpak/com.tcs.allinonetoolkitv2.yml
	echo "Updated flatpak/com.tcs.allinonetoolkitv2.yml"
fi

# Update Flatpak metainfo.xml with current date
update_metainfo() {
	local metainfo_file="$1"

	if [ ! -f "$metainfo_file" ]; then
		return
	fi

	# Check if this version already exists
	if grep -q "version=\"$NEW_VERSION\"" "$metainfo_file"; then
		echo "⚠ Release version $NEW_VERSION already exists in $metainfo_file"
		return
	fi

	# Check if xmlstarlet is available for proper XML manipulation
	if command -v xmlstarlet &>/dev/null; then
		# Create a temporary file with the new release
		xmlstarlet ed \
			-s '//releases' -t elem -n 'release-tmp' \
			-i '//release-tmp' -t attr -n 'version' -v "$NEW_VERSION" \
			-i '//release-tmp' -t attr -n 'date' -v "$CURRENT_DATE" \
			-s '//release-tmp' -t elem -n 'description' \
			-s '//release-tmp/description' -t elem -n 'p' -v 'Release version '"$NEW_VERSION" \
			-r '//release-tmp' -v 'release' \
			"$metainfo_file" >/tmp/metainfo_tmp.xml

		# Move releases to be first child
		xmlstarlet ed \
			-m '//release[1]' -i '//releases/release[2]' \
			/tmp/metainfo_tmp.xml >"$metainfo_file"

		rm -f /tmp/metainfo_tmp.xml
		echo "✓ Updated $metainfo_file with new release using xmlstarlet"
	else
		# Fallback method: simple text replacement
		cp "$metainfo_file" "${metainfo_file}.bak"

		# Insert the new release after <releases> tag
		awk -v version="$NEW_VERSION" -v date="$CURRENT_DATE" '
        /<releases>/ {
            print $0
            print "    <release version=\"" version "\" date=\"" date "\">"
            print "      <description>"
            print "        <p>Release version " version "</p>"
            print "      </description>"
            print "    </release>"
            next
        }
        { print }
        ' "${metainfo_file}.bak" >"$metainfo_file"

		rm -f "${metainfo_file}.bak"
		echo "✓ Updated $metainfo_file with new release"
	fi
}

# # Update metainfo in root directory
# if [ -f "com.tcs.allinonetoolkitv2.metainfo.xml" ]; then
#     update_metainfo "com.tcs.allinonetoolkitv2.metainfo.xml"
# fi

# Update metainfo in flatpak directory
if [ -f "flatpak/com.tcs.allinonetoolkitv2.metainfo.xml" ]; then
	update_metainfo "flatpak/com.tcs.allinonetoolkitv2.metainfo.xml"
fi

echo ""
echo "================================================"
echo "✓ Version synchronization completed!"
echo "New version: $NEW_VERSION"
echo "Release date: $CURRENT_DATE"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Review the changes: git diff"
echo "2. Update release descriptions in metainfo.xml if needed"
echo "3. Commit: git add . && git commit -m 'Bump version to $NEW_VERSION'"
echo "4. Tag: git tag v$NEW_VERSION"
echo "5. Push: git push && git push --tags"
