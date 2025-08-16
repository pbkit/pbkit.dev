import { Handlers, PageProps } from "$fresh/server.ts";
import { apply, tw } from "twind";
import { gfm } from "@markdown";
import DocsSidebar from "../../components/DocsSidebar.tsx";
import Footer from "../../components/Footer.tsx";
import NavigationBar from "../../components/Navbar.tsx";
import {
  SLUGS,
  TABLE_OF_CONTENTS,
  TableOfContentsEntry,
} from "../../data/docs.ts";

interface Data {
  page: Page;
}

interface Page extends TableOfContentsEntry {
  markdown: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const slug = ctx.params.slug;
    if (slug === "") {
      return new Response("", {
        status: 307,
        headers: { location: "/docs/introduction" },
      });
    }
    const entry = TABLE_OF_CONTENTS[slug];
    if (!entry) {
      return new Response("404 Page not found", {
        status: 404,
      });
    }
    const url = new URL(`../../${entry.file}`, import.meta.url);
    const markdown = await Deno.readTextFile(url);
    const page = { ...entry, markdown };
    const resp = ctx.render({ page });
    return resp;
  },
};

export default function DocsPage(props: PageProps<Data>) {
  return (
    <>
      <head>
        <title>{props.data.page?.title ?? "Not Found"} | pbkit docs</title>
        <link rel="stylesheet" href="/gfm.css" />
      </head>
      <NavigationBar active="/docs" />
      <Main path={props.url.pathname} page={props.data.page} />
      <Footer />
    </>
  );
}

function Main(props: { path: string; page: Page }) {
  const main = tw`relative mx-auto max-w-screen-lg px-4`;
  return (
    <>
      <MobileSidebar path={props.path} />
      <div class={main}>
        <MobileSidebarIcon />
        <div class="w-full flex gap-6">
          <DesktopSidebar path={props.path} />
          <Content page={props.page} />
        </div>
      </div>
    </>
  );
}

function MobileSidebarIcon() {
  return (
    <div class="md:hidden w-min ml-auto p-2 mt-4 rounded-full sticky top-4 right-0 bg-gray-100">
      <label for="docs_sidebar">
        <svg
          class="h-6 w-6"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h7"
          >
          </path>
        </svg>
      </label>
    </div>
  );
}

function MobileSidebar(props: { path: string }) {
  const container = tw`fixed inset-0 flex z-40 hidden` + " toggled";
  const backdrop = tw`absolute inset-0 bg-gray-800 opacity-75`;
  const sidebar =
    tw`relative flex-1 flex flex-col w-[16rem] h-full bg-white border(r-2 gray-100)`;
  const items = tw`pt-2 pb-16 px-4 overflow-x-auto`;
  return (
    <>
      <input
        type="checkbox"
        class={tw`hidden` + " toggle"}
        id="docs_sidebar"
        autocomplete="off"
      >
      </input>
      <div class={container}>
        <label class={backdrop} for="docs_sidebar" />
        <div class={sidebar}>
          <nav class={items}>
            <DocsSidebar path={props.path} />
          </nav>
        </div>
      </div>
    </>
  );
}

function DesktopSidebar(props: { path: string }) {
  return (
    <nav class="w-[16rem] flex-shrink-0 hidden md:block py-8 pr-4 border(r-2 gray-100)">
      <DocsSidebar path={props.path} />
    </nav>
  );
}

function Content(props: { page: Page }) {
  const main = tw`py-8 pt-4 overflow-hidden w-full`;
  const title = tw`text(4xl gray-900) tracking-tight font-extrabold md:mt-6`;
  const body = tw`mt-6`;
  const html = gfm.render(props.page.markdown);
  return (
    <main class={main}>
      <h1 class={title}>{props.page.title}</h1>
      <div
        class={`${body} markdown-body`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <ForwardBackButtons slug={props.page.slug} />
    </main>
  );
}

const button = apply`p-2 bg-gray-100 w-full border(1 gray-200) grid`;

function ForwardBackButtons(props: { slug: string }) {
  const currentIndex = SLUGS.findIndex((slug) => slug === props.slug);
  const previousSlug = SLUGS[currentIndex - 1];
  const nextSlug = SLUGS[currentIndex + 1];
  const previous = TABLE_OF_CONTENTS[previousSlug];
  const next = TABLE_OF_CONTENTS[nextSlug];

  const upper = tw`text(sm gray-800)`;
  const category = tw`font-normal`;
  const lower = tw`text-gray-900 font-medium`;

  return (
    <div class="mt-8 flex flex(col md:row) gap-4">
      {previous && (
        <a href={previous.href} class={tw`${button} text-left`}>
          <span class={upper}>{"←"} Previous</span>
          <span class={lower}>
            <span class={category}>
              {previous.category
                ? `${TABLE_OF_CONTENTS[previous.category].title}: `
                : ""}
            </span>
            {previous.title}
          </span>
        </a>
      )}
      {next && (
        <a href={next.href} class={tw`${button} text-right`}>
          <span class={upper}>Next {"→"}</span>
          <span class={lower}>
            <span class={category}>
              {next.category
                ? `${TABLE_OF_CONTENTS[next.category].title}: `
                : ""}
            </span>
            {next.title}
          </span>
        </a>
      )}
    </div>
  );
}
