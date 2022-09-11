import { useEffect, useMemo, useState } from "preact/hooks";
import { tw } from "twind";
import { createWrpChannel } from "wrp/channel.ts";
import useWrpParentSocket from "wrp/react/useWrpParentSocket.ts";
import useWrpClientImpl from "wrp/react/useWrpClientImpl.ts";
import {
  createServiceClient,
  Service,
} from "../wrp-example/generated/services/pbkit/wrp/example/WrpExampleService.ts";

export default function WrpExampleGuest() {
  const [sliderValue, setSliderValue] = useState(0);
  const [responseCount, setResponseCount] = useState(0);
  const serviceClient = useWrpExampleServiceClient();
  const onClick = async () => {
    alert((await serviceClient?.getTextValue({}))?.text);
  };
  useEffect(() => {
    if (!serviceClient) return;
    let unmounted = false;
    (async () => {
      for await (const { value } of await serviceClient.getSliderValue({})) {
        if (unmounted) return;
        setSliderValue(value);
        setResponseCount((c) => c + 1);
      }
    })();
    return () => void (unmounted = true);
  }, [serviceClient]);
  const styles = {
    main: tw`flex flex-col items-center gap-4 p-4 text-center`,
    button: (color: string) =>
      tw`w-full bg-${color}-400 hover:bg-${color}-500 text-white font-bold py-2 px-4 rounded`,
    label: (color: string) =>
      tw`flex flex-col items-center rounded bg-${color}-100 p-4`,
  };
  return (
    <div class={styles.main}>
      <h1 class="text-2xl font-bold">WrpExampleClient (Guest)</h1>
      <p>GetSliderValue is requested on initialized</p>
      <div class="flex flex-col items-center gap-4">
        <div class="flex items-center gap-4">
          <label class={styles.label("blue")}>
            <b>Slider value</b>
            <p class="text-4xl">{sliderValue}</p>
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
  );
}

function useWrpExampleServiceClient() {
  const { socket } = useWrpParentSocket();
  const channel = useMemo(() => socket && createWrpChannel(socket), [socket]);
  const wrpClientImpl = useWrpClientImpl(channel);
  const [serviceClient, setServiceClient] = useState<Service | undefined>(
    undefined,
  );
  useEffect(() => {
    if (!wrpClientImpl) return;
    setServiceClient(
      createServiceClient(wrpClientImpl, { devtools: { tags: ["WrpClient"] } }),
    );
  }, [wrpClientImpl]);
  return serviceClient;
}
