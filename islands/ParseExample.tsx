/** @jsx h */
/** @jsxFrag Fragment */
import { h, tw, useState, useEffect, useCallback } from "../client_deps.ts";

const initialProto = `syntax = "proto3";

message A {
  string name = 1;
  int32 age = 2;
}
`;

export default function ParseExample() {
  const [input, setInput] = useState(initialProto);
  const [output, setOutput] = useState({});
  const getPbkitAst = useCallback(async () => {
    const resp = await fetch("/build", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        proto: input,
      }),
    });
    const proto = await resp.json();
    setOutput(proto);
  }, []);
  useEffect(() => {
    getPbkitAst();
  }, []);
  return (
    <div class={tw`flex flex-col min-h-screen`}>
      <div class={tw`flex flex-1 h-full`}>
        <textarea
          class={tw`flex-1 min-h-full`}
          onChange={(e) => setInput(e.currentTarget.value)}
          value={input}
        />
        <textarea
          class={tw`flex-1 min-h-full`}
          disabled
          value={JSON.stringify(output, null, 2)}
        />
      </div>
      <button type="button" onClick={getPbkitAst}>
        Parse it!
      </button>
    </div>
  );
}
