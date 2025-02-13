export default function Footer(
  { background = "", padding = "px-4" } = {},
) {
  return (
    <footer class={background}>
      <div
        class={"max-w-screen-lg mx-auto text-sm text-center py-4 " + padding}
      >
        <p>
          © {new Date().getFullYear()}{" "}
          Unicode, Inc. Unicode and the Unicode Logo are registered trademarks
          of Unicode, Inc. in the U.S. and other countries. See{" "}
          <a
            href="https://www.unicode.org/copyright.html"
            class="underline underline-offset-2 hover:text-blue-600 transition duration-100"
          >
            Terms of Use
          </a>.
        </p>
        <p>
          Website designed by{" "}
          <a
            href="https://lcas.dev"
            class="underline underline-offset-2 hover:text-blue-600 transition duration-100"
          >
            Luca Casonato
          </a>. For more, see{" "}
          <a
            href="/about/"
            class="underline underline-offset-2 hover:text-blue-600 transition duration-100"
          >
            About
          </a>.
        </p>
      </div>
    </footer>
  );
}
