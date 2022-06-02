import { IS_BROWSER } from "https://raw.githubusercontent.com/lucacasonato/fresh/80598d07fd4eed735ea7ee3eb9728d7f5c9b3aa4/runtime.ts";
export * from "https://raw.githubusercontent.com/lucacasonato/fresh/80598d07fd4eed735ea7ee3eb9728d7f5c9b3aa4/runtime.ts";
import { apply, setup, tw } from "https://esm.sh/twind@0.16.16";
import * as colors from "https://esm.sh/twind@0.16.16/colors";
export { apply, colors, setup, tw };
if (IS_BROWSER) {
  setup({ theme: { colors } });
}
