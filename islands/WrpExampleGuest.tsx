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
import { createWrpChannel } from "https://deno.land/x/wrp@v0.0.2/channel.ts";
import useWrpParentSocket from "../wrp-example/useWrpParentSocket.ts";
import useWrpClientImpl from "../wrp-example/useWrpClientImpl.ts";
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
      <h1 class={tw`text-2xl font-bold`}>WrpExampleClient (Guest)</h1>
      <p>GetSliderValue is requested on initialized</p>
      <div class={tw`flex flex-col items-center gap-4`}>
        <div class={tw`flex items-center gap-4`}>
          <label class={styles.label("blue")}>
            <b>Slider value</b>
            <p class={tw`text-4xl`}>{sliderValue}</p>
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
  );
}

function useWrpExampleServiceClient() {
  const { socket } = useWrpParentSocket();
  const channel = useMemo(() => socket && createWrpChannel(socket), [socket]);
  const wrpClientImpl = useWrpClientImpl(channel);
  const [serviceClient, setServiceClient] = useState<Service | undefined>(
    undefined
  );
  useEffect(() => {
    if (!wrpClientImpl) return;
    setServiceClient(createServiceClient(wrpClientImpl));
  }, [wrpClientImpl]);
  return serviceClient;
}
