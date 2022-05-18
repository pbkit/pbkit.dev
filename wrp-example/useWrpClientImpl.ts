import type { RpcClientImpl } from "https://deno.land/x/pbkit@v0.0.45/core/runtime/rpc.ts";
import { useEffect, useState } from "../client_deps.ts";
import { WrpChannel } from "../../wrp-ts/src/channel.ts";
import { createWrpGuest } from "../../wrp-ts/src/guest.ts";
import { createWrpClientImpl } from "../../wrp-ts/src/rpc/client.ts";

export default function useWrpClientImpl(
  channel: WrpChannel | undefined,
): ReturnType<typeof createWrpClientImpl> | undefined {
  const [
    clientImpl,
    setClientImpl,
  ] = useState<RpcClientImpl | undefined>(undefined);
  useEffect(() => {
    if (!channel) return;
    createWrpGuest({ channel }).then(
      (guest) => setClientImpl(() => createWrpClientImpl({ guest })),
    );
  }, [channel]);
  return clientImpl;
}