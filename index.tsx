import { ComponentChildren } from "preact";

export const layout = "layout.vto";

export const title = "Home";

export default function IndexPage() {
  return (
    <>
      <div class="bg-blue-50">
        <div class="mx-auto max-w-screen-md">
          <Head />
          <section class="p-4 max-w-screen-lg mx-auto mt-2 md:mt-4 lg:mt-8 text-lg md:text-xl lg:text-2xl space-y-4">
            <AdParagraph>
              MessageFormat 2 (MF2) is a Unicode standard for localizable dynamic
              message strings, designed to make it simple to create{" "}
              <b>natural sounding</b> localized messages.
            </AdParagraph>
            <div class="pt-4 md:pt-8 flex flex-wrap gap-4 md:gap-6">
              <a
                href="/playground/"
                class="inline-block px-6 md:px-8 py-3 md:py-4 text-lg font-bold text-white rounded-full bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 active:from-blue-700 active:to-blue-500 focus:from-blue-700 focus:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
              >
                Try in Playground
              </a>
              <a
                href="/docs/quick-start/"
                class="inline-block px-6 md:px-8 py-3 md:py-4 text-lg font-bold text-blue-600 rounded-full bg-blue-100 hover:bg-blue-200 active:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
              >
                Documentation
              </a>
            </div>
          </section>
        </div>
        <svg
          class="w-full mt-8 fill-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 100"
        >
          <path d="M0 0 Q 500 100 1000 0 L 1000 100 L 0 100 Z" />
        </svg>
      </div>
      <div class="mx-auto max-w-screen-md mb-12">
        <Examples />
      </div>
      <div class="bg-blue-50 pb-48">
        <svg
          class="w-full mt-8 fill-white rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 100"
        >
          <path d="M0 0 Q 500 100 1000 0 L 1000 100 L 0 100 Z" />
        </svg>

        <section class="max-w-screen-lg mx-auto p-4 mt-8 flex flex-col items-center gap-8 md:gap-16">
          <h2 class="max-w-screen-md text-center font-serif font-bold text-3xl md:text-4xl lg:text-5xl lg:leading-tighter tracking-tight md:tracking-tighter">
            ...and that is just the beginning!
          </h2>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-white rounded-3xl p-8">
              <h3 class="font-serif font-bold text-xl lg:text-2xl">
                Custom formatters and selectors
              </h3>
              <p class="mt-4 text-base sm:text-lg">
                MessageFormat 2 allows developers to define custom functions to
                handle complex formatting and matcher needs.
              </p>
            </div>
            <div class="bg-white rounded-3xl p-8">
              <h3 class="font-serif font-bold text-xl lg:text-2xl">
                An industry standard
              </h3>
              <p class="mt-4 text-base sm:text-lg">
                MessageFormat 2 is developed at Unicode, and is built directly
                into ICU4C, ICU4J, and soon, ECMA-402 (JavaScript's
                internationalization library).
              </p>
            </div>
            <div class="bg-white rounded-3xl p-8">
              <h3 class="font-serif font-bold text-xl lg:text-2xl">
                Intuitive for translators
              </h3>
              <p class="mt-4 text-base sm:text-lg">
                MessageFormat 2 messages are designed to be easy to translate,
                with clear markers for variables and formatting, requiring
                minimal training.
              </p>
            </div>
          </div>

          <div class="relative mt-16">
            <div
              class="absolute left-5 -bottom-32 font-handwritten text-lg px-2 text-nowrap"
              data-arrow-to="get-started"
              data-arrow-direction="top"
              data-arrow-target-direction="bottom"
              data-arrow-path=""
            >
              what are you waiting for?
            </div>
            <div class="pt-1 flex justify-center">
              <div class="p-2 animate-pulse-bg-blue rounded-full">
                <a
                  href="/docs/quick-start"
                  class="opacity-100! inline-block px-8 md:px-12 py-5 md:py-7 text-2xl font-bold text-white rounded-full bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 active:from-blue-700 active:to-blue-500 focus:from-blue-700 focus:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
                  id="get-started"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <footer class="bg-blue-50">
        <div class="max-w-screen-md mx-auto p-4 text-lg text-center">
          <p>
            MessageFormat 2 is developed by{" "}
            <a
              href="https://unicode.org"
              class="underline underline-offset-2 hover:text-blue-600 transition duration-100"
            >
              Unicode
            </a>{" "}
            in the{" "}
            <a
              href="https://github.com/unicode-org/message-format-wg"
              class="underline underline-offset-2 hover:text-blue-600 transition duration-100"
            >
              MessageFormat Working Group
            </a>
            .
          </p>
          <p>
            Website designed by{"  "}
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
    </>
  );
}

export function Head() {
  return (
    <header class="w-full pt-6 sm:pt-8 md:pt-10 lg:pt-20 px-4 max-w-screen-lg mx-auto flex gap-4 sm:gap-8 sm:items-center">
      <img
        src="/static/logos/no-padding/mf2-logo-only.svg"
        alt="MessageFormat 2"
        class="hidden sm:block size-12 md:size-24 lg:size-32"
      />
      <div>
        <h1 class="block text-4xl md:text-5xl lg:text-6xl lg:leading-tighter tracking-tight md:tracking-tighter font-serif font-bold">
          MessageFormat 2
        </h1>
        <p class="block text-xl md:text-2xl lg:text-2xl">
          A full featured localization system, from&nbsp;Unicode.
        </p>
      </div>
    </header>
  );
}

export function AdParagraph(props: { children: ComponentChildren }) {
  return (
    <p class="max-w-4xl">
      {props.children}
    </p>
  );
}

export function Examples() {
  return (
    <>
      <Example>
        <ExampleProse title="Free form interpolation">
          <p>
            MessageFormat 2 messages can contain variables, which are replaced
            with values at runtime.
          </p>
          <p>
            Variables can be moved around in the message freely, allowing
            translations even to languages where sentence structure doesn't
            match the source.
          </p>
        </ExampleProse>
        <ReplacementVariableCode />
      </Example>
      <Example>
        <ExampleProse title="Safe markup">
          <p>
            Markup tags can be included in messages, allowing safe rich text
            formatting in translations.
          </p>
          <p>
            MessageFormat 2 doesn't assign meaning to markup, giving full
            control over it's meaning and rendering to the developer.
          </p>
        </ExampleProse>
        <MarkupCode />
      </Example>
      <Example>
        <ExampleProse title="Number and date formatting">
          <p>
            MessageFormat 2 makes it simple to format numbers, dates, and times
            in a locale-appropriate way within messages.
          </p>
          <p>
          </p>
        </ExampleProse>
        <div class="flex flex-col gap-1 justify-center -mx-4 md:mx-0">
          <div class="relative">
            <span
              class="absolute -top-[70%] left-[0rem] text-nowrap font-handwritten text-lg px-2"
              data-arrow-to="formatting-function"
              data-arrow-direction="right"
            >
              time formatting function
            </span>
            <CodeBlock>
              It is {" {"}
              <span class="text-orange-500">{`$timestamp`}</span>{" "}
              <span class="text-green-700">
                :tim<span id="formatting-function">e</span>
              </span>

              {`}.`}
            </CodeBlock>
          </div>
          <div class="flex justify-center items-center">
            <ArrowDownIcon />
          </div>
          <div class="border-y md:border-x md:rounded-md p-6 text-lg">
            It is <span id="time">10:41:03</span>.
          </div>
          <script
            dangerouslySetInnerHTML={{
              __html: `
onReady(() => {
  const time = document.getElementById('time');
  const formatter = new Intl.DateTimeFormat('en-US', {});
  setInterval(() => {
    time.textContent = new Date().toLocaleTimeString();
  }, 250);  
});
`,
            }}
          />
        </div>
      </Example>
      <Example>
        <ExampleProse title="Pluralization">
          <p>
            MessageFormat 2 supports pluralization, allowing messages to adapt
            to the number of items, even in languages with complex plural rules.
          </p>
          <p>
            Pluralization rules from{" "}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules"
              class="underline underline-offset-2 hover:text-blue-600 transition duration-100"
            >
              ECMA-402's Intl.PluralRules
            </a>{" "}
            are used to match the correct plural form.
          </p>
        </ExampleProse>
        <PluralizationCode />
      </Example>
    </>
  );
}

function ReplacementVariableCode() {
  return (
    <div class="space-y-1 pt-6 -mx-4 md:mx-0">
      <div class="relative">
        <span
          class="absolute -top-[60%] left-[11.5rem] text-nowrap font-handwritten text-lg px-2"
          data-arrow-to="replacement-var"
        >
          a replacement variable
        </span>
        <CodeBlock>
          Your name is {"{"}
          <span id="replacement-var" class="text-violet-600">
            $name
          </span>
          {"}"}.
        </CodeBlock>
      </div>
      <div class="text-2xl flex justify-center">
        <PlusIcon />
      </div>
      <CodeBlock>
        <span class="text-red-600">let</span>{" "}
        <span class="text-violet-600">name</span> ={" "}
        <span class="relative">
          <span class="relative inline-block text-orange-500" id="name1">
            "Alice"
          </span>
        </span>
      </CodeBlock>
      <div class="flex justify-center items-center">
        <ArrowDownIcon />
      </div>
      <div class="border-y md:border-x md:rounded-md p-6 text-lg">
        Hello{" "}
        <span class="relative">
          <span class="text-orange-600 relative inline-block" id="name2">
            Alice
          </span>
        </span>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          onReady(() => {
              const name1 = document.getElementById('name1');
              const name2 = document.getElementById('name2');
              const names = ['Alice', 'Bob', 'Charlie'];

              let i = 0;
              setInterval(() => {
                i++;
                rollingShutter(name1, (el) => {
                  el.textContent = '"' + names[i % names.length] + '"';
                });
                rollingShutter(name2, (el) => {
                  el.textContent = names[i % names.length];
                });        
            }, 4000);
          });
        `,
        }}
      />
    </div>
  );
}

function MarkupCode() {
  return (
    <div class="flex flex-col gap-1 justify-center -mx-4 md:mx-0">
      <div class="relative">
        <span
          class="absolute -top-[60%] left-[12.5rem] text-nowrap font-handwritten text-lg px-2"
          data-arrow-to="markup-tag"
        >
          inline markup
        </span>
        <CodeBlock>
          This is{" "}
          <span class="text-blue-700" id="markup-tag">{`{#bold}`}
          </span>important<span class="text-blue-700">
            {`{/bold}`}
          </span>.
        </CodeBlock>
      </div>
      <div class="flex justify-center items-center">
        <ArrowDownIcon />
      </div>
      <div class="border-y md:border-x md:rounded-md p-6 text-lg">
        This is <strong>important</strong>.
      </div>
    </div>
  );
}

function PluralizationCode() {
  return (
    <div class="space-y-1 -mx-4 md:mx-0">
      <CodeBlock>
        <span class="text-blue-700">.input</span>
        {` {`}
        <span class="text-violet-600">$count</span>{" "}
        <span class="text-green-700">:number</span>
        {`}\n`}
        <span class="text-blue-700">.match</span>{" "}
        <span class="text-violet-600">$count</span>
        {`\n`}
        <span class="text-green-700">0</span>
        {`   {{ No items. }}\n`}
        <span class="text-green-700">one</span>
        {` {{ 1 item. }}\n`}
        <span class="text-green-700">*</span>
        {`   {{ {$count} items. }}`}
      </CodeBlock>
      <div class="flex justify-center items-center">
        <PlusIcon />
      </div>
      <CodeBlock>
        <div class="flex items-center">
          <div>
            <span class="text-red-600">let</span>{" "}
            <span class="text-violet-600">count</span> ={" "}
            <span id="count1">3</span>
          </div>
          <input
            id="count-slider"
            class="inline-block ml-6 w-full mr-4"
            type="range"
            min="0"
            max="5"
            step="1"
            value="3"
          >
          </input>
        </div>
      </CodeBlock>
      <div class="flex justify-center items-center">
        <ArrowDownIcon />
      </div>
      <div
        class="border-y md:border-x md:rounded-md p-6 text-lg"
        id="count-output"
      >
        3 items.
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
onReady(() => {
  const count1 = document.getElementById('count1');
  const countOutput = document.getElementById('count-output');
  const countSlider = document.getElementById('count-slider');
  countSlider.addEventListener('input', () => {
    count1.textContent = countSlider.value;
    const count = countSlider.value;
    countOutput.textContent = count === '0' ? 'No items.' : count === '1' ? '1 item.' : count + ' items.';
  });
});
`,
        }}
      />
    </div>
  );
}

function Example(props: { children: ComponentChildren }) {
  return (
    <section class="mt-32 grid md:grid-cols-2 gap-12 px-4">
      {props.children}
    </section>
  );
}

function ExampleProse(
  props: { title: string; children: ComponentChildren },
) {
  return (
    <div class="max-w-md">
      <h3 class="font-serif font-bold text-2xl md:text-3xl">
        {props.title}
      </h3>
      <div class="text-lg md:text-xl leading-7 mt-4 space-y-6">
        {props.children}
      </div>
    </div>
  );
}

function CodeBlock(
  props: { class?: string; label?: string; children: ComponentChildren },
) {
  return (
    <pre class={`bg-gray-100 p-4 md:rounded-lg relative ${props.class ?? ""}`}>
      <span class="absolute -top-3 left-2 bg-gray-50 rounded-t px-2 text-xs">
        {props.label}
      </span>
      <code>{props.children}</code>
    </pre>
  );
}

function PlusIcon() {
  return (
    <svg
      class="w-6 h-6 text-blue-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      >
      </path>
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg
      class="size-5
       text-blue-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 14l-7 7m0 0l-7-7m7 7V3"
      >
      </path>
    </svg>
  );
}
