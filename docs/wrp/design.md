<img
  width="500"
  alt="architecture diagram"
  src="https://kroki.io/pikchr/svg/eNq9kj9vwjAQxXd_ipMnUIsFVCwwdqCdOrRbYTDJQawGO7INycfvOf6jtN27RPa9F9_vnr1vb7iFTwbwgYPfAr9QgdP21bgtnMwAXBnHd3A1d4RNN5A0VqWurVE13-WCOlt5RQ698g0IDdIHO5ywNX04Tbi_h3TSovYceK90bfrQ1xMGcCEE-oqzIwu-A9V7VdO5e6ITcfkAq2UXtQbVpfFRTOuJKpNSUSu0jD03Umts49TvpvpCH9cAvIoaH3cjohsNoXBM1IdRjBDx90L0lHsWpmQoVBOHLGoiOxZUBwuYLR9htSb7nLFWaYSzNdefMiU5B8pNk7EbdixmF24QOmvuqkYHmV9aS_fgDaTxReqtGdvf0Pm3u6RIDH0ncWdvSXz9K_JsKPNtsiE-gzhZmCs5yTJbhBAifUYOBHwcP7OIPljXo3NJEbyYf2WMiIsJY2MSYiYRGK6hEH4DBOwAoA==">

- _Glue_ - Platform-specific code to implement sockets
- _Socket_ - Way for sending and receiving data between the two platforms
- _Channel_ - An interface that allows information to be exchanged in units of
  messages using sockets.
- _Guest_ - An interface that can send requests to hosts using channels.
- _Host_ - An interface that allows you to process and respond to requests
  received from guests.

<img
  alt="wrp channel packet diagram"
  src="https://kroki.io/packetdiag/svg/eNorSEzOTi1JyUxMV6jmUlBIzs8pz0wpyVCwVTA2sAYK5OWnpMZnpGamZ5QAxSzAYga6xlYKSr6pxcWJ6amGMXnBmVWpMXkaqXrpegqmmkogJSa6FihKAhIrc_ITU5SAUpa6hkYIOSNU7YYGEP2GxrpGyKoUkAwwAspZWino6elx1XIBAC0FNYs=">

Whenever the channel sends a message, it writes the message size as a 4-byte
little-endian integer to the socket, and then writes a message payload as that
size.

The message payload is defined in the
[wrp-ts/wrp.proto](https://github.com/pbkit/wrp-ts/blob/main/src/wrp.proto)
file.

<img
  alt="wrp transport sequential diagram"
  src="https://kroki.io/mermaid/svg/eNp1j7EOgjAQhnee4nblBRycjNTFGBmcT7jIJbWtvUKiT-8BJhDFpU37ff3_q9CjJVfRjvEW8Z4BBIyJKw7oEhhAgUsMxkv6QsUHFS0NzOTbbbGB3jw4ToyWX6T3R58IfEcRzBpUKMnVgB2yxasluFNqfC0qWu-DbgCFJq3MBobkMz3KpLUDMflUciaZgA4Gsf-JjOdZ2pio72aJJ3xaj_WH60DZsrdnx9Jkc2lskuCd0FLV14j_mgYtn7yfJl3fJId4Cg==">
