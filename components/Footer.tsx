import { tw } from "twind";

const LINKS = [
  {
    title: "github",
    href: "https://github.com/pbkit",
  },
  {
    title: "discord",
    href: "https://discord.com/invite/PHmV3nhvQq",
  },
  { title: "twitter", href: "https://twitter.com/pbkit_" },
  { title: "deno.land/x/pbkit", href: "https://deno.land/x/pbkit" },
];

export default function Footer() {
  const footer =
    tw`w-full border(t-1 gray-200) h-32 flex flex-col gap-4 justify-center`;
  const inner =
    tw`mx-auto max-w-screen-lg flex items-center justify-center gap-4`;
  const linkStyle = tw`text-gray-800 hover:underline`;
  const copyright = tw`text(gray-800 center)`;
  return (
    <footer class={footer}>
      <div class={inner}>
        {LINKS.map((link) => (
          <a href={link.href} class={linkStyle}>
            {link.title}
          </a>
        ))}
      </div>
      <div class={copyright}>
        <span>© {new Date().getFullYear()} pbkit</span>
      </div>
    </footer>
  );
}
