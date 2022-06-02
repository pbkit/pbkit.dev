WRP, Webview/worker Request Protocol, is specially designed protocol for
communicating between native and webview.

WRP provides these advantages.

- Ready-to-use, platform-dependent implementations (TypeScript, Swift, Kotlin)
- Predefine your rpcs and messages to use with protocol buffers.
- Supports all 4 rpc call types (Unary, Server Streaming, Client Streaming,
  Bidirectional Streaming)

Here is a running example (implemented between parent and iframe window):
[iframe example](https://pbkit.dev/wrp-iframe-host)

## ⚠️ Currently in beta

We have a plan to make stable release of implementations for using WRP in
production-level apps until the end of June. The protocol specification,
implementation of WRP may be changed drastically.
