Now it's the time to compile protobuf schema with our `pb` cli.

## Without additional options.

Run `pb gen ts` with `--entry-path` options for specifying protobuf schema
directory.

```bash
pb gen ts --entry-path=".pollapo"
```

Now you can see the `out` directory on your project root. `out` is the default
directory name for codegen output. In `out` directory, there are one index file
and three directories (messages, runtime, services).

- **Index file (index.ts)**: for re-exporting messages and services on the root.
- **messages**: En(de)coding codes for protobuf messages. each namespace
  directory has its own index file for re-exporting.
- **runtime**: Runtime codes for implementing protobuf en(de)coder and rpc. e.g.
  zigzag encoding, long implementation, devtools, rpc and many more codes are
  included here.
- **services**: Service client codes. you can get the `createServiceClient` for
  each service and use it to create service. and also It has own index file on
  each namespace directory.

When you open the generated codes, you can notice that file extension for import
statement is `.ts`. If you are using this code on node or browser, you can
change this extension with `--ext-in-import` option. We recommend that you to
set the value " " to remove file extension (like this: `--ext-in-import=" "`).
More options are listed in
[4.1 Generate Codes: pb gen ts](../pb/generate-codes#pb-gen-ts).

## Codegen for real-world project.

For re-compile the protobuf schema, add some options like this:

```bash
pb gen ts --entry-path=".pollapo" --out-dir="generated" --ext-in-import=" "
```

This will change the output directory and file extension for import statement.

You can use `@pbkit/grpc-web-client` library for creating gRPC-Web client.

```bash
yarn add @pbkit/grpc-web-client
```

So If you installed `pbkit/interface-pingpong-server` for example, you can use
the service and messages like this.

```tsx
import { createGrpcWebClientImpl } from "@pbkit/grpc-web-client";
import { createServiceClient } from "generated/services/pbkit/pingpong/PingPongService";
import { Ping, Pong } from "generated/messages/pbkit/pingpong";

// Create service client.
const pingPongService = createPingPongService(createGrpcWebClientImpl({
  // the grpc-web server host
  host: "http://localhost:8080",
  // option for sending req/res events to chrome devtools.
  devtools: true,
}));

// Just send like this.
const sendPing = async (request: Ping): Promise<Pong> => {
  return pingPongService.pingpong(request);
};

sendPing({ hello: "hi" }).then(console.log);
// Result
// { "world": "Pong" }
```

If you want to see more advanced usages with `pbkit/interface-pingpong-server`
or React, explore
[pbkit/pingpong-client](https://github.com/pbkit/pingpong-client) for more
informations.
