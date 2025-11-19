---
title: Using MF2 with SvelteKit
sidebar_title: SvelteKit
---

This guide explains how to localize SvelteKit applications using the
`sveltekit-mf2` library.

This library takes care of locale selection, MF2 parsing, and rendering. Because
it is based on [`@sveltekit-i18n/base`](https://github.com/sveltekit-i18n/base)
it supports shipping the minimum amount of translations to the client for each
route.

## Installation and setup

In an existing SvelteKit project, install the SvelteKit integration package
together with the MF2 engine, and `@sveltekit-i18n/base`.

```bash
npm install sveltekit-mf2 @sveltekit-i18n/base messageformat
```

You can also use a different package manager like `yarn`, `pnpm`, or `deno` to
install the packages.

## Defining translations and locale manifest

In your application's `lib` folder, create a folder for every locale you want to
support (e.g., `en`, `es`, `fr`). Inside each locale folder, create JSON files
for different translation namespaces (e.g., `common.json`, `home.json`). You
will later load one or more of these files for every route in your application.

You should split your translations into namespaces based on the routes where
they are used. For example, if you have a homepage and an about page, you might
create `home.json` and `about.json` files, and a `common.json` file for shared
translations.

```
lib/
	en/
		common.json
		home.json
		about.json
	es/
		common.json
		home.json
		about.json
```

```json
// en/common.json
{
  "greeting": "Hello, {#bold}{$name}!{/bold}",
  "farewell": "Goodbye!"
}
```

```json
// es/common.json
{
  "greeting": "¡Hola, {#bold}{$name}!{/bold}",
  "farewell": "¡Adiós!"
}
```

> In the JSON files, every translation string can use MF2 syntax for formatting
> and interpolation. See the [Quick Start](/docs/quick-start/#basic-syntax) for
> more details on the syntax.

Then create a `translations.ts` file in your `lib` folder to configure the i18n
setup. This file will define the translations available for each locale and
namespace, and set up the parser for MF2.

```ts
import i18n from "@sveltekit-i18n/base";

const config = {
  loaders: [
    {
      locale: "en",
      key: "common",
      loader: async () => (await import("./en/common.json")).default,
    },
    {
      locale: "es",
      key: "common",
      loader: async () => (await import("./es/common.json")).default,
    },
    {
      locale: "en",
      key: "home",
      routes: ["/"],
      loader: async () => (await import("./en/home.json")).default,
    },
    {
      locale: "es",
      key: "home",
      routes: ["/"],
      loader: async () => (await import("./es/home.json")).default,
    },
    {
      locale: "en",
      key: "about",
      routes: ["/about"],
      loader: async () => (await import("./en/about.json")).default,
    },
    {
      locale: "es",
      key: "about",
      routes: ["/about"],
      loader: async () => (await import("./es/about.json")).default,
    },
  ],
  parser: {
    parse(value: string, [props]: Record<string, any>[], locale: string) {
      return { value, props, locale };
    },
  },
};

export const { setLocale, t, locale, locales, loading, loadTranslations } =
  new i18n(config);
```

Then configure your root layout (`routes/+layout.js`) to load the translations:

```ts
import { loadTranslations } from "$lib/translations";

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ url }) => {
  const { pathname } = url;

  const initLocale = "en"; // hard code, or get from cookie, user session, ...

  await loadTranslations(initLocale, pathname); // keep this just before the `return`

  return {};
};
```

Finally, wrap your application in the `FormatterProvider` component in
`routes/+layout.svelte`:

```svelte
<script lang="ts">
  import { FormatterProvider } from "sveltekit-mf2";
  import { t } from "$lib/translations";

  let { children } = $props();
</script>

<FormatterProvider {t}>
  <!-- You can put other layout content here, wrapping the {@render children()} -->
  {@render children()}
</FormatterProvider>
```

## Using the Formatter component

You can now use the `<Formatter>` component anywhere in your SvelteKit
application to render localized and formatted strings.

```svelte
<script lang="ts">
  import { Formatter } from "sveltekit-mf2";
</script>

<Formatter id="common.greeting" values={{ name: "SvelteKit" }} />
<Formatter id="common.farewell" />
```

You can use the `values` prop to pass variables to the MF2 strings. The `id`
prop should be in the format `namespace.key`, where `namespace` is the key
defined in the loader configuration, and `key` is the key in the JSON file.

The `values` prop is optional if your MF2 string does not require any variables.

## Switching locales

You can switch locales by calling the `setLocale` function from your
`translations.ts` file. For example, you can create buttons to switch between
English and Spanish:

```svelte
<script lang="ts">
  import { setLocale } from "$lib/translations";

  function switchToEnglish() {
    setLocale("en");
  }

  function switchToSpanish() {
    setLocale("es");
  }
</script>

<div>
  <button onclick={switchToEnglish}>English</button>
  <button onclick={switchToSpanish}>Spanish</button>
</div>
```

## Further reading

- [@sveltekit-i18n/base documentation](https://github.com/sveltekit-i18n/base)

## Reference docs

This package exports two main components: a provider to set up the i18n context,
and a formatter component to render localized strings.

### `<FormatterProvider>`

Props:

- `t` - The `t` function from the `i18n` object

### `<Formatter>`

Props:

- `id: string` - Translation key (e.g., "common.greeting")
- `values?: Record<string, any>` - Variables to interpolate into the message
