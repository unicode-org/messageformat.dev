---
title: Guide for Translators
description: Understanding MessageFormat 2 for translators
---

MessageFormat 2 (MF2) is designed to enable localization of dynamic messages across
different human languages. The syntax of MF2 messages is designed
to make it clear which parts of a message needs to be translated,
and which parts are code that doesn't need to be translated.

This guide is aimed at translators; there is also
[developer documentation](/docs/quick-start/).

## Simple messages

Messages use curly brackets -- `{` and `}` -- to separate code from text.
Take a look at the following message:

<mf2-interactive>

```mf2
Hello, {$name}!
```

```json
{ "name": "World" }
```

</mf2-interactive>

The text `Hello, {$name}!` is the message. The text `{ "name": "World" }`
is not part of the message; in this interactive demonstration, you can
edit it to experiment with how the message looks depending on
runtime information.

The text `{$name}` is an example of a _placeholder_, which should
not be translated. The word "name" here is an example of a variable,
which is used by code invoking the message formatter to specify
the value of some piece of data that is only known after the user
has provided some input.

Because the text "Hello, " is outside the curly braces, it's not a
placeholder and it should be translated.

When translating a message, it may be necessary to move a placeholder
to make a grammatically correct result. It would be perfectly fine
to edit the message `Hello, {$name}` to be `{$name}, hello!`.

When translating a message, it's important to make sure the curly
braces still match.

## Placeholders with functions

A placeholder can also contain a _function name_, which also shouldn't
be translated. A function name begins with a colon, `:`.

<mf2-interactive>

```mf2
It is the {$today :datetime} today.
```

```json
{ "today": "2024-07-01T12:00:00Z" }
```

</mf2-interactive>

In this example, `{$today :datetime}` is a placeholder with the function
`:datetime`. The names of functions are non-translatable.

Functions can also have _options_, which are also non-translatable content.

<mf2-interactive>

```mf2
It is the {$today :datetime dateStyle=long timeStyle=long} today.
```

```json
{ "today": "2024-07-01T12:00:00Z" }
```

</mf2-interactive>

In both of these examples, only the text "It is the" and the text "today"
should be translated.

## Matchers and variants

A more complicated kind of message, called a _matcher_,
uses variables to select a _variant_ of a message.
One of the most common forms of matching is to match on
the plural category of a word.
For example:

<mf2-interactive>

```mf2
.input {$numDays :number}
.match $numDays
one  {{{$numDays} day}}
*    {{{$numDays} days}}
```

```json
{ "numDays": 2 }
```

</mf2-interactive>

The text inside the **double curly braces** needs to be translated,
**except** for any placeholders contained in this text.
In this example, `{$numDays}` is a placeholder. The text
"day" and "days" needs to be translated.

> Be sure to keep all of the curly braces matching!
> If the placeholder `{$numDays}` needs to be moved in order
> to translate the message, the curly braces need to move with it.

Each of the variants begins with one or more _keys_.
In this example, there are two variants. The first one begins with
the string `one`. The second one begins with the string `*`.
`*` is a special key that matches anything. So this message is saying:
"If the value of `$numDays` is singular, use the pattern
`{{{$numDays} day}}`. If it's plural, use the pattern
`{{{$numDays} days}}`.

Translating a message to another language might involve adding new
variants. For example, if you were to translate this message into Czech,
you would need to both translate the existing variants and add two new
ones:

<mf2-interactive locale="cs-CZ">

```mf2
.input {$numDays :number}
.match $numDays
one  {{{$numDays} den}}
few  {{{$numDays} dny}}
many {{{$numDays} dne}}
*    {{{$numDays} dní}}
```

```json
{ "numDays": 2 }
```

</mf2-interactive>

Notice that the `few` and `many` variants have been added. When looking
at a matcher, it's important to ask if more (or fewer) variants are needed
in the target language.
[The CLDR Plural Rules page](https://www.unicode.org/cldr/cldr-aux/charts/22/supplemental/language_plural_rules.html)
includes a list of plural categories for each language.

## Literals

Sometimes, text appears inside paired pipe (`|`) characters.
This text is called a _literal_.

<mf2-interactive>

```mf2
My name is {|John Doe|}.
```

</mf2-interactive>

Usually, text inside literals has a special meaning and shouldn't
be translated, but it depends on the developer's intentions.
A more common use of literals is inside option values:

<mf2-interactive>

```mf2
The year is '{$today :datetime year=|2-digit|} today.
```

```json
{ "today": "2024-07-01T12:00:00Z" }
```

</mf2-interactive>

In this case, the string `2-digit` is code; it's part of a
call to the function `:datetime`. It shouldn't be translated.

## Markup

MF2 allows for _markup_, which changes the appearance of text. Markup
should not be translated:

<mf2-interactive>

```mf2
This is {#bold}bold text{/bold}.
```

</mf2-interactive>

The text "bold" inside the curly braces is code. Markup tags begin
with a `#` or `/`, so it's pretty easy to spot them and know
that they shouldn't be translated. The text "bold text" is not
markup (though it's preceded and followed by markup) and should
be translated.

## Declarations

Messages can be prefixed with some lines of code beginning with
either `.local` or `.input`, such as:

<mf2-interactive>

```mf2
.local $x = {|This is an expression|}
.input {$now :datetime dateStyle=long}
{{{$x} from {$now}}}
```

```json
{ "now": "2021-04-03" }
```

</mf2-interactive>

These lines of code are called "declarations". When declarations
are present, the translatable part of the message is enclosed
in a double set of curly braces: `{{` / `}}`. Only the text
inside the double curly braces should be translated.


## Escape characters

As we explained, single sets of curly braces are special: they enclose text
that shouldn't be translated. However, sometimes a message might
need to include a curly brace in text presented to a user.
In that case, an "escape character" is used.

<mf2-interactive>

```mf2
A left curly brace is \{. A right curly brace is \}.
```

</mf2-interactive>

Putting a backslash (`\`) in front of a curly brace says
that the curly brace is just a character in the text
and shouldn't be given special meaning.
