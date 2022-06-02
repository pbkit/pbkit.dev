import {
  WireMessage,
} from "https:/deno.land/x/pbkit@v0.0.45/core/runtime/wire/index.ts";
import {
  default as serialize,
} from "https:/deno.land/x/pbkit@v0.0.45/core/runtime/wire/serialize.ts";
import {
  default as deserialize,
} from "https:/deno.land/x/pbkit@v0.0.45/core/runtime/wire/deserialize.ts";

export declare namespace $.pbkit.wrp.example {
  export interface GetSliderValueRequest {}
}
export type Type = $.pbkit.wrp.example.GetSliderValueRequest;

export function getDefaultValue(): $.pbkit.wrp.example.GetSliderValueRequest {
  return {};
}

export function createValue(
  partialValue: Partial<$.pbkit.wrp.example.GetSliderValueRequest>,
): $.pbkit.wrp.example.GetSliderValueRequest {
  return {
    ...getDefaultValue(),
    ...partialValue,
  };
}

export function encodeJson(
  value: $.pbkit.wrp.example.GetSliderValueRequest,
): unknown {
  const result: any = {};
  return result;
}

export function decodeJson(
  value: any,
): $.pbkit.wrp.example.GetSliderValueRequest {
  const result = getDefaultValue();
  return result;
}

export function encodeBinary(
  value: $.pbkit.wrp.example.GetSliderValueRequest,
): Uint8Array {
  const result: WireMessage = [];
  return serialize(result);
}

export function decodeBinary(
  binary: Uint8Array,
): $.pbkit.wrp.example.GetSliderValueRequest {
  const result = getDefaultValue();
  const wireMessage = deserialize(binary);
  const wireFields = new Map(wireMessage);
  return result;
}
