**pbkit** is a collection of next-generation tools related to protobuf.

It is written in **TypeScript** and uses the **Deno API**.

However, it can be executed in **any JavaScript environment** (including Node.js or
web browser) because it does not use platform APIs inside the `core` directory.


## What is Protobuf?

<https://developers.google.com/protocol-buffers>

> Protocol buffers are Google's language-neutral, platform-neutral, extensible
> mechanism for serializing structured data – think XML, but smaller, faster,
> and simpler.

## What features are provided?

### CLI

- `pb` - Protobuf schema compiler like `protoc`.
  - `protoc` has native binary dependencies, but `pb` command is written in pure
    TypeScript, so it can be used comfortably in Node.js projects, etc., and can
    even easily be run in a web browser.
  - [How to install and how to use](/docs/getting-started/installation)
- `pollapo` - A package manager for the protobuf schema.
  - A GitHub repository of `.proto` files is treated as a single pollapo
    package.
  - [How to install and how to use](/docs/getting-started/installation)

### GUI

  - pbkit-devtools (Chrome Extension)
    - <img width=200 src="https://user-images.githubusercontent.com/690661/152089698-e519047e-c073-473b-a96a-fca295cd7263.jpg" />
    - [Github: pbkit/pbkit-devtools](https://github.com/pbkit/pbkit-devtools)
    - [Chrome web store: pbkit-devtools](https://chrome.google.com/webstore/detail/pbkit-devtools/fjacmiijeihblfhobghceofniolonhca)

### Library

- Deno - [deno.land/x/pbkit](https://deno.land/x/pbkit)
- NPM - [pbkit][npm pbkit]
  - [@pbkit/runtime][@pbkit/runtime] - This is a separate package with only the
    `runtime` folder.
  - See also - <https://github.com/pbkit/npm-packages>
    - RPC related libraries
      - [frpc-client](https://www.npmjs.com/package/@pbkit/frpc-client)
      - [frpc-server](https://www.npmjs.com/package/@pbkit/frpc-server)
      - [grpc-client](https://www.npmjs.com/package/@pbkit/grpc-client)
      - [grpc-web-client](https://www.npmjs.com/package/@pbkit/grpc-web-client)

[npm pbkit]: https://www.npmjs.com/package/pbkit
[@pbkit/runtime]: https://www.npmjs.com/package/@pbkit/runtime

## Who uses pbkit?

### Company

- [Riiid][riiid] - Pbkit was originally created to use protobuf in Riiid.

[riiid]: https://riiid.com/

### Open source project

- [AST explorer][AST explorer] - Used to parse protobuf files
- [AstQL][AstQL] - Used to parse protobuf files

[AST explorer]: https://github.com/fkling/astexplorer
[AstQL]: https://github.com/gen-codes/astql

## License

pbkit is dual-licensed under Apache 2.0 and MIT terms.\
see [LICENSE-APACHE][LICENSE-APACHE] and [LICENSE-MIT][LICENSE-MIT] for details.

[LICENSE-APACHE]: ./LICENSE-APACHE
[LICENSE-MIT]: ./LICENSE-MIT