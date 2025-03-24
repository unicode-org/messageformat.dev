---
title: Using MF2 with JavaScript and TypeScript
sidebar_title: JavaScript/TypeScript
---

The following guide explains how to use the `messageformat` package to format
MF2 messages. For full API documentation, see the
[API documentation site](https://messageformat.github.io/modules/messageformat)
for the package. This guide shows the simplest use cases for the API. More
advanced uses are possible, which are documented in the API documentation.

## Installation and setup

Install/add the package to your project. If you're using Node.js with npm, you
can do this by running

```sh
npm install --save-exact messageformat@next
```

or use the corresponding operation for your preferred package manager. For
instance, for Deno projects, you can run

```sh
deno add npm:messageformat@next
```

once that's done, you can import the contructor in your code like

```js
import { MessageFormat } from "messageformat";
```

## `MessageFormat` class

The main class for formatting messages is `MessageFormat`. The class has two
methods you are likely to call: `format()` and `formatToParts()`.

### constructor

The constructor takes one or more locales and a message string. Example:

```js
const mf = new MessageFormat(["en", "fr"], "Hello {$user}");
```

`mf` is now a message formatter object that can be re-used to format the same
message with different arguments.

The constructor has an optional third argument, which can be used to specify
custom functions. (See [Writing Custom Functions](#writing-custom-functions)).

### `format()` method

The `format()` method formats the message formatter's message as a string.
Example:

```js
const mf = new MessageFormat("en", "Hello {$user}");
const result = mf.format({ "user": "Bob" });
// result === "Hello Bob"
```

The first argument to `format()` is an object that specifies values for any
external variables mentioned in the message.

`format()` has an optional second argument, which is used for reporting errors.

```js
const mf = new MessageFormat("en", "Hello {$user}");
const result = mf.format({ "us3r": "Bob" }, (error) => console.log(error.type));
// result === "Hello {$user}"
// Logs the string "unresolved-var" to the console
```

Messages can contain errors. In this case, `format()` returns a best-effort
result: in this case, `"Hello {$user}"`, because no value was given for
`"user"`. Passing in a callback gives the caller a way to check for errors. In
this case, the error is an "unresolved variable" error. In this example, the
error handling callback just logs the type of the error, for brevity. The full
error could also be logged. The `MessageError` class defines the structure of
errors: see
[the API documentation](https://messageformat.github.io/classes/messageformat.MessageError).

### `formatToParts()` method

The `formatToParts()` method is useful when different pieces of the formatted
message need to be extracted and processed separately. It avoids the need to
re-parse the formatted string, which is useful for frameworks like React where
you might want to preprocess the formatted result before rendering it.

Example:

```js
const mf = new MessageFormat("en", "{#b}Hello {$user}{/b}");
const result = mf.formatToParts({ "user": "Bob" });
```

Unlike with `format()`, `result` is an array of `MessagePart`s. In this case, it
looks like:

```js
[
  { type: "markup", kind: "open", source: "#b", name: "b" },
  { type: "literal", value: "Hello " },
  { type: "string", source: "$user", locale: "en", value: "Bob" },
  { type: "markup", kind: "close", source: "/b", name: "b" },
];
```

Each part is the formatted representation of one of the parts of the source
message.

In this case, there are four parts, representing:

1. The opening `b` markup placeholder.
2. The literal part "Hello ", which appeared literally in the source message.
3. The expression part, representing an expression in the source message
   (`$user`) along with its formatted value, `"Bob"`.
4. The closing `b` markup placeholder.

As with `format()`, `formatToParts()` can take an optional error callback as its
second argument.

## `MessagePart` type

`MessagePart` is defined as follows
([full documentation](https://messageformat.github.io/types/messageformat.MessagePart)):

```ts
export type MessagePart =
  | MessageExpressionPart
  | MessageLiteralPart
  | MessageMarkupClosePart
  | MessageMarkupPart;
```

In the `formatToParts()` example, the first part is a `MessageMarkupPart`; the
second is a `MessageLiteralPart`; the third is a `MessageExpressionPart`; and
the fourth is a `MessageMarkupClosePart`.

### `MessageMarkupPart`

A `MessageMarkupPart` has `'markup'` as its `type` property. Its other
properties are:

- `kind`: Either `"open"` (like `{#b}`) or `"standalone"` (like `{#b/}`).
- `name`: The name of the markup placeholder (`"b"` in the example).
- `source`: A string representation of the source markup placeholder.
- `options`: The formatted options of this markup placeholder (an advanced
  feature).

### `MessageMarkupClosePart`

Same as `MessageMarkupPart`, but `kind` is always `"close"`.

### `MessageLiteralPart`

The `type` property is `'literal'`. It has one other property, `value`. For
literal parts, the source representation and the formatted value are identical
to each other.

### `MessageExpressionPart`

The `type` property is a string representation of the type of this expression.
In the above example, it's `'string'`, because the runtime value of `{$user}` is
a string (a string value was provided for the value of the external variable
`$user`.)

The other properties are `source` (as with `MessageMarkupPart`) and `value` (as
with `MessageLiteralPart`). Since an expression's contents vary depending on
input, `source` and `value` are usually different from each other.

See the full
[MessageExpressionPart](https://messageformat.github.io/interfaces/messageformat.MessageExpressionPart)
documentation for more.

## Writing custom functions

The optional third argument to the `MessageFormat` constructor is an object
providing definitions for custom functions. To start with, let's write code for
a simple custom function:

```js
/**
 * @params {string[]} locales
 * @params {Record<string, unknown>} options
 * @params {string} value
 */
function uppercase(locales, options, value) {
  return { toString: () => value.toUpperCase() };
}
```

Now that this function is defined, we can pass it to the `MessageFormat`
constructor as part of the third argument:

```js
const mf = new MessageFormat(
  ["en"],
  "{messageformat :uppercase}",
  { functions: { uppercase } },
);
```

If we invoke `mf.format()`, we get the result `MESSAGEFORMAT`.

Some things to notice:

- The `uppercase` function takes three arguments. The first one is a list of
  locales, which we ignore in this example. The second one is the function's
  _options_; this example doesn't use any options. The third one is the operand
  for the function, which is a resolved value.
- In this case, the `value` argument is a string. In a real function, we would
  want to check the type of `value`, since a message could be written that uses
  the `:uppercase` annotation on a non-string value.
- The return value of `uppercase` is an object with a `toString()` method. The
  message formatter calls this method when evaluating the result of the
  `{messageformat :uppercase}` expression.
  - In general, the return value of a function is a resolved value
    (`MessageValue`). The operand type can be a `MessageValue` as well. Resolved
    values can have other properties, which are omitted here in the interest of
    providing the simplest possible example.

See the full
[MessageValue](https://messageformat.github.io/interfaces/messageformat_functions.MessageValue)
documentation for more.

To clarify what we mean by "the operand type can be a `MessageValue`, consider
the following message:

```mf2
.local $c = {cat :uppercase}
.local $c1 = {$c :uppercase}
{{{$c1}}}
```

We might expect `$c1` to be the same as `$c` (uppercasing a string twice gives
the same result). But with our function as-is, we get an error:

```
> const message = ".local $c = {cat :uppercase} .local $c1 = {$c :uppercase} {{{$c1}}}"
> mf = new messageformat.MessageFormat(['en'], message, { functions : { uppercase } } )
> mf.format()
'{�}'
> (node:1250142) TypeError: value.toUpperCase is not a function
```

What happened? When evaluating `c1`, instead of a string, the `uppercase`
function was passed the resolved value of `$c`, which is an object with several
properties. So calling the string method `toUpperCase()` on it results in an
error.

A more robust method would check the type of its argument and, if passed a
`MessageValue`, apply `toString()` to get a string. Then it could call
`toUpperCase()` on the result.

For more details, see the
[API documentation](https://messageformat.github.io/classes/messageformat.MessageFormat)
on the `MessageFormat` constructor.
