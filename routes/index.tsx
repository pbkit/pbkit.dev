/** @jsx h */
/** @jsxFrag Fragment */

import { Fragment, h } from "preact";
import { Head } from "$fresh/runtime.ts";
import { tw } from "@twind";
import NavigationBar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";

export default function MainPage() {
  return (
    <>
      <Head>
        <title>pbkit</title>
        <meta
          name="description"
          content="Protobuf toolkit for modern Web development"
        />
      </Head>
      <NavigationBar active="/" />
      <div class={tw`bg(gray-50)`}>
        <Hero />
        <Intro />
        <GettingStarted />
        <Example />
      </div>
      <Footer />
    </>
  );
}

function Hero() {
  const container = tw`max-w-screen-lg mx-auto w-full h(48 sm:64) flex items-center tracking-tight`;
  const title = tw`text(4xl sm:5xl lg:6xl gray-900) font-extrabold`;
  const subtitle = tw`mt-4 text(xl sm:2xl gray-800) `;

  return (
    <section class={container}>
      <div class={tw`ml(4 md:8)`}>
        <h1 class={title}>pbkit</h1>
        <p class={subtitle}>Protobuf toolkit for modern web development</p>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section
      class={tw`max-w-screen-lg mx-auto mb-16 px(4 sm:6 md:8) space-y-4 tracking-tight`}
    >
      <p class={tw`text(xl gray-800)`}>
        <b>pbkit</b> is a collection of tools for modern web development with
        protocol buffers.
      </p>
      <div class={tw`grid sm:grid-cols-2 gap-4`}>
        <a
          href="/docs/introduction"
          class={tw`bg(white) shadow-lg hover:shadow-2xl active:shadow-xl transition-shadow p-4 rounded-md relative overflow-hidden`}
        >
          <h1 class={tw`text(2xl) font-bold`}>pb - Protobuf compiler</h1>
          <p class={tw`mt-4`}>
            No native binary dependencies, written in pure TypeScript. Available
            in Node.js and even in a web browser.
          </p>
          <span class={tw`absolute text(9xl) -bottom-4 right-2 opacity-20`}>
            🤖
          </span>
        </a>
        <a
          href="/docs/introduction"
          class={tw`bg(white) shadow-lg hover:shadow-2xl active:shadow-xl transition-shadow p-4 rounded-md relative overflow-hidden`}
        >
          <h1 class={tw`text(2xl) font-bold`}>pollapo - Package manager</h1>
          <p class={tw`mt-4`}>
            You can use a GitHub repository containing your .proto files as a
            single pollapo package.
          </p>
          <span class={tw`absolute text(9xl) -bottom-4 right-2 opacity-20`}>
            📦
          </span>
        </a>
        <a
          href="/docs/wrp"
          class={tw`bg(white) shadow-lg hover:shadow-2xl active:shadow-xl transition-shadow p-4 rounded-md relative overflow-hidden`}
        >
          <h1 class={tw`text(2xl) font-bold`}>
            wrp - RPC protocol for WebView
          </h1>
          <h2 class={tw`text(lg)`}>Webview/worker Request Protocol</h2>
          <p class={tw`mt-4`}>
            Transport messages between Native and WebView using your protobuf
            schema! Supports TypeScript(Web), Kotlin(Android), Swift(iOS).
          </p>
          <span class={tw`absolute text(9xl) -bottom-4 right-2 opacity-20`}>
            🌯
          </span>
        </a>
        <a
          target="_blank"
          href="https://marketplace.visualstudio.com/items?itemName=pbkit.vscode-pbkit"
          class={tw`bg(white) shadow-lg hover:shadow-2xl active:shadow-xl transition-shadow p-4 rounded-md relative overflow-hidden`}
        >
          <h1 class={tw`text(2xl) font-bold`}>Editor extension</h1>
          <h2 class={tw`text(lg)`}>VSCode extension with language server</h2>
          <p class={tw`mt-4`}>
            Syntax highlight, Goto definition, Find references and more.
          </p>
          <span class={tw`absolute text(9xl) -bottom-4 right-2 opacity-20`}>
            📝
          </span>
        </a>
        <a
          target="_blank"
          href="https://chrome.google.com/webstore/detail/pbkit-devtools/fjacmiijeihblfhobghceofniolonhca"
          class={tw`bg(white) shadow-lg hover:shadow-2xl active:shadow-xl transition-shadow p-4 rounded-md  relative overflow-hidden`}
        >
          <h1 class={tw`text(2xl) font-bold`}>Chrome DevTools</h1>
          <h2 class={tw`text(lg)`}>Chrome DevTools for pbkit</h2>
          <p class={tw`mt-4`}>
            Compatible with any rpc client you use with pbkit.
          </p>
          <span class={tw`absolute text(9xl) -bottom-4 right-2 opacity-20`}>
            🌏
          </span>
        </a>
        <div
          class={tw`text(xl) flex items-center justify-center font-semibold`}
        >
          And more... 🚀
        </div>
      </div>
    </section>
  );
}

function GettingStarted() {
  return (
    <section
      class={tw`max-w-screen-lg mx-auto my-16 px(4 sm:6 md:8) space-y-4`}
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
      <pre class={tw`overflow-x-auto py-2 px-4 bg(gray-100)`}>pb gen ts</pre>
      <p class={tw`text-gray-800`}>
        A more in-depth getting started guide is available in{" "}
        <a href="/docs" class={tw`text-blue-600 hover:underline`}>
          the docs
        </a>
        .
      </p>
    </section>
  );
}

function Example() {
  return (
    <>
      <section
        class={tw`max-w-screen-lg mx-auto my-16 px(4 sm:6 md:8) space-y-4`}
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
        class={tw`max-w-screen-lg mx-auto my-16 px(4 sm:6 md:8) space-y-4`}
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
        class={tw`max-w-screen-lg mx-auto my-16 px(4 sm:6 md:8) space-y-4`}
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
      <div class={tw`h-1`} />
    </>
  );
}
