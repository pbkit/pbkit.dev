import { useEffect, useMemo, useState } from "preact/hooks";
import { tw } from "twind";
import { createEventBuffer } from "pbkit/core/runtime/async/event-buffer.ts";
import { createWrpChannel, WrpChannel } from "wrp/channel.ts";
import { Type as WrpMessage } from "wrp/generated/messages/pbkit/wrp/WrpMessage.ts";
import useWrpParentSocket from "wrp/react/useWrpParentSocket.ts";
import { rpc, useWrpServer } from "wrp/react/server.ts";
import {
  createServiceClient,
  methodDescriptors,
  Service,
} from "../wrp-example/generated/services/pbkit/wrp/example/WrpExampleService.ts";
import useWrpClientImpl from "wrp/react/useWrpClientImpl.ts";

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
  useWrpServer(
    splitChannelResult?.hostChannel,
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
    main: tw`flex flex-col items-center gap-2 p-2 text-center`,
    button: (color: string) =>
      tw`w-full bg-${color}-400 hover:bg-${color}-500 text-white font-bold py-2 px-4 rounded`,
    label: (color: string) =>
      tw`w-full flex items-center rounded bg-${color}-100 p-2 gap-2`,
  };
  return (
    <>
      <div class={styles.main}>
        <h1 class="text-xl font-bold">WrpExampleServer (Host)</h1>
        <div class="flex flex-col gap-4">
          <label class={styles.label("blue")}>
            <b>SliderValue</b>
            <input
              type="range"
              class="w-full"
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
              class="p-1"
              value={text}
              onInput={(e) => setText((e.target as any).value)}
            />
          </label>
        </div>
      </div>
      <div class={styles.main}>
        <h1 class="text-xl font-bold">WrpExampleClient (Guest)</h1>
        <p>GetSliderValue is requested on initialized</p>
        <div class="flex flex-col items-center gap-2">
          <div class="flex items-center gap-2">
            <label class={styles.label("blue")}>
              <b>Slider value</b>
              <p class="text-4xl">{recvSliderValue}</p>
            </label>
            <label class={styles.label("red")}>
              <b># of responses (GetSliderValue)</b>
              <p class="text-4xl">{responseCount}</p>
            </label>
          </div>
          <div class="w-full flex-1 flex flex-col items-center gap-2">
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
