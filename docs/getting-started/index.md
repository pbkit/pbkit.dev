In this section, you can get how to install protobuf packages with `pollapo` cli
and generate typescript code with `pb` cli.

Then we will use simple protobuf interface,
[`pbkit/interface-pingpong-server`](https://github.com/pbkit/interface-pingpong-server)
to show how to install and generate codes.

Server and client implementation example is here. you can run it locally and
test it yourself.

- [pbkit/pingpong-server](https://github.com/pbkit/pingpong-server): pingpong
  server written in Go.
- [pbkit/pingpong-client](https://github.com/pbkit/pingpong-client): pingpong
  client written in Typescript + Preact.

Before running it locally, make sure the server port and client config is set
correctly. If you changed port or something else, you have to change
counterpart's code because the config is hard-coded.
