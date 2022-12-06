import { tw } from "twind";

interface NavbarProps {
  active: string;
}

export default function Navbar({ active }: NavbarProps) {
  const items = [
    { name: "Home", href: "/" },
    { name: "Docs", href: "/docs" },
    { name: "Discord", href: "https://discord.com/invite/PHmV3nhvQq" },
    { name: "Github", href: "https://github.com/pbkit" },
  ];

  return (
    <nav class="bg(gray-50) py-2 border(t-2 b-2 gray-100)">
      <div class="flex items-center justify-between max-w-screen-lg mx-auto">
        <a class="flex items-center gap-2 mx-4 tracking-tight" href="/">
          <img src="/pbkit.svg" width="32" />
          {/* <b>pbkit</b> */}
        </a>
        <ul class="flex justify-end gap-8 mx-4">
          {items.map((item) => (
            <li>
              <a
                href={item.href}
                class={tw`text-gray-800 hover:underline ${
                  active == item.href ? "font-bold" : ""
                }`}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
