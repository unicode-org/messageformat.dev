---
title: Patterns
description: Patterns are the building blocks of a message.
---

A pattern is a sequence of text and placeholders to be formatted as a unit. Unless there is an error, the result of formatting a message is always the result of formatting a single pattern: either the single pattern that makes up a simple message, or the pattern of the matching variant in a complex message.

Almost anything not beginning with a `.` or a `{{` is an _unquoted pattern_ in MessageFormat. An unquoted pattern, on its own, is a simple message.

<mf2-interactive>

```mf2
This is a pattern. It can include expressions like {$v} and {#bold}markup{/bold}.
```

```json
{ "v": "this" }
```

</mf2-interactive>

There are certain characters that can't appear in an unquoted pattern. You probably won't run into these at first.

## Quoted Patterns

A quoted pattern is a pattern that is enclosed in double braces (`{{...}}`). Quoting may be necessary because a pattern may contain characters that have a special meaning in the MessageFormat syntax, and the quotes make it clear that these characters should be interpreted literally.

Also, *all* patterns that appear in complex messages must be quoted. So in a message that has declarations:

<mf2-interactive>

```mf2
.local $y = {1}
{{This pattern must be quoted.}}
```

</mf2-interactive>

Patterns in a _matcher_ must also be quoted. We'll talk about matchers later.

## Text

Text is the translatable content of a pattern. Any Unicode code point is allowed, except for surrogate code points U+D800 through U+DFFF inclusive. The characters `\`, `{`, and `}` must be escaped.

Note that whitespace in text, including tabs, spaces, and newlines is significant and will be preserved during formatting.

<mf2-interactive>

```mf2
.input {$num :number}
{{   This is the {$num} pattern   }}
```

```json
{ "num": 5 }
```

</mf2-interactive>

An example with escaped characters:

<mf2-interactive>

```mf2
Backslash: \\, left curly brace \{, right curly brace \}
```

</mf2-interactive>
