---
title: Using MF2 with React
sidebar_title: React
---

This guide explains how to localize React applications with MessageFormat 2
(MF2), using the `mf2react` package.

## The package

A tiny, fast **MessageFormat v2 (MF2)** post-processor plugin for i18next / react-i18next.

It compiles MessageFormat2 message (via the messageformat package), caches them per language, and convert `{#tag}...{/tag}` lightweight markup into safe HTML tags, which `<Trans>` from `react-i18next` can render as JSX.

## Installation

```bash
npm install mf2react
```

Requires:

- i18next
- react-i18next
- messageformat@^4

## Why this exists

MF2 is the new standard for expressive, locale-aware messages with plural, select, and conditional logic.

For example

```mf2
.match {$count: number}
one    {{You have {$count} message}}
*      {{You have {$count} messages}}
```

However, real applications may also need styling inside translations (bold, italics, etc.). HTML inside translations is risky and not supported well in i18next. This plugin solves that by lettings translators write:

```txt
{#bold}Hello{/bold}, {$name}!
```

Which your app renders as:

```html
<strong>Hello</strong>, Name!
```

You get precise grammatical control and rich formatting, without giving up i18next's familiar API or resorting to `dangerouslySetInnerHTML`

## Quick start

> **NOTE: As this is a react specific plugin for i18next, this guide assumes some knowledge/experience with both i18next and react-i18next.**

### 1. Register the post-processor

In your i18n configuration, you need to register the MF2 post processor. Additionally, you should add the MF2ReactPreset to enable curly tag (from mf2) to JSX conversion. This is to allow for nested stylings and proper conversion.

```ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { MF2PostProcessor, MF2ReactPreset } from "mf2react";

i18n
  .use(MF2PostProcessor) // Enable the post-processor
  .use(MF2ReactPreset) // Enable curly-tag -> JSX conversion
  .use(initReactI18next)
  .init({
    lng: "en",
    postProcess: ["mf2"], // Apply MF2 to all translations
    resources: {
      /**/
    },
  });

export default i18n;
```

The `resources` field in the `init` function may directly contain translations, but preferably references to some json files where the translations are stored. This may look like this:

```ts
import en from "./locales/en/translation.json";
import no from "./locales/no/translation.json";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { MF2PostProcessor } from "mf2react";

i18n
  .use(MF2PostProcessor)
  .use(MF2ReactPreset)
  .use(initReactI18next)
  .init({
    lng: "en",
    postProcess: ["mf2"],
    resources: {
      en: { translation: en },
      no: { translation: no },
    },
  });

export default i18n;
```

---

### 2. Wrap your application in an I18nextProvider

To use MF2 translations in React, your components must be rendered inside an `I18nextProvider`.
Because `I18nextProvider` uses React context, it can only be used in a client component.

Option A: Use `I18nextProvider` directly:

```ts
"use client";

import { I18nextProvider } from "react-i18next";
import { i18n } from "./i18n";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
```

Option B: Use `I18nmf2Provider` (recommended)
This library also exports a convenience wrapper around I18nextProvider:

```ts
import { I18nmf2Provider } from "mf2react";
import { i18n } from "./i18n";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <I18nmf2Provider i18n={i18n}>{children}</I18nmf2Provider>;
}
```

Both options are functionally equivalent.

#### Choosing where to place the provider

Where you place the provider affects what becomes client-rendered.
You may either wrap your whole application in the provider, or each component that uses translations. This is because `I18nextProvider` must be used in a client component. Choose the placement based on how much of your UI should be client-rendered.

### 3. Write MF2 translations

MF2 message definitions allow complex logic.
Here are examples you can put in `translations.json`

#### A simple example**

```json
{
  "apples": ".input {$value :number}\n.match $value\none   {{ {#bold}How many apples:{/bold} {$value} apple }}\n*     {{ {#bold}How many apples:{/bold} {$value} apples }}"
}
```

#### A multi-variable example

```json
{
  "notifications": ".input {$name :string}\n.input {$count :number}\n.match $count\n0   {{ {#bold}Hello {$name}!{/bold} You have no new messages }}\none {{ {#bold}Hello {$name}!{/bold} You have {$count} new message }}\n*   {{ {#bold}Hello {$name}!{/bold} You have {$count} new messages }}"
}
```

#### Curly-tag markup

Supported tags include:

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

They map to safe HTML tags (e.g. `<strong>, <em>` etc.), which `<Trans>` converts to JSX

> You can read more about MF2 syntax in the [MF2 documentation](https://messageformat.unicode.org/docs/translators/)

### 4. Render with `<Trans>`

Now you can render the `<Trans>` component as you usually would. For example:

```tsx
import { Trans } from "react-i18next";

export default function Component() {
  let count: number;
  return (
    <Trans
      i18nKey="apples"
      values={
        {{ value: count }}
      }
    />
  );
}
```

Example output:
**How many apples**: 2 apples

Multi-variable usage:

```tsx
<Trans i18nKey="notifications" values={{ name: "Name", count: 4 }} />
```

Output:
**Hello Name!** You have 4 new messages

>You can read more about the Trans component in the [react-i18next documentation](https://react.i18next.com/latest/trans-component)

## Notes and limitations

- i18next post-processors must return **strings**. The JSX conversion happens inside `<Trans>`
- Messages are compiled and cached per language for performance
- The cury-tag conversion is intentionally minimal and safe. It only recognizes tags defined in the alias list.
- If you switch languages at runtime, the plugin automatically reuses or recompiles as needed.
- Unsupported MF2 syntax will fall back gracefully to raw string + curly tag conversion

## Acknowledgements

- [i18next](https://www.i18next.com/) - the internalization framework
- [react-i18next](https://react.i18next.com/) - React bindings for i18next
- [@messageformat/core](https://github.com/messageformat/messageformat) - MessageFormat2 engine used for compiling and evaluating MF2 syntax.
