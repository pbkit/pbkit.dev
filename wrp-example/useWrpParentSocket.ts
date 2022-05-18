import { useEffect, useState } from "../client_deps.ts";
import { Socket } from "../../wrp-ts/src/socket.ts";
import { createAndroidSocket } from "../../wrp-ts/src/glue/android.ts";
import { createIosSocket } from "../../wrp-ts/src/glue/ios.ts";
import { createParentWindowSocket } from "../../wrp-ts/src/glue/parent-window.ts";

export interface UseWrpParentSocketResult {
  socket: Socket | undefined;
  error: Error | undefined;
}
export default function useWrpParentSocket(): UseWrpParentSocketResult {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  useEffect(() => {
    Promise.any([
      createAndroidSocket(),
      createIosSocket(),
      createParentWindowSocket({ parentWindowOrigin: "*" }),
    ]).then(setSocket).catch(setError);
  }, []);
  return { socket, error };
}
