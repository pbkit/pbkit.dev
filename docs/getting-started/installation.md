`pbkit` provides three clis.

- `pb`: Protobuf schema compiler.
- `pbkit`: Version manager for pbkit.
- `pollapo`: Package manager for protobuf schemas.

# Recommended way

1. [Install Deno](https://deno.land/#installation)
1. Setup `PATH` to your `$HOME/.zshrc` (or similar)
   ```bash
   export PATH="$HOME/.deno/bin:$PATH"
   ```
1. Run below
   ```bash
   deno run -A --unstable https://pbkit.dev/ use
   ```

# Other methods

## macOS

**Using homebrew**

```bash
brew install pbkit/tap/pbkit
```

## Linux

**Using pre-built binary**\
You can find pre-built binary in
[release assets](https://github.com/pbkit/pbkit/releases).\
Download it and copy it to somewhere in PATH.

## Windows

You have to install two clis respectively.

### Install pollapo

Note that you should add pollapo installed location to _PATH environment
variable_ manually.

**Using pre-built binary**\
You can find pre-built binary in
[release assets](https://github.com/pbkit/pbkit/releases).\
Download it and copy it to somewhere in PATH.

**Using msi installer**\
You can find msi installer in
[release assets](https://github.com/pbkit/pbkit/releases).

**Using winget**

```powershell
winget install Riiid.pollapo
```

### Install pb

**Using pre-built binary**\
You can find pre-built binary in
[release assets](https://github.com/pbkit/pbkit/releases).\
Download it and copy it to somewhere in PATH.

## Install from source

Make sure you have the following prerequisites installed:

- [git](https://git-scm.com/)
- [deno](https://deno.land/)

```bash
# clone pbkit repository
git clone git@github.com:pbkit/pbkit.git

# Install pb, pbkit, pollapo command
deno install -n pb -A --unstable pbkit/cli/pb/entrypoint.ts
deno install -n pbkit -A --unstable pbkit/cli/pbkit/entrypoint.ts
deno install -n pollapo -A --unstable pbkit/cli/pollapo/entrypoint.ts
```
