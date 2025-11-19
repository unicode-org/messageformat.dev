---
title: Using MF2 with Angular
sidebar_title: Angular
---

This guide explains how to localize Angular applications with MessageFormat 2
(MF2), using the `angular-mf2` package.

The library:

- takes care of locale selection, MF2 parsing, and safe HTML rendering
- exposes a tiny store service for locale and formatting
- integrates with Angular via dependency injection (DI) tokens and an impure
  `| mf2` pipe

You bring the message catalogs and the formatting parameters; `angular-mf2` does
the rest.

## Installation and setup

In an existing Angular project, install the Angular integration package together
with the MF2 engine and an HTML sanitizer:

```sh
npm install angular-mf2 messageformat sanitize-html
```

You can also use a different package manager, such as `yarn`, `pnpm`, or `deno`
to install the packages.

### Defining your catalogs

`angular-mf2` expects a catalog object mapping locale codes to message maps:

```ts
// app.config.ts
import { ApplicationConfig } from "@angular/core";
import { useMF2Config } from "angular-mf2";

const catalogs = {
  en: {
    greeting: "Hello {$name}, how are you?",
    rich:
      "This is {#bold}bold{/bold}, {#italic}italic{/italic}, {#underline}underlined{/underline}, inline {#code}code(){/code}.",
    block:
      "{#p}Paragraph one.{/p}{#p}Paragraph two with a {#mark}highlight{/mark}.{/p}",
    quote:
      "{#quote}“Simplicity is the soul of efficiency.” — Austin Freeman{/quote}",
    list:
      "{#p}List:{/p}{#ul}{#li}First{/li}{#li}Second{/li}{#li}Third{/li}{/ul}",
    ordlist:
      "{#p}Steps:{/p}{#ol}{#li}Plan{/li}{#li}Do{/li}{#li}Review{/li}{/ol}",
    supSub: "H{#sub}2{/sub}O and 2{#sup}10{/sup}=1024",
    codeBlock: "{#pre}npm i angular-mf2{/pre}",
  },
  no: {
    greeting: "Hei {$name}, hvordan går det?",
    rich:
      "Dette er {#bold}fet{/bold}, {#italic}kursiv{/italic}, {#underline}understreket{/underline}, inline {#code}kode(){/code}.",
    block:
      "{#p}Avsnitt én.{/p}{#p}Avsnitt to med en {#mark}utheving{/mark}.{/p}",
    quote:
      "{#quote}«Enkelhet er effektivitetens sjel.» — Austin Freeman{/quote}",
    list:
      "{#p}Liste:{/p}{#ul}{#li}Første{/li}{#li}Andre{/li}{#li}Tredje{/li}{/ul}",
    ordlist:
      "{#p}Steg:{/p}{#ol}{#li}Plan{/li}{#li}Gjør{/li}{#li}Evaluer{/li}{/ol}",
    supSub: "H{#sub}2{/sub}O og 2{#sup}10{/sup}=1024",
    codeBlock: "{#pre}npm i angular-mf2{/pre}",
  },
} as const;
```

Instead of hardcoding the catalogs, you can also load them from JSON files:

```ts
import en from "./locales/en.json" with { type: "json" };
import no from "./locales/no.json" with { type: "json" };
const catalogs = { en, no } as const;
```

The shape of the catalogs object is as follows:

```ts
type MF2Catalogs = Record<string, Record<string, string>>;
```

Every key in the inner locale-specific maps corresponds to a message in MF2
format. The keys are the ids you will use in your templates to reference the
messages.

### Providing configuration via DI

The catalog and default locale must be provided via Angular's dependency
injection (DI) system at application bootstrap time. This is done with the
`useMF2Config(...)` helper function.

```ts
// app.config.ts
import { ApplicationConfig, provideHttpClient } from "@angular/core";
import { useMF2Config } from "angular-mf2";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    ...useMF2Config({
      defaultLocale: "en",
      catalogs,
    }),
  ],
};
```

This does two things:

- It registers the MF2 configuration object under the `MF2_CONFIG` DI token, so
  that the library can access it.
- It registers the `Store` service, which is used by the `| mf2` pipe and can
  also be injected into your own components and services.

The shape of the configuration object is as follows:

```ts
export type MF2Config = {
  defaultLocale: string;
  catalogs: Record<string, Record<string, string>>;
};
```

## Using the `| mf2` pipe in templates

The `MF2Pipe` is a standalone, impure pipe that returns sanitized HTML. Because
of this, it is typically used together with `[innerHTML]`.

The basic usage is as follows:

```html
<p [innerHTML]="'greeting' | mf2 : { name: username }"></p>
<p [innerHTML]="'rich' | mf2"></p>
<div [innerHTML]="'list' | mf2"></div>
```

The signature of the pipe is `{{ key | mf2 : args? }}`, where `key` is a string
key into the current locale's catalog, and `args` is an optional object mapping
MF2 variable names to values. The pipe returns a sanitized HTML string that can
be bound to `[innerHTML]`.

### Standalone import

The pipe is standalone and can be imported directly into components:

```ts
import { Component } from "@angular/core";
import { MF2Pipe } from "angular-mf2";

@Component({
  selector: "app-example",
  standalone: true,
  imports: [MF2Pipe],
  template: `
    <p [innerHTML]="'greeting' | mf2 : { name: 'Ada' }"></p>
  `,
})
export class ExampleComponent {}
```

Because the pipe is **impure**, Angular will re-evaluate it whenever the `Store`
emits changes (e.g. when the locale is switched).

## Store service

Internally, the pipe uses a small `Store` service that is also available for
direct use in your own components and services.

```ts
import { Injectable } from "@angular/core";
import { Store } from "angular-mf2";

@Injectable()
export class LocaleSwitcher {
  constructor(private readonly store: Store) {}

  set(lang: string) {
    this.store.setLocale(lang);
  }
}
```

The API is intentionally small:

```ts
@Injectable()
class Store {
  setLocale(locale: string): void;
  getLocale(): string;
  format(key: string, args?: Record<string, unknown>): string;
}
```

- `setLocale(locale)` updates the active locale and notifies the pipe
- `getLocale()` returns the currently active locale
- `format(key, args?)` formats a given key programmatically and returns a
  **sanitized HTML string**

Example (programmatic formatting):

```ts
@Component({
  /* ... */
})
export class GreetingComponent {
  html: string = "";

  constructor(private readonly store: Store) {}

  ngOnInit() {
    this.html = this.store.format("greeting", { name: "Lin" });
  }
}
```

```html
<p [innerHTML]="html"></p>
```

## Security and sanitization

`angular-mf2` uses `sanitize-html` with a conservative default policy. All
formatted output is passed through the sanitizer before it is returned by the
`Store` or `| mf2` pipe.

The default allowlist includes a subset of HTML elements such as:

- inline: `strong`, `em`, `u`, `s`, `code`, `kbd`, `mark`, `sup`, `sub`, `span`,
  `a`, `br`
- block: `p`, `ul`, `ol`, `li`, `pre`, `blockquote`

Only a minimal set of attributes is allowed by default.

### Customizing the policy

You can extend or tighten the sanitizer configuration using the
`MF2_SANITIZE_OPTIONS` DI token:

```ts
// app.config.ts
import { MF2_SANITIZE_OPTIONS } from "angular-mf2";

export const appConfig: ApplicationConfig = {
  providers: [
    ...useMF2Config({ defaultLocale: "en", catalogs }),
    {
      provide: MF2_SANITIZE_OPTIONS,
      useValue: {
        allowedAttributes: {
          a: ["href", "target", "rel", "title", "role", "tabindex"],
        },
        allowedStyles: {
          "*": {
            color: [/^.*$/],
            "background-color": [/^.*$/],
          },
        },
      },
    },
  ],
};
```

This object is passed directly to `sanitize-html`, so any options supported by
that library can be used here.

## Markup cheatsheet

`angular-mf2` understands a small, explicit subset of MF2 markup and maps it to
HTML elements. All output is sanitized; only the tags listed (and a minimal set
of attributes) are allowed by default.

| MF2 Markup                  | Renders as                   |
| --------------------------- | ---------------------------- |
| `{#bold}x{/bold}`           | `<strong>x</strong>`         |
| `{#italic}x{/italic}`       | `<em>x</em>`                 |
| `{#underline}x{/underline}` | `<u>x</u>`                   |
| `{#s}x{/s}`                 | `<s>x</s>`                   |
| `{#code}x{/code}`           | `<code>x</code>`             |
| `{#kbd}⌘K{/kbd}`            | `<kbd>⌘K</kbd>`              |
| `{#mark}x{/mark}`           | `<mark>x</mark>`             |
| `{#sup}x{/sup}`             | `<sup>x</sup>`               |
| `{#sub}x{/sub}`             | `<sub>x</sub>`               |
| `{#p}x{/p}`                 | `<p>x</p>`                   |
| `{#quote}x{/quote}`         | `<blockquote>x</blockquote>` |
| `{#ul}{#li}x{/li}{/ul}`     | `<ul><li>x</li></ul>`        |
| `{#ol}{#li}x{/li}{/ol}`     | `<ol><li>x</li></ol>`        |
| `{#pre}x{/pre}`             | `<pre>x</pre>`               |

Examples from the catalog above:

```mf2
rich = This is {#bold}bold{/bold}, {#italic}italic{/italic}, {#underline}underlined{/underline}, inline {#code}code(){/code}.
block = {#p}Paragraph one.{/p}{#p}Paragraph two with a {#mark}highlight{/mark}.{/p}
list = {#p}List:{/p}{#ul}{#li}First{/li}{#li}Second{/li}{#li}Third{/li}{/ul}
codeBlock = {#pre}npm i angular-mf2{/pre}
```

Rendered via:

```html
<p [innerHTML]="'rich' | mf2"></p>
<div [innerHTML]="'block' | mf2"></div>
<div [innerHTML]="'list' | mf2"></div>
<pre [innerHTML]="'codeBlock' | mf2"></pre>
```
