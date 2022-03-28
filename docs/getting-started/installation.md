`pbkit` provides two clis.
- `pb`: the protobuf schema compiler
- `pollapo`: the package manager for protocol buffers.

## macOS
**Using homebrew**
```bash
brew tap pbkit/tap
brew install pbkit
```

## Linux
**Using pre-built binary**  
You can find pre-built binary in [release assets](https://github.com/pbkit/pbkit/releases).  
Download it and copy it to somewhere in PATH.

## Windows
You have to install two clis respectively.
### Install pollapo
Note that you should add pollapo installed location to *PATH environment variable* manually.  

**Using pre-built binary**  
You can find pre-built binary in [release assets](https://github.com/pbkit/pbkit/releases).  
Download it and copy it to somewhere in PATH.

**Using msi installer**  
You can find msi installer in [release assets](https://github.com/pbkit/pbkit/releases).

**Using winget**
```powershell
winget install Riiid.pollapo
```

### Install pb
**Using pre-built binary**  
You can find pre-built binary in [release assets](https://github.com/pbkit/pbkit/releases).  
Download it and copy it to somewhere in PATH.

## Install from source
Make sure you have the following prerequisites installed:
* [git](https://git-scm.com/)
* [deno](https://deno.land/)

```bash
# clone pbkit repository
git clone git@github.com:pbkit/pbkit.git

# Install pollapo command
deno install -n pb -A --unstable pbkit/cli/pb/entrypoint.ts
```