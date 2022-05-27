import { useEffect, useState } from "../client_deps.ts";
import { Socket } from "https://deno.land/x/wrp@v0.0.3/socket.ts";
import { createAndroidSocket } from "https://deno.land/x/wrp@v0.0.3/glue/android.ts";
import { createIosSocket } from "https://deno.land/x/wrp@v0.0.3/glue/ios.ts";
import { createParentWindowSocket } from "https://deno.land/x/wrp@v0.0.3/glue/parent-window.ts";

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
