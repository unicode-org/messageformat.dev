export const layout = "layout.vto";

export const title = "Playground";

// deno-lint-ignore no-explicit-any
export default function IndexPage({ comp }: any) {
  return (
    <>
      <header class="relative h-24 z-30">
        <svg
          class="rotate-180 -z-10 absolute top-0 left-0"
          height="100%"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 70"
          preserveAspectRatio="none"
          fill="url(#gradient)"
        >
          <linearGradient id="gradient">
            <stop style="stop-color: #1d4ed8" offset="0%" />
            <stop style="stop-color: #3b82f6" offset="100%" />
          </linearGradient>
          <rect width="1000" height="61" y="9" />
          <path d="M0 0 Q 500 10 1000 0 L 1000 10 L 0 10 Z" />
        </svg>
        <nav class="z-20 h-full">
          <div class="h-full flex justify-between items-center pb-1 px-8 max-w-screen-lg mx-auto">
            <div class="flex items-center gap-3">
              <img
                src="/static/logos/no-padding/mf2-logo-only.svg"
                class="size-10"
              />
              <div>
                <a
                  href="/"
                  class="text-white
         font-serif font-bold text-2xl hover:underline underline-offset-4"
                >
                  MessageFormat 2
                </a>
                <span class="mx-2 text-white select-none">/</span>
                <span class="text-white text-lg">Playground</span>
              </div>
            </div>
            <div class="flex gap-6 items-end">
              <div class="flex flex-col">
                <label
                  for="locale"
                  class="text-md font-bold font-serif px-2 text-blue-50"
                >
                  Locale
                </label>
                <select id="locale" class="w-52 p-2 rounded-lg bg-gray-100">
                  <option id="en-US">English (United States)</option>
                  <option disabled>Loading...</option>
                </select>
              </div>
              <button
                id="share"
                class="inline-block px-3 md:px-4 py-1 md:py-2 text-md font-bold text-blue-600 rounded-full bg-gray-50 hover:bg-blue-200 active:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
              >
                Share
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div class="grid grid-cols-2 px-8 mt-6 mb-12 mx-auto max-w-screen-lg gap-4">
        {
          /* <div class="col-span-2 flex justify-between items-end gap-6">
          <h1 class="text-3xl font-bold font-serif px-2 pb-1 text-blue-900 border-b w-full">
            Playground
          </h1>

          <div class="flex justify-end items-end gap-6">
            <div class="flex flex-col">
              <label
                for="locale"
                class="text-md font-bold font-serif px-2 text-blue-900"
              >
                Locale
              </label>
              <select id="locale" class="w-32 p-2 rounded-lg bg-gray-100">
                <option value="en">English</option>
                <option value="de">German</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="it">Italian</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="pt">Portuguese</option>
                <option value="ru">Russian</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
            <button class="inline-block px-3 md:px-4 py-1 md:py-2 text-md font-bold text-white rounded-full bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 active:from-blue-700 active:to-blue-500 focus:from-blue-700 focus:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white">
              Share
            </button>
          </div>
        </div> */
        }

        <div class="h-80 flex flex-col">
          <label for="message">
            <h2 class="text-xl font-bold font-serif px-2 pb-1 text-black">
              Message
            </h2>
          </label>
          <highlighted-textarea id="message" class="highlighted">
            <textarea
              placeholder="Type your message here..."
              class="w-full h-full resize-none font-mono p-4 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {`Hello {$name}!`}
            </textarea>
          </highlighted-textarea>
          <div
            id="message-errors"
            class="text-red-600 bg-red-50 p-4 mt-2 rounded-lg whitespace-pre-wrap"
            hidden
          >
          </div>
          <div
            id="message-popup"
            class="absolute px-2 py-1 border bg-gray-100 rounded max-w-[90%] md:max-w-[70ch] font-mono"
            hidden
          >
          </div>
        </div>
        <div class="h-80 flex flex-col">
          <label for="data">
            <h2 class="text-xl font-bold font-serif px-2 pb-1 text-black">
              Data
            </h2>
          </label>
          <highlighted-textarea id="data" class="highlighted">
            <textarea
              class="w-full h-full resize-none font-mono p-4 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Type your data here..."
            >
              {`{\n  "name": "User"\n}`}
            </textarea>
          </highlighted-textarea>
          <div
            id="data-errors"
            class="text-red-600 bg-red-50 p-4 mt-2 rounded-lg"
            hidden
          >
          </div>
        </div>

        <div class="col-span-2">
          <h2 class="text-xl font-bold font-serif px-2 pb-1 text-black">
            Output
          </h2>
          <div class="border rounded-md p-6 text-lg min-h-20" id="output">
            {`Hello User!`}
          </div>
          <pre
            id="output-errors"
            class="text-red-600 bg-red-50 p-4 mt-2 rounded-lg font-mono"
            hidden
          >
          </pre>
        </div>
      </div>

      <div class="px-8 mt-12 mb-24 mx-auto max-w-screen-lg grid grid-cols-2 gap-6">
        <div class="space-y-6">
          <div class="px-2 space-y-2">
            <h2 class="text-xl font-bold font-serif pb-1 text-black">
              About the playground
            </h2>
            <p class="text-black">
              All messages written in the <code>Message</code>{" "}
              field are formatted using the data written in the{" "}
              <code>Data</code>{" "}
              field. This formatting happens locally, using the{" "}
              <code>locale</code> selected in the dropdown.
            </p>
            <p class="text-black">
              For more information on MessageFormat 2, please refer to the{" "}
              <a
                href="/docs/quick-start/"
                class="text-blue-700 underline"
              >
                quick start guide
              </a>.
            </p>
          </div>
          <div class="px-2 space-y-2">
            <h2 class="text-xl font-bold font-serif pb-1 text-black">
              Functions
            </h2>
            <p class="text-black">
              All built-in MessageFormat 2 functions are supported:{" "}
              <code>string</code>, <code>number</code>, <code>integer</code>,
              {" "}
              <code>datetime</code>, <code>date</code>, and <code>time</code>.
            </p>
          </div>
        </div>
        <div>
          <div class="px-2 space-y-2">
            <h2 class="text-xl font-bold font-serif pb-1 text-black">
              Markup
            </h2>
            <p class="text-black">
              MessageFormat 2 does not have built-in markup tags. The playground
              however supports five markup tags that can be used to try out
              markup.
            </p>
            <table class="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th class="border px-2">Tag</th>
                  <th class="border px-2">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border px-2">
                    <code>bold</code>
                  </td>
                  <td class="border px-2">
                    Make the contained message <b>bold</b>.
                  </td>
                </tr>
                <tr>
                  <td class="border px-2">
                    <code>italic</code>
                  </td>
                  <td class="border px-2">
                    Make the contained message <i>italic</i>.
                  </td>
                </tr>
                <tr>
                  <td class="border px-2">
                    <code>error</code>
                  </td>
                  <td class="border px-2">
                    Make the contained look{" "}
                    <span class="text-red-600">errored</span>.
                  </td>
                </tr>
                <tr>
                  <td class="border px-2">
                    <code>link</code>
                  </td>
                  <td class="border px-2">
                    Add a link, pointing to the <code>url</code> option.
                  </td>
                </tr>
                <tr>
                  <td class="border px-2">
                    <code>star-icon</code>
                  </td>
                  <td class="border px-2">
                    Display a star icon (⭐).
                  </td>
                </tr>
              </tbody>
            </table>
            <p class="text-black">
              Markup tags must be balanced.
            </p>
          </div>
        </div>
      </div>
      <comp.footer />
    </>
  );
}
