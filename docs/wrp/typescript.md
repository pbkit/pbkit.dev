
### Types

```typescript
// Glue implementation provides socket object.
type Socket = Reader & Writer;
interface Reader {
  read(p: Uint8Array): Promise<number | null>;
}
interface Writer {
  write(p: Uint8Array): Promise<number>;
}

// Channel provides a per-message communication method.
interface WrpChannel {
  listen(): AsyncGenerator<WrpMessage>;
  send(message: WrpMessage): Promise<void>;
}

type Metadata = Record<string, string>;
interface LazyMetadata {
  [key: string]:
    | undefined
    | string
    | Promise<string | undefined>
    | (() => string | undefined)
    | (() => Promise<string | undefined>);
}

// Guest provides a way to send requests to the host.
interface WrpGuest {
  availableMethods: Set<string>;
  request(
    methodName: string,
    req: AsyncGenerator<Uint8Array>,
    metadata?: LazyMetadata,
  ): {
    res: AsyncGenerator<Uint8Array>;
    header: Promise<Metadata>;
    trailer: Promise<Metadata>;
  };
}

// Host provides a way to handle and respond to requests from guests.
interface WrpHost {
  listen(): AsyncGenerator<WrpRequest>;
}
interface WrpRequest {
  methodName: string;
  metadata: Metadata;
  req: AsyncGenerator<Uint8Array>;
  sendHeader(value: Metadata): void;
  sendPayload(value: Uint8Array): void;
  sendTrailer(value: Metadata): void;
}
```