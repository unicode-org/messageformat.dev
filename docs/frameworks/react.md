---
title: Using MF2 with React
sidebar_title: React
---

This guide explains how to localize React applications with MessageFormat 2
(MF2), using the `mf2react` package.

The library builds ontop of [i18next](https://www.i18next.com/) and
[react-i18next](https://react.i18next.com/), popular internationalization
frameworks for JavaScript and React.

The package contains a post-processor plugin for i18next that compiles MF2
messages and converts lightweight curly-tag markup into safe HTML tags, which
`react-i18next` can render as JSX. For example the message
`{#bold}Hello{/bold},
{$name}!` becomes `<strong>Hello</strong>, {$name}!` when
rendered.

MF2 features such as pluralization, select, and conditional logic are fully
supported. For example, the following MF2 message:

```mf2
.match {$count: number}
one    {{You have {$count} message}}
*      {{You have {$count} messages}}
```

Can be used in a React component like this:

```tsx
import { Trans } from "react-i18next";
export default function MessagesComponent({ count }: { count: number }) {
  return <Trans i18nKey="messages" values={{ count }} />;
}
```

## Introduction

> This guide assumes you have a basic understanding of React and i18next /
> react-i18next.

## Installation and setup

In an existing React project, install the `mf2react` package, along with the
`i18next`, and `react-i18next` dependencies:

```bash
npm install mf2react i18next react-i18next
```

You can also use a different package manager, such as `yarn`, `pnpm`, or `deno`
to install the packages.

### Defining your catalogs (translations)

Create JSON files for each locale you want to support. For example, create a
`locales/en/translation.json` file for English translations:

```json
{
  "welcome": "Welcome to our application!",
  "goodbye": "Goodbye!",
  "greeting": "Hello, {$name}!",
  "apples": ".input {$value :number}\n.match $value\none   {{{#bold}1{/bold} apple}}\n*     {{{#bold}{$value}{/bold} apples}}"
}
```

And a `locales/no/translation.json` file for Norwegian translations:

```json
{
  "welcome": "Velkommen til vår applikasjon!",
  "goodbye": "Ha det!",
  "greeting": "Hei, {$name}!",
  "apples": ".input {$value :number}\n.match $value\none   {{{#bold}1{/bold} eple}}\n*     {{{#bold}{$value}{/bold} epler}}"
}
```

### Setting up i18next

Create a `i18n.ts` file in your project to configure i18next.

```ts
// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { MF2PostProcessor, MF2ReactPreset } from "mf2react";

import en from "./locales/en/translation.json";
import no from "./locales/no/translation.json";

i18n
  .use(MF2PostProcessor) // Enable the post-processor
  .use(MF2ReactPreset) // Enable curly-tag -> JSX conversion
  .use(initReactI18next)
  .init({
    lng: "en",
    postProcess: ["mf2"], // Apply MF2 to all translations
    resources: {
      // Reference the translation files
      en: { translation: en },
      no: { translation: no },
    },
  });

export default i18n;
```

> Instead of defining the selected locale (`lng`) and `resources` directly in
> the `init` function, you may also choose to load them dynamically, e.g. via
> [i18next-http-backend](https://github.com/i18next/i18next-http-backend),
> [i18next-resources-to-backend](https://github.com/i18next/i18next-resources-to-backend).
> Additionally you may want to auto-detect the user's locale using
> [i18next-browser-languagedetector](https://github.com/i18next/i18next-browser-languagedetector).

### Wrapping your application with I18nextProvider

To use translations in your React components, you need to wrap your application
with the `I18nextProvider` from `react-i18next`. This is typically done in your
main application file or layout component.

```ts
"use client";

import { I18nextProvider } from "react-i18next";
import { i18n } from "./i18n";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
```

> Good to know: because `I18nextProvider` uses React context, it can only be
> used in a client component.

#### Choosing where to place the provider

Where you place the provider affects what becomes client-rendered. You may
either wrap your whole application in the provider, or each component that uses
translations. This is because `I18nextProvider` must be used in a client
component. Choose the placement based on how much of your UI should be
client-rendered.

### Using translations in components

Now you can use the `<Trans>` component from `react-i18next` to render
translations in your React components. For example:

```tsx
import { Trans } from "react-i18next";
export default function WelcomeComponent() {
  return (
    <div>
      <h1>
        <Trans i18nKey="welcome" />
      </h1>
      <p>
        <Trans i18nKey="goodbye" />
      </p>
    </div>
  );
}
```

> You can read more about the Trans component in the
> [react-i18next documentation](https://react.i18next.com/latest/trans-component)

#### Passing variables to translations

You can also pass variables to your translations using the `values` prop of the
`<Trans>` component. For example, if you have a translation that includes a
variable:

```json
{
  "greeting": "Hello, {$name}!"
}
```

You can use it in your component like this:

```tsx
import { Trans } from "react-i18next";
export default function GreetingComponent({ name }: { name: string }) {
  return <Trans i18nKey="greeting" values={{ name }} />;
}
```

This also works for MF2 messages with pluralization and formatting:

```tsx
import { Trans } from "react-i18next";
export default function ApplesComponent({ count }: { count: number }) {
  return <Trans i18nKey="apples" values={{ value: count }} />;
}
```

> Output when `count` is 1: **1** apple
>
> Output when `count` is 5: **5** apples

#### Markup with curly-tags

You can use curly-tags in your translations to add formatting. For example, in
your translation file:

```json
{
  "bold": "This is {#bold}bold text{/bold}."
}
```

You can render it in your component like this:

```tsx
import { Trans } from "react-i18next";
export default function BoldComponent() {
  return <Trans i18nKey="bold" />;
}
```

> Output: This is **bold text**.

This works because the `mf2react` post-processor converts the curly-tags into
safe HTML tags, which `react-i18next` can render as JSX. The following tags are
supported:

```txt
{#bold}…{/bold}
{#strong}…{/strong}
{#i}…{/i}
{#em}…{/em}
{#u}…{/u}
{#s}…{/s}
{#small}…{/small}
{#code}…{/code}
```

## Notes and limitations

- i18next post-processors must return **strings**. The JSX conversion happens
  inside `<Trans>`.
- Messages are compiled and cached per language for performance.
- The curly-tag conversion is intentionally minimal and safe. It only recognizes
  tags defined in the alias list.
- If you switch languages at runtime, the plugin automatically reuses or
  recompiles as needed.
- Unsupported MF2 syntax will fall back gracefully to raw string + curly tag
  conversion.

## Acknowledgements

- [i18next](https://www.i18next.com/) - the internalization framework
- [react-i18next](https://react.i18next.com/) - React bindings for i18next
- [@messageformat/core](https://github.com/messageformat/messageformat) -
  MessageFormat2 engine used for compiling and evaluating MF2 syntax.
