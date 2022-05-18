/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h, useEffect, useMemo, useState } from "../client_deps.ts";
import { createWrpChannel } from "../../wrp-ts/src/channel.ts";
import useWrpIframeSocket from "../wrp-example/useWrpIframeSocket.ts";
import useWrpServer from "../wrp-example/useWrpServer.ts";
import { methodDescriptors } from "../wrp-example/generated/services/pbkit/wrp/example/WrpExampleService.ts";

export default function WrpExampleHost() {
  const [sliderValue, setSliderValue] = useState(50);
  const [text, setText] = useState("Hello World");
  const { iframeRef, socket } = useWrpIframeSocket();
  const channel = useMemo(() => socket && createWrpChannel(socket), [socket]);
  useWrpServer(channel, { sliderValue, text }, [
    [methodDescriptors.getSliderValue, ({ res, getState, stateChanges }) => {
      res.header({});
      const value = getState().sliderValue;
      res.send({ value });
      stateChanges.on("sliderValue", (value) => res.send({ value }));
      res.end({});
    }],
    [methodDescriptors.getTextValue, ({ res, getState }) => {
      const { text } = getState();
      res.header({});
      res.send({ text });
      res.end({});
    }],
  ]);
  return (
    <>
      <input
        type="range"
        value={sliderValue}
        min="0"
        max="100"
        onChange={(e) => setSliderValue(+(e.target as any).value)}
      />
      <br />
      <input
        type="text"
        value={text}
        onChange={(e) => setText((e.target as any).value)}
      />
      <iframe ref={iframeRef} src="/wrp-example-guest" />
    </>
  );
}
