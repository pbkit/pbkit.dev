The `pb gen` command is to generate code.

## pb gen json

You can generate json with specifying protobuf files.

```bash
pb gen json a.proto b.proto
```

Also with appropriate options, you can generate json more easily.

- **`--entry-path <dir>`**: you can generate with **all** protobuf files under
  the specified directory.
- **`--proto-path <dir>`**: you can specify the directory in which to search for
  **imports**.

So in most of use cases, you can use just below commands to generate json.

```bash
pb gen json --entry-path=".pollapo"
```

## pb gen ts

There are some additional options to generate typescript library. The base
options are equal to `pb gen json`.

```bash
pb gen ts a.proto b.proto
```

Here are the options:

- **`-o, --out-dir <dir>`**: The output directory. defaults to `out`.
- **`--runtime-dir <dir>`**: The output directory name for runtime. defaults to
  `runtime`.
- **`--messages-dir <dir>`**: The output directory name for messages. defaults
  to `messages`.
- **`--services-dir <dir>`**: The output directory name for services. defaults
  to `services`.
- **`--index-filename <filename>`**: Specify the filename for re-exporting
  module. defaults to `index`.
- **`--ext-in-import <dir>`**: Specify the file extension in import statement.
  defaults to `.ts`.
- **`--runtime-package <package>`**: The external runtimes you want to rely on
  instead of codegen.

We recommend you to use below command to generate typescript library.

```bash
pb gen ts --entry-path=".pollapo" --out-dir="generated" --ext-in-import=" "
```
