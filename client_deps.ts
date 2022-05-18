import { IS_BROWSER } from "https://raw.githubusercontent.com/lucacasonato/fresh/2a2b948a58427e49b68c131b3072196e92e77d6f/runtime.ts";
export * from "https://raw.githubusercontent.com/lucacasonato/fresh/2a2b948a58427e49b68c131b3072196e92e77d6f/runtime.ts";
import { apply, setup, tw } from "https://esm.sh/twind@0.16.16";
export { apply, setup, tw };
if (IS_BROWSER) {
  setup({});
}
