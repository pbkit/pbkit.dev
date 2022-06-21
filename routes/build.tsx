/** @jsx h */
import { h } from "../client_deps.ts";
import { Handlers } from "../server_deps.ts";
import { parse } from "https://deno.land/x/pbkit@v0.0.46/core/parser/proto.ts";
import ParseExample from "../islands/ParseExample.tsx";

interface ProtoBody {
  proto: string;
}

export const handler: Handlers = {
  async POST(req, ctx) {
    const { proto }: ProtoBody = await req.json();
    const parseResult = parse(proto);
    return new Response(JSON.stringify(parseResult.ast), { status: 200 });
  },
};

export default function Page() {
  return <ParseExample />;
}
