copy_files() {
  source_dir="$1"
  destination_dir="$2"

  if [ -d "$source_dir" ]; then
    mkdir -p "$destination_dir"
    cp -r "$source_dir"/* "$destination_dir"
  fi
}

# Copy mail layouts
copy_files "./src/packages/mail/libs/views/layouts" "./build/packages/mail/libs/views/layouts"
