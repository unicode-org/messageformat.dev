---
title: Markup
description: Markup allows localized messages to be richly formatted.
---

_Markup_ is a type of placeholder. A markup placeholder can be "open", "close", or "standalone". This example shows open and close markup placeholders.

<mf2-interactive>

```mf2
Click {#link}here{/link}. {#bold}{$count}{/bold} {#star-icon/}
```

```json
{ "count": 32 }
```

</mf2-interactive>

`{#link}` is an opening markup placeholder, while `{/link}` is a closing markup placeholder.
`{#star-icon/}` is a standalone markup placeholder.

> **Note**: The `link`,`bold`, and `star-icon` tags are not built into MF2, but rather, are provided by the playground.

Markup is not specific to any particular markup language such as HTML. The message formatter doesn't interpret markup. It simply passes pieces of markup through into the formatted result.

The details of what the formatted result looks like are implementation-specific.
For one example of how markup is represented in the formatted result,
see the discussion of
the `formatToParts()` method in the documentation on [using MF2 with JavaScript](/docs/integration/js/#the-formattoparts()-method).
