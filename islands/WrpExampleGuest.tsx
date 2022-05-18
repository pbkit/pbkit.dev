/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h, useEffect, useMemo, useState } from "../client_deps.ts";
import { createWrpChannel } from "../../wrp-ts/src/channel.ts";
import useWrpParentSocket from "../wrp-example/useWrpParentSocket.ts";
import useWrpClientImpl from "../wrp-example/useWrpClientImpl.ts";
import {
  createServiceClient,
  Service,
} from "../wrp-example/generated/services/pbkit/wrp/example/WrpExampleService.ts";

export default function WrpExampleGuest() {
  const [sliderValue, setSliderValue] = useState(0);
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
      }
    })();
    return () => void (unmounted = true);
  }, [serviceClient]);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <label>
        slider value:
        <span style={{ fontSize: "3em" }}>{sliderValue}</span>
      </label>
      <br />
      <button style={{ border: "1px solid black" }} onClick={onClick}>
        click me!
      </button>
    </div>
  );
}

function useWrpExampleServiceClient() {
  const { socket } = useWrpParentSocket();
  const channel = useMemo(() => socket && createWrpChannel(socket), [socket]);
  const wrpClientImpl = useWrpClientImpl(channel);
  const [
    serviceClient,
    setServiceClient,
  ] = useState<Service | undefined>(undefined);
  useEffect(() => {
    if (!wrpClientImpl) return;
    setServiceClient(createServiceClient(wrpClientImpl));
  }, [wrpClientImpl]);
  return serviceClient;
}
