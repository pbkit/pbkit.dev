/** @jsx h */
/** @jsxFrag Fragment */
import {
  createEventBuffer,
  EventBuffer,
} from "https://deno.land/x/pbkit@v0.0.45/core/runtime/async/event-buffer.ts";
import { Fragment, h, useEffect, useMemo, useState } from "../client_deps.ts";
import { createWrpChannel, WrpChannel } from "../../wrp-ts/src/channel.ts";
import { Type as WrpMessage } from "../../wrp-ts/src/generated/messages/pbkit/wrp/WrpMessage.ts";
import useWrpParentSocket from "../wrp-example/useWrpParentSocket.ts";
import useWrpServer from "../wrp-example/useWrpServer.ts";
import {
  createServiceClient,
  methodDescriptors,
  Service,
} from "../wrp-example/generated/services/pbkit/wrp/example/WrpExampleService.ts";
import useWrpClientImpl from "../wrp-example/useWrpClientImpl.ts";

export default function WrpExample() {
  const [sliderValue, setSliderValue] = useState(50);
  const [text, setText] = useState("Hello World");
  const { socket } = useWrpParentSocket();
  const channel = useMemo(() => socket && createWrpChannel(socket), [socket]);
  const splitChannelResult = useMemo(
    () => channel && splitChannel(channel),
    [channel]
  );
  const wrpClientImpl = useWrpClientImpl(splitChannelResult?.guestChannel);
  const [serviceClient, setServiceClient] = useState<Service | undefined>(
    undefined
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
        setSliderValue(value);
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
        const off = stateChanges.on("sliderValue", (value) =>
          res.send({ value })
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
  return (
    <div>
      <div>
        <h2>host inputs</h2>
        <label>
          <span>slider</span>
          <input
            type="range"
            value={sliderValue}
            min="0"
            max="100"
            onInput={(e) => setSliderValue(+(e.target as any).value)}
          />
        </label>
        <label>
          <span>text</span>
          <input
            type="text"
            value={text}
            onInput={(e) => setText((e.target as any).value)}
          />
        </label>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            div {
              display: flex;
              flex-direction: column;
              padding: 1em;
            }
            h2 {
              font-size: 2em;
            }
            label > span {
              margin-right: 1em;
            }
            input[type=text] {
              border: 1px solid black;
            }
          `,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <label>
          slider value:
          <span style={{ fontSize: "3em" }}>{sliderValue}</span>
        </label>
        <br />
        <button style={{ border: "1px solid black" }} onClick={onClick}>
          click me!
        </button>
        <button
          style={{ border: "1px solid black" }}
          onClick={() => location.reload()}
        >
          refresh page!
        </button>
      </div>
    </div>
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
