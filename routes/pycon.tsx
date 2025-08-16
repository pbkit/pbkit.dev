import { tw } from "twind";
import NavigationBar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";

export default function MainPage() {
  return (
    <>
      <head>
        <title>pbkit - Protobuf toolkit for modern web development</title>
        <meta
          name="description"
          content="Protobuf toolkit for modern Web development"
        />
      </head>
      <NavigationBar active="/" />
      <div class="bg(gray-50) flex flex-col justify-center items-center min-h-screen">
        <p>
          <a href="https://forms.gle/unzLZHQp676iAvnU8">
            https://forms.gle/unzLZHQp676iAvnU8
          </a>
        </p>
        <img src="/qr.svg" alt="QR Code" class="w-96 h-96" />
      </div>
      <Footer />
    </>
  );
}
