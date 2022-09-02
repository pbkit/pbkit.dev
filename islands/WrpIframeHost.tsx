/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h, useEffect, useMemo, useState } from "preact";
import { tw } from "@twind";
import { createWrpChannel } from "wrp/channel.ts";
import useWrpIframeSocket from "wrp/react/useWrpIframeSocket.ts";
import { rpc, useWrpServer } from "wrp/react/server.ts";
import { methodDescriptors } from "../wrp-example/generated/services/pbkit/wrp/example/WrpExampleService.ts";

export default function WrpIframeHost() {
  const [isFold, setIsFold] = useState(true);
  const [sliderValue, setSliderValue] = useState(50);
  const [text, setText] = useState("Hello World");
  const { iframeRef, socket } = useWrpIframeSocket();
  const channel = useMemo(() => socket && createWrpChannel(socket), [socket]);
  useWrpServer(
    channel,
    { sliderValue, text },
    rpc(
      methodDescriptors.getSliderValue,
      async function* ({ req, getState, stateChanges }) {
        const { sliderValue: value } = getState();
        yield { value };
        for await (const value of stateChanges.sliderValue) yield { value };
      },
    ),
    rpc(
      methodDescriptors.getTextValue,
      async function ({ req, getState }) {
        const { text } = getState();
        return { text };
      },
    ),
  );
  const styles = {
    main: tw`flex flex-col items-center gap-4 p-4 text-center`,
    button: (color: string) =>
      tw`w-full bg-${color}-400 hover:bg-${color}-500 text-white font-bold py-2 px-4 rounded`,
    label: (color: string) =>
      tw`flex items-center rounded bg-${color}-100 p-4 gap-4`,
  };
  return (
    <>
      <div class={styles.main}>
        <h1 class={tw`text-2xl font-bold`}>WrpExampleServer (Host)</h1>
        <p>
          You can use pbkit{" "}
          <a
            class={tw`text-blue-500 font-bold`}
            href="https://chrome.google.com/webstore/detail/pbkit-devtools/fjacmiijeihblfhobghceofniolonhca"
            target="_blank"
          >
            chrome devtools
          </a>{" "}
          here!
        </p>
        <p class={tw`cursor-pointer`} onClick={() => setIsFold((v) => !v)}>
          Show protobuf schema in this example {isFold ? "▼" : "▲"}
        </p>
        <code
          class={tw`whitespace-pre-wrap p-4 bg-gray-100 text-left ${
            isFold ? `hidden` : ""
          }`}
        >
          {proto}
        </code>
        <div class={tw`flex flex-col gap-4`}>
          <label class={styles.label("blue")}>
            <b>SliderValue</b>
            <input
              type="range"
              class={tw`w-full`}
              value={sliderValue}
              min="0"
              max="100"
              onInput={(e) => setSliderValue(+(e.target as any).value)}
            />
          </label>
          <label class={styles.label("green")}>
            <b>TextValue</b>
            <input
              type="text"
              class={tw`p-1`}
              value={text}
              onInput={(e) => setText((e.target as any).value)}
            />
          </label>
        </div>
        <div>
          <h2 class={tw`text-2xl font-bold my-4`}>iframe</h2>
          <iframe ref={iframeRef} src="/wrp-example-guest" />
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            label > span {
              margin-right: 1em;
            }
            input[type=text] {
              border: 1px solid black;
            }
            iframe {
              width: 500px;
              height: 400px;
              border: 1px solid black;
              resize: both;
            }
          `,
        }}
      />
    </>
  );
}

const proto = `syntax = "proto3";
package pbkit.wrp.example;

service WrpExampleService {
  rpc GetTextValue(GetTextValueRequest) returns (GetTextValueResponse);
  rpc GetSliderValue(GetSliderValueRequest) returns (stream GetSliderValueResponse);
}

message GetTextValueRequest {}
message GetTextValueResponse {
  string text = 1;
}
message GetSliderValueRequest {}
message GetSliderValueResponse {
  int32 value = 1;
}`;
