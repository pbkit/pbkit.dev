/** @jsx h */
/** @jsxFrag Fragment */
import { first } from "https://deno.land/x/pbkit@v0.0.45/core/runtime/async/async-generator.ts";
import { Fragment, h, useEffect, useRef, useState } from "../client_deps.ts";
import { createIframeSocket } from "../../wrp-ts/src/glue/iframe.ts";
import { createWrpChannel } from "../../wrp-ts/src/channel.ts";
import { createWrpGuest } from "../../wrp-ts/src/guest.ts";
import { createWrpHost } from "../../wrp-ts/src/host.ts";
import {
  createWrpServer,
  createWrpServerImplBuilder,
} from "../../wrp-ts/src/rpc/server.ts";
import { methodDescriptors } from "../wrp-example/generated/services/pbkit/wrp/example/WrpExampleService.ts";

export function WrpExampleHost() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [sliderValue, setSliderValue] = useState(50);
  const [text, setText] = useState("Hello World");
  useEffect(() => {
    const iframeElement = iframeRef.current!;
    (async () => {
      const socket = await createIframeSocket({
        iframeElement,
        iframeOrigin: "*",
      });
      const channel = createWrpChannel(socket);
      const host = await createWrpHost({
        channel,
        availableMethods: new Set([
          "pbkit.wrp.example/GetTextValue",
          "pbkit.wrp.example/GetSliderValue",
        ]),
      });
      const builder = createWrpServerImplBuilder();
      builder.register(methodDescriptors.getSliderValue, async (_req, res) => {
        res.header({});
        res.send({ value });
        res.end({});
      });
      builder.register(methodDescriptors.getTextValue, async (_req, res) => {
        res.header({});
        res.send({ text });
        res.end({});
      });
      builder.finish();
      const methods = builder.drain();
      const server = await createWrpServer({ host, methods });
      server.listen();
    })();
  }, []);
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

export function WrpExampleGuest() {
  return <>guest</>;
}
