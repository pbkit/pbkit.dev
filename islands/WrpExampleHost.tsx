/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h, tw, useMemo, useState } from "../client_deps.ts";
import { createWrpChannel } from "https://deno.land/x/wrp@v0.0.3/channel.ts";
import useWrpParentSocket from "https://deno.land/x/wrp@v0.0.3/react/useWrpParentSocket.ts";
import useWrpServer from "https://deno.land/x/wrp@v0.0.3/react/useWrpServer.ts";
import { methodDescriptors } from "../wrp-example/generated/services/pbkit/wrp/example/WrpExampleService.ts";

export default function WrpExampleHost() {
  const [sliderValue, setSliderValue] = useState(50);
  const [text, setText] = useState("Hello World");
  const { socket } = useWrpParentSocket();
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
  const styles = {
    main: tw`flex flex-col items-center gap-4 p-4 text-center`,
    button: (color: string) =>
      tw`w-full bg-${color}-400 hover:bg-${color}-500 text-white font-bold py-2 px-4 rounded`,
    label: (color: string) =>
      tw`flex flex-col items-center rounded bg-${color}-100 p-4 gap-4`,
  };
  return (
    <>
      <div class={styles.main}>
        <h1 class={tw`text-2xl font-bold`}>WrpExampleServer (Host)</h1>
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
              class={tw`p-2`}
              value={text}
              onInput={(e) => setText((e.target as any).value)}
            />
          </label>
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
