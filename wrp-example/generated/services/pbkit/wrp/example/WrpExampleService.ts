import {
  MethodDescriptor,
  RpcClientImpl,
  RpcReturnType,
} from "https:/deno.land/x/pbkit@v0.0.45/core/runtime/rpc.ts";
import {
  decodeBinary,
  encodeBinary,
  encodeJson,
  Type as GetTextValueRequest,
} from "../../../../messages/pbkit/wrp/example/GetTextValueRequest.ts";
import {
  decodeBinary as decodeBinary_1,
  encodeBinary as encodeBinary_1,
  encodeJson as encodeJson_1,
  Type as GetTextValueResponse,
} from "../../../../messages/pbkit/wrp/example/GetTextValueResponse.ts";
import {
  decodeBinary as decodeBinary_2,
  encodeBinary as encodeBinary_2,
  encodeJson as encodeJson_2,
  Type as GetSliderValueRequest,
} from "../../../../messages/pbkit/wrp/example/GetSliderValueRequest.ts";
import {
  decodeBinary as decodeBinary_3,
  encodeBinary as encodeBinary_3,
  encodeJson as encodeJson_3,
  Type as GetSliderValueResponse,
} from "../../../../messages/pbkit/wrp/example/GetSliderValueResponse.ts";
import {
  first,
  fromSingle,
} from "https:/deno.land/x/pbkit@v0.0.45/core/runtime/async/async-generator.ts";
import {
  getDevtoolsConfig,
  wrapRpcClientImpl,
} from "https:/deno.land/x/pbkit@v0.0.45/core/runtime/client-devtools.ts";

export interface Service<
  TReqArgs extends any[] = [],
  TResArgs extends any[] = [],
> {
  getTextValue(
    request: GetTextValueRequest,
    ...args: TReqArgs
  ): RpcReturnType<Promise<GetTextValueResponse>, TResArgs>;
  getSliderValue(
    request: GetSliderValueRequest,
    ...args: TReqArgs
  ): RpcReturnType<AsyncGenerator<GetSliderValueResponse>, TResArgs>;
}

export type MethodDescriptors = typeof methodDescriptors;
export const methodDescriptors = {
  getTextValue: {
    methodName: "GetTextValue",
    service: { serviceName: "pbkit.wrp.example.WrpExampleService" },
    requestStream: false,
    responseStream: false,
    requestType: {
      serializeBinary: encodeBinary,
      deserializeBinary: decodeBinary,
      serializeJson: (value: GetTextValueRequest) =>
        JSON.stringify(encodeJson(value)),
    },
    responseType: {
      serializeBinary: encodeBinary_1,
      deserializeBinary: decodeBinary_1,
      serializeJson: (value: GetTextValueResponse) =>
        JSON.stringify(encodeJson_1(value)),
    },
  },
  getSliderValue: {
    methodName: "GetSliderValue",
    service: { serviceName: "pbkit.wrp.example.WrpExampleService" },
    requestStream: false,
    responseStream: true,
    requestType: {
      serializeBinary: encodeBinary_2,
      deserializeBinary: decodeBinary_2,
      serializeJson: (value: GetSliderValueRequest) =>
        JSON.stringify(encodeJson_2(value)),
    },
    responseType: {
      serializeBinary: encodeBinary_3,
      deserializeBinary: decodeBinary_3,
      serializeJson: (value: GetSliderValueResponse) =>
        JSON.stringify(encodeJson_3(value)),
    },
  },
} as const;

export class RpcError<TTrailer = any> extends Error {
  constructor(public trailer: TTrailer) {
    super();
  }
}
export interface CreateServiceClientConfig {
  responseOnly?: boolean;
  devtools?: true | { tags: string[] };
}
export function createServiceClient<TMetadata, THeader, TTrailer>(
  rpcClientImpl: RpcClientImpl<TMetadata, THeader, TTrailer>,
  config?: undefined,
): Service<[] | [TMetadata], []>;
export function createServiceClient<TMetadata, THeader, TTrailer>(
  rpcClientImpl: RpcClientImpl<TMetadata, THeader, TTrailer>,
  config: CreateServiceClientConfig & { responseOnly: false },
): Service<[] | [TMetadata], [THeader, Promise<TTrailer>]>;
export function createServiceClient<TMetadata, THeader, TTrailer>(
  rpcClientImpl: RpcClientImpl<TMetadata, THeader, TTrailer>,
  config: CreateServiceClientConfig & { responseOnly?: true },
): Service<[] | [TMetadata], []>;
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
    _rpcClientImpl = wrapRpcClientImpl({ rpcClientImpl, devtoolsConfig, tags });
  }
  return Object.fromEntries(
    Object.entries(methodDescriptors).map(
      ([camelRpcName, methodDescriptor]) => {
        const { requestStream, responseStream } = methodDescriptor;
        const rpcMethodImpl = _rpcClientImpl(
          methodDescriptor as MethodDescriptor<any, any>,
        );
        const rpcMethodHandler = async (request: any, metadata?: any) => {
          const reqAsyncGenerator = requestStream
            ? request
            : fromSingle(request);
          const rpcMethodResult = rpcMethodImpl(reqAsyncGenerator, metadata);
          const resAsyncGenerator = rpcMethodResult[0];
          const headerPromise = rpcMethodResult[1];
          const trailerPromise = rpcMethodResult[2];
          const [header, response] = await Promise.all([
            getHeaderBeforeTrailer(headerPromise, trailerPromise),
            responseStream ? resAsyncGenerator : first(resAsyncGenerator),
          ]);
          return responseOnly ? response : [response, header, trailerPromise];
        };
        return [camelRpcName, rpcMethodHandler];
      },
    ),
  ) as unknown as Service;
}
function getHeaderBeforeTrailer<THeader, TTrailer>(
  headerPromise: Promise<THeader>,
  trailerPromise: Promise<TTrailer>,
): Promise<THeader> {
  return Promise.race([
    headerPromise,
    trailerPromise.then((trailer) => {
      throw new RpcError(trailer);
    }),
  ]);
}
