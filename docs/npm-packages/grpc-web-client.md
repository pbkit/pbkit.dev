You can install `@pbkit/grpc-web-client`:

```bash
# yarn
yarn add @pbkit/grpc-web-client
# npm
npm i @pbkit/grpc-web-client
```

Here is the example using `@pbkit/grpc-web-client`:

```typescript
import {
  createGrpcWebClientImpl,
  CreateGrpcWebClientImplConfig,
} from "@pbkit/grpc-web-client";
import { createServiceClient as createPingPongService } from "generated/services/pbkit/pingpong/PingPongService";
import {
  createServiceClient as createThrowService,
  CreateServiceClientConfig,
} from "generated/services/pbkit/pingpong/ThrowService";

export const createServices = () => {
  const config: CreateGrpcWebClientImplConfig = {
    host: ENV_HOST,
  };
  const grpcWebClient = createGrpcWebClientImpl(config);
  const serviceConfig: CreateServiceClientConfig = {
    devtools: env.NODE_ENV === "development",
  };
  return {
    PingPongService: createPingPongService(grpcWebClient, config),
    ThrowService: createThrowService(grpcWebClient, config),
  };
};
```

# Advanced Usage

## Write middleware for service client.

Think [express](https://expressjs.com) middleware that intercepts requests and
responses and does something. Middleware can perform the following tasks:

- Execute any codes with requests and responses.
- Make changes to the request and the response.
- e.g. Retrying, Logging, Update authentication information, etc.

You have to write your own client implementation that acts like exactly what a
genuine rpc client did. We provide an example to implement it fast. Here you can
find the logic handling with `devtools` flag in `createServiceClient` in
generated service code.

```typescript
export function createServiceClient<TMetadata, THeader, TTrailer>(
  rpcClientImpl: RpcClientImpl<TMetadata, THeader, TTrailer>,
  config?: CreateServiceClientConfig,
): Service<[] | [TMetadata], [] | [THeader, Promise<TTrailer>]> {
  let _rpcClientImpl = rpcClientImpl;
  const responseOnly = config?.responseOnly ?? true;
  const devtools = config?.devtools ?? false;
  if (devtools) {
    const tags = devtools === true ? [] : devtools.tags;
    const devtoolsConfig = getDevtoolsConfig();
    // Wrapping to send request/response events to chrome devtools.
    _rpcClientImpl = wrapRpcClientImpl({ rpcClientImpl, devtoolsConfig, tags });
  }
  // ...
}
```

Like how devtools implementation did, you can also wrap your `serviceClient`
using your own `wrapRpcClientImpl` outside the `createServiceClient`.

```typescript
import { createGrpcWebClientImpl } from "@pbkit/grpc-web-client";
import { defer } from "pbkit/core/runtime/async/observer";
import { first, fromSingle } from "pbkit/core/runtime/async/async-generator";
import { RpcClientImpl } from "pbkit/core/runtime/rpc";

export interface WrapRpcClientImplConfig<TMetadata, THeader, TTrailer> {
  rpcClientImpl: RpcClientImpl<TMetadata, THeader, TTrailer>;
}

// Implement your own `wrapMyRpcClientImpl`
function wrapMyRpcClientImpl<TMetadata, THeader, TTrailer>(
  config: WrapRpcClientImplConfig<TMetadata, THeader, TTrailer>,
): RpcClientImpl<TMetadata, THeader, TTrailer> {
  return function myRpcClientImpl(methodDescriptor) {
    const { rpcClientImpl } = config;
    const rpcMethodImpl = rpcClientImpl(methodDescriptor);
    return function myRpcMethodImpl(request, metadata) {
      const headerPromise = defer<THeader>();
      const trailerPromise = defer<TTrailer>();
      const resAsyncGenerator = (async function* () {
        // Do something in here with payload
        // Below example assumes that this is only for unary call.
        const requestPayload = await first(request);

        const rpcMethodResult = rpcMethodImpl(
          fromSingle(requestPayload),
          metadata,
        );
        // Get the result and you can re-request or modify logic here.
        const [header, payload, trailer] = await Promise.all([
          rpcMethodResult[1],
          first(rpcMethodResult[0]),
          rpcMethodResult[2],
        ]);

        headerPromise.resolve(header);
        yield payload;
        trailerPromise.resolve(trailer);
      })();
      return [resAsyncGenerator, headerPromise, trailerPromise];
    };
  };
}

export const createGrpcServices = () => {
  const config: CreateGrpcWebClientImplConfig = {
    host: ENV_HOST,
    metadata: "SOME_METADATA",
  };
  const grpcWebClient = wrapMyRpcClientImpl({
    rpcClientImpl: createGrpcWebClientImpl(config),
  });
};
```

As you can see, we recommend using async utils in `pbkit/runtime` to implement
your own `wrapRpcClientImpl`. You can use it by installing `pbkit` or
`@pbkit/runtime`. The pbkit package includes `async` utils along with parser,
codegen related codes, and `pb-gen-ts` cli. If you don't need others, you can
install `@pbkit/runtime` only.

```bash
# yarn
yarn add pbkit
# npm
npm i pbkit
```

or

```bash
# yarn
yarn add @pbkit/runtime
# npm
npm i @pbkit/runtime
```
