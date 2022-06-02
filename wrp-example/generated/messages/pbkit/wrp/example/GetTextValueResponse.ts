import {
  jsonValueToTsValueFns,
  tsValueToJsonValueFns,
} from "https:/deno.land/x/pbkit@v0.0.45/core/runtime/json/scalar.ts";
import {
  WireMessage,
} from "https:/deno.land/x/pbkit@v0.0.45/core/runtime/wire/index.ts";
import {
  default as serialize,
} from "https:/deno.land/x/pbkit@v0.0.45/core/runtime/wire/serialize.ts";
import {
  tsValueToWireValueFns,
  wireValueToTsValueFns,
} from "https:/deno.land/x/pbkit@v0.0.45/core/runtime/wire/scalar.ts";
import {
  default as deserialize,
} from "https:/deno.land/x/pbkit@v0.0.45/core/runtime/wire/deserialize.ts";

export declare namespace $.pbkit.wrp.example {
  export interface GetTextValueResponse {
    text: string;
  }
}
export type Type = $.pbkit.wrp.example.GetTextValueResponse;

export function getDefaultValue(): $.pbkit.wrp.example.GetTextValueResponse {
  return {
    text: "",
  };
}

export function createValue(
  partialValue: Partial<$.pbkit.wrp.example.GetTextValueResponse>,
): $.pbkit.wrp.example.GetTextValueResponse {
  return {
    ...getDefaultValue(),
    ...partialValue,
  };
}

export function encodeJson(
  value: $.pbkit.wrp.example.GetTextValueResponse,
): unknown {
  const result: any = {};
  if (value.text !== undefined) {
    result.text = tsValueToJsonValueFns.string(value.text);
  }
  return result;
}

export function decodeJson(
  value: any,
): $.pbkit.wrp.example.GetTextValueResponse {
  const result = getDefaultValue();
  if (value.text !== undefined) {
    result.text = jsonValueToTsValueFns.string(value.text);
  }
  return result;
}

export function encodeBinary(
  value: $.pbkit.wrp.example.GetTextValueResponse,
): Uint8Array {
  const result: WireMessage = [];
  if (value.text !== undefined) {
    const tsValue = value.text;
    result.push(
      [1, tsValueToWireValueFns.string(tsValue)],
    );
  }
  return serialize(result);
}

export function decodeBinary(
  binary: Uint8Array,
): $.pbkit.wrp.example.GetTextValueResponse {
  const result = getDefaultValue();
  const wireMessage = deserialize(binary);
  const wireFields = new Map(wireMessage);
  field: {
    const wireValue = wireFields.get(1);
    if (wireValue === undefined) break field;
    const value = wireValueToTsValueFns.string(wireValue);
    if (value === undefined) break field;
    result.text = value;
  }
  return result;
}
