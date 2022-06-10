/** @jsx h */
/** @jsxFrag Fragment */
import {
  Fragment,
  h,
  tw,
  useEffect,
  useMemo,
  useState,
} from "../client_deps.ts";
import { createWrpChannel } from "https://deno.land/x/wrp@v0.0.5/channel.ts";
import useWrpIframeSocket from "https://deno.land/x/wrp@v0.0.5/react/useWrpIframeSocket.ts";
import useWrpServer from "https://deno.land/x/wrp@v0.0.5/react/useWrpServer.ts";
import { methodDescriptors } from "../wrp-example/generated/services/pbkit/wrp/example/WrpExampleService.ts";

export default function WrpIframeHost() {
  const [isFold, setIsFold] = useState(true);
  const [sliderValue, setSliderValue] = useState(50);
  const [text, setText] = useState("Hello World");
  const { iframeRef, socket } = useWrpIframeSocket();
  const channel = useMemo(() => socket && createWrpChannel(socket), [socket]);
  useWrpServer(channel, { sliderValue, text }, [
    [
      methodDescriptors.getSliderValue,
      ({ req, res, getState, stateChanges }) => {
        res.header({});
        const value = getState().sliderValue;
        res.send({ value });
        const off = stateChanges.on(
          "sliderValue",
          (value) => res.send({ value }),
        );
        req.metadata?.on("cancel-response", teardown);
        req.metadata?.on("close", teardown);
        function teardown() {
          off();
          res.end({});
        }
      },
    ],
    [
      methodDescriptors.getTextValue,
      ({ res, getState }) => {
        const { text } = getState();
        res.header({});
        res.send({ text });
        res.end({});
      },
    ],
  ]);
  useEffect(() => {
    // @ts-ignore
    // hooking code for getting event from iframe's devtools
    window["@pbkit/devtools"] = window.frames[0]["@pbkit/devtools"];
  }, []);
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
          {`syntax = "proto3";
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
}`}
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
