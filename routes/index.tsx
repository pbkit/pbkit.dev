/** @jsx h */
/** @jsxFrag Fragment */

import { Fragment, h, Head, tw } from "../client_deps.ts";
import NavigationBar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";

export default function MainPage() {
  return (
    <>
      <Head>
        <title>pbkit</title>
        <meta
          name="description"
          content="The next-generation protobuf toolkit."
        />
      </Head>
      <NavigationBar active="/" />
      <Hero />
      <Intro />
      <GettingStarted />
      <Example />
      <Footer />
    </>
  );
}

function Hero() {
  const container = tw`w-full px-4 h-64 flex justify-center items-center flex`;
  const title = tw
    `text(4xl sm:5xl lg:6xl gray-900) sm:tracking-tight font-extrabold`;
  const subtitle = tw`mt-4 text(2xl gray-800)`;

  return (
    <section class={container}>
      <img src="/pbkit.svg" width="100" class={tw`my-8`} />
      <div class={tw`ml(4 md:8)`}>
        <h1 class={title}>
          pbkit
        </h1>
        <p class={subtitle}>
          The next-generation protobuf toolkit.
        </p>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section
      class={tw`max-w-screen-sm mx-auto mb-16 px(4 sm:6 md:8) space-y-4`}
    >
      <p class={tw`text-gray-800`}>
        <b>pbkit</b>{" "}
        is a collection of tools related to protobuf. It is written in
        TypeScript and uses the Deno API. And It can be executed in any
        JavaScript environment (including Node.js or web browser). Some stand
        out features:
      </p>
      <ul class={tw`text-gray-800 list-disc list-inside pl-4`}>
        <li>
          <b>Package manager</b> for protocol buffers, pollapo.
        </li>
        <li>
          <b>Protobuf schema compiler</b> like protoc, pb.
        </li>
        <li>
          <b>Chrome DevTools</b>: pbkit-devtools.
        </li>
        <li>
          <b>VSCode extension with protobuf language server</b>: vscode-pbkit.
        </li>
      </ul>
    </section>
  );
}

function GettingStarted() {
  return (
    <section
      class={tw`max-w-screen-sm mx-auto my-16 px(4 sm:6 md:8) space-y-4`}
    >
      <h2 id="getting-started" class={tw`text(xl gray-800) font-bold`}>
        <a href="#getting-started" class={tw`hover:underline`}>
          Getting started
        </a>
      </h2>
      <p class={tw`text-gray-800`}>
        To get started, make sure you have the{" "}
        <a href="https://deno.land" class={tw`text-blue-600 hover:underline`}>
          Deno CLI
        </a>{" "}
        installed.
      </p>
      <p class={tw`text-gray-800`}>
        Then, run the following command to install both `pb` and `pollapo` cli:
      </p>
      <pre class={tw`overflow-x-auto py-2 px-4 bg(gray-100)`}>
        brew install pbkit/tap/pbkit
      </pre>
      <p class={tw`text-gray-800`}>
        Once installed, you can use the `pollapo` command to install your
        protobuf schema package.
      </p>
      <pre class={tw`overflow-x-auto py-2 px-4 bg(gray-100)`}>
        pollapo install
      </pre>
      <p class={tw`text-gray-800`}>
        Now you can generate en/decode typescript code from your protobuf
        schema.
      </p>
      <pre class={tw`overflow-x-auto py-2 px-4 bg(gray-100)`}>
        pb gen ts
      </pre>
      <p class={tw`text-gray-800`}>
        A more in-depth getting started guide is available in{" "}
        <a href="/docs" class={tw`text-blue-600 hover:underline`}>the docs</a>.
      </p>
    </section>
  );
}

function Example() {
  return (
    <>
      <section
        class={tw`max-w-screen-sm mx-auto my-16 px(4 sm:6 md:8) space-y-4`}
      >
        <h2 id="getting-started" class={tw`text(xl gray-800) font-bold`}>
          <a href="#getting-started" class={tw`hover:underline`}>
            What is Protocol Buffers?
          </a>
        </h2>
        <p class={tw`text-gray-800`}>
          Protocol buffers are Google's language-neutral, platform-neutral,
          extensible mechanism for serializing structured data – think XML, but
          smaller, faster, and simpler.
        </p>
      </section>
      <section
        class={tw`max-w-screen-sm mx-auto my-16 px(4 sm:6 md:8) space-y-4`}
      >
        <h2 id="example" class={tw`text(xl gray-800) font-bold`}>
          <a href="#example" class={tw`hover:underline`}>
            Community
          </a>
        </h2>
        <p class={tw`text-gray-800`}>
          If you want to contribute or get in trouble, feel free to join our
          discord!
        </p>
      </section>
      <section
        class={tw`max-w-screen-sm mx-auto my-16 px(4 sm:6 md:8) space-y-4`}
      >
        <h2 id="example" class={tw`text(xl gray-800) font-bold`}>
          <a href="#example" class={tw`hover:underline`}>
            Misc
          </a>
        </h2>
        <p class={tw`text-gray-800`}>
          The pbkit docs is also written in Deno and deployed with Deno deploy.
        </p>
      </section>
    </>
  );
}
