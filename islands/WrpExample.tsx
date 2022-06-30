/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h, useEffect, useMemo, useState } from "preact";
import { tw } from "@twind";
import {
  createEventBuffer,
  EventBuffer,
} from "https://deno.land/x/pbkit@v0.0.45/core/runtime/async/event-buffer.ts";
import {
  createWrpChannel,
  WrpChannel,
} from "https://deno.land/x/wrp@v0.0.5/channel.ts";
import { Type as WrpMessage } from "https://deno.land/x/wrp@v0.0.5/generated/messages/pbkit/wrp/WrpMessage.ts";
import useWrpParentSocket from "https://deno.land/x/wrp@v0.0.5/react/useWrpParentSocket.ts";
import useWrpServer from "https://deno.land/x/wrp@v0.0.5/react/useWrpServer.ts";
import {
  createServiceClient,
  methodDescriptors,
  Service,
} from "../wrp-example/generated/services/pbkit/wrp/example/WrpExampleService.ts";
import useWrpClientImpl from "https://deno.land/x/wrp@v0.0.5/react/useWrpClientImpl.ts";

export default function WrpExample() {
  const [sliderValue, setSliderValue] = useState(50);
  const [recvSliderValue, setRecvSliderValue] = useState(50);
  const [responseCount, setResponseCount] = useState(0);
  const [text, setText] = useState("Hello World");
  const { socket } = useWrpParentSocket();
  const channel = useMemo(() => socket && createWrpChannel(socket), [socket]);
  const splitChannelResult = useMemo(
    () => channel && splitChannel(channel),
    [channel],
  );
  const wrpClientImpl = useWrpClientImpl(splitChannelResult?.guestChannel);
  const [serviceClient, setServiceClient] = useState<Service | undefined>(
    undefined,
  );
  useEffect(() => {
    if (!wrpClientImpl) return;
    setServiceClient(createServiceClient(wrpClientImpl));
  }, [wrpClientImpl]);
  useEffect(() => {
    if (!serviceClient) return;
    let unmounted = false;
    (async () => {
      for await (const { value } of await serviceClient.getSliderValue({})) {
        if (unmounted) return;
        setRecvSliderValue(value);
        setResponseCount((c) => c + 1);
      }
    })();
    return () => void (unmounted = true);
  }, [serviceClient]);
  const onClick = async () => {
    alert((await serviceClient?.getTextValue({}))?.text);
  };
  useWrpServer(splitChannelResult?.hostChannel, { sliderValue, text }, [
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
  const styles = {
    main: tw`flex flex-col items-center gap-2 p-2 text-center`,
    button: (color: string) =>
      tw`w-full bg-${color}-400 hover:bg-${color}-500 text-white font-bold py-2 px-4 rounded`,
    label: (color: string) =>
      tw`w-full flex items-center rounded bg-${color}-100 p-2 gap-2`,
  };
  return (
    <>
      <div class={styles.main}>
        <h1 class={tw`text-xl font-bold`}>WrpExampleServer (Host)</h1>
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
      </div>
      <div class={styles.main}>
        <h1 class={tw`text-xl font-bold`}>WrpExampleClient (Guest)</h1>
        <p>GetSliderValue is requested on initialized</p>
        <div class={tw`flex flex-col items-center gap-2`}>
          <div class={tw`flex items-center gap-2`}>
            <label class={styles.label("blue")}>
              <b>Slider value</b>
              <p class={tw`text-4xl`}>{recvSliderValue}</p>
            </label>
            <label class={styles.label("red")}>
              <b># of responses (GetSliderValue)</b>
              <p class={tw`text-4xl`}>{responseCount}</p>
            </label>
          </div>
          <div class={tw`w-full flex-1 flex flex-col items-center gap-2`}>
            <button class={styles.button("blue")} onClick={onClick}>
              Get TextValue from Server
            </button>
            <button
              class={styles.button("orange")}
              onClick={() => location.reload()}
            >
              Refresh page to reset
            </button>
          </div>
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
      `,
        }}
      />
    </>
  );
}

interface SplitChannelResult {
  guestChannel: WrpChannel;
  hostChannel: WrpChannel;
}
function splitChannel(channel: WrpChannel): SplitChannelResult {
  const guestBuffer = createEventBuffer<WrpMessage>();
  const hostBuffer = createEventBuffer<WrpMessage>();
  (async () => {
    for await (const message of channel.listen()) {
      const field = message.message?.field!;
      if (field.startsWith("Guest")) {
        hostBuffer.push(message);
      } else if (field.startsWith("Host")) {
        guestBuffer.push(message);
      }
    }
    guestBuffer.finish();
    hostBuffer.finish();
  })();
  return {
    guestChannel: {
      listen: guestBuffer.drain,
      send: channel.send,
    },
    hostChannel: {
      listen: hostBuffer.drain,
      send: channel.send,
    },
  };
}
