---
title: Using MF2 with SvelteKit
sidebar_title: SvelteKit
---

A localization library for SvelteKit based on [sveltekit-i18n/base](https://github.com/sveltekit-i18n/base) and [MessageFormat2](https://messageformat.unicode.org/).

### Installation

```bash
npm install sveltekit-mf2
```

## Guide

### 1. Install @sveltekit-i18n/base and messageformat

```bash
npm install @sveltekit-i18n/base messageformat
```

### 2. Setup i18n

Create the `translations.ts` file in you `lib` folder.

```ts
import i18n from "@sveltekit-i18n/base";
const config = {
	// Add your languages in the loaderfunction either from JSON files or directly as JSON
	loaders: [
		{
			locale: "en",
			key: "common",
			loader: async () => (await import("./en/common.json")).default
		},
		{
			locale: "es",
			key: "common",
			loader: async () => (await import("./es/common.json")).default
		}
	],
	parser: {
		parse(value: string, [props]: Record<string, any>[], locale: string) {
			return { value, props, locale };
		}
	}
};

export const { setLocale, t, locale, locales, loading, loadTranslations } = new i18n(config);
```

#### The locale files

`en/common.json`

```json
{
	"test": "Hello {#bold}{$world}!{/bold}",
	"bye": "Bye"
}
```

`es/common.json`

```json
{
	"test": "Hola {#bold}{$world}!{/bold}",
	"bye": "adios"
}
```

##### Make sure to not change the parser!

### 3. Use the FormatterProvider

Inside of your `+layout.svelte` use the `<FormatterProvider>` by importing `t` and surrounding `{@render children}` with the provider.

```ts
<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
  import { FormatterProvider } from 'sveltekit-mf2';
	import { t } from "$lib/translations"

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<FormatterProvider {t}>
	{@render children()}
</FormatterProvider>
```

### 4. Set the default locale and load the translations

Create a `layout.ts` file in your routes folder.

```ts
import { loadTranslations } from "$lib/translations";

const initLocale = "en";

export const load = async ({ url }) => {
	await loadTranslations(initLocale, url.pathname);
};
```

### 5. Use the Formatter component in your application

The `<Formatter>` component takes in an id which uses the loader key and the key value in the JSON oject to reference the correct line. Props are the variables passed to the Messageformat string.

```ts
<script>
  import { setLocale } from "$lib/translations";
  import { Formatter } from "sveltekit-mf2";


  function switchToEnglish() {
    setLocale("en");
  }

  function switchToSpanish() {
    setLocale("es");
  }
</script>

<div>
  <Formatter id="common.test" values={{ world: "SvelteKit" }} />
  // values is optional
  <Formatter id="common.bye" />

  <button onclick={switchToEnglish}>english</button>
  <button onclick={switchToSpanish}>spanish</button>
</div>
```

### References

[Message Format 2](https://messageformat.unicode.org/)
[sveltekit-i18n/base](https://github.com/sveltekit-i18n/base)

#### Provider

##### `<FormatterProvider>`

Props:
`t` - The `t` function from the `i18n` object

#### Component

###### `<Formatter>`

Props:

- `id: string` - Translation key (e.g., "common.greeting")
- `values: Record<string, any>` - Variables to interpolate
