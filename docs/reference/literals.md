---
title: Literals
description: Number and text literals are used as arguments to functions and matchers.
---

In the example below, `long` is a _literal_. Literals can appear in various contexts in an MF2 message:

* As a key in a _variant_ in a [_matcher_](/docs/reference/matchers/).
* Inside an _expression_:
  * An _expression_ can appear in a [_pattern_](/docs/reference/patterns/), in a _declaration_,
    or in a _variant_ in a _matcher_.
* As the value of an _option_ in [_markup_](/docs/reference/markup/) or an _annotation_ (such as a [_function_](/docs/reference/functions/)).

For example, the right-hand side (part appearing to the right of an '=' sign) of an option can be either a variable or a literal. You can tell that it's a literal in this case because it doesn't begin with `$`. Rarely, literals have to be quoted (enclosed in `|` / `|` characters).

<mf2-interactive>

```mf2
Today is {$date :datetime weekday=long}.
```

```json
{ "date": "2024-06-06" }
```

</mf2-interactive>

The text `|image.png|` is an example of a _quoted_ literal. It has to be quoted because it includes a `.` character. In general, literals containing non-alphanumeric characters have to be quoted.

Some functions have option values that need to be quoted. For example:

<mf2-interactive>

```mf2
The year is {$date :datetime year=|2-digit|}.
```

```json
{ "date": "2024-06-06" }
```

</mf2-interactive>

Note that the option value `2-digit` is quoted, because it includes a `-` character.


## Unquoted literals

An unquoted literal can either be a number, or a string of alphanumeric characters
beginning with an alphabetic character or underscore (`_`).

<mf2-interactive>

```mf2
.local $x = {42}
.local $y = {number42}
.local $z = {_number}
{{{$x} {$y} {$z}}}
```

</mf2-interactive>

The curly braces are part of the _expression_ that each of the variable
names is bound to; not part of the literals themselves.

Note that MF2 is untyped. Like all other literals, number literals are
treated as strings within the formatter. The distinction between number
literals and other unquoted literals is purely syntactic.
To handle number literals as numbers, functions must parse them from
their string values.

(This is a simplification; for an exact specification of which characters are
allowed in unquoted literals, see the `name` and `number-literal` productions
in the [formal grammar](https://github.com/unicode-org/message-format-wg/blob/main/spec/message.abnf)
for MF2.)

## Quoted literals

Quoted literals can include almost any character.

<mf2-interactive>

```mf2
.local $x = {|@literal|}
.local $y = {|white space|}
.local $z = {|{{curly braces}}|}
{{{$x} {$y} {$z} {|and \\, a backslash|}}}
```

</mf2-interactive>

Note that the quoted literal `|and \\, a backslash|` also appears in curly
braces, because it's inside a pattern and thus has to be an expression.

For an exact specification of which characters are allowed in quoted
literals, see the `quoted-char` production in the
[formal grammar](https://github.com/unicode-org/message-format-wg/blob/main/spec/message.abnf) for MF2.

<!-- TODO: number literals -->