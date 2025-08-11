---
title: Functions
description: Function annotations enable dynamically executing code from a message to format values, or retrieve environment information.
---

When you write an annotation in your MessageFormat message, then underneath the
hood, the formatter calls a function. These could either be built-in functions
that aim to assist you in performing common i18n operations like formatting
common data types or custom functions that are registered by the user in the
function registry. The syntax for annotations is as follows, with the operand
followed by the function name and finally the options.

<mf2-interactive>

```mf2
Today is {$date :datetime weekday=long}.
```

```json
{ "date": "2024-06-06" }
```

</mf2-interactive>

The annotation `{$date :datetime weekday=long}` can be read as: "Take the value
of the variable `$date` and format it as a date, using the `long` format for the
weekday part of the date." If `:datetime` is passed something that can't be
parsed as a date, a formatting error occurs:

<mf2-interactive>

```mf2
Today is {$date :datetime weekday=long}.
```

```json
{ "date": "foo" }
```

</mf2-interactive>

This error message says that the string "foo" is not a valid date.

The set of meaningful options and their values is specific to each function, as
is the rule for determining which operands are valid.

There are two types of functions: formatting functions (formatters) and selector
functions. The same function can be both a formatter and selector: for example,
the built-in `:number` function.

## Formatting functions

A formatting function takes an operand and produces a value from it. This value
can either be formatted immediately, as when using the result in a pattern (like
in the `:datetime` example above), or it can be named and referred to in other
expressions. For example:

<mf2-interactive>

```mf2
.local $date1 = {$date :datetime weekday=long}
{{Today is {$date1}.}}
```

```json
{ "date": "2024-06-06" }
```

</mf2-interactive>

It would be equivalent to write:

<mf2-interactive>

```mf2
.input {$date :datetime weekday=long}
{{Today is {$date}.}}
```

```json
{ "date": "2024-06-06" }
```

</mf2-interactive>

## Selector functions

Selector functions are used to customize the behavior of a matcher. The
`:string` and `:number` selector functions are built in, but you can also write
your own custom selector functions. To understand how selectors work, look at
this example:

<mf2-interactive>

```mf2
.local $val = {foo :string}
.match $val
foo {{Foo}}
bar {{Bar}}
*   {{No match}}
```

</mf2-interactive>

In the annotation `{foo :string}`, the operand is the literal `foo`. Underneath
the hood, the `string` function is passed in both its operand, and a list of the
keys for all the variants: in this case, `["foo", "bar"]`. It returns a list of
keys sorted by preference. `string` does exact matching, so in this case it
would only return `["foo"]`. The key `*` is special and is used when the
selector doesn't return any matching keys.

## Built-in functions

### The `number` and `integer` functions

The `number` and `integer` functions both format and select on numbers,
including literals (strings) that can be parsed as numbers. The `integer`
function treats its operand as an integer, for example:

<mf2-interactive>

```mf2
{3.14 :integer}
```

</mf2-interactive>

The formatted result when annotating `3.14` with `:integer` is `3`. Otherwise,
`number` and `integer` behave similarly.

#### Number formatting

The `number` function has many different options to control formatting, some of
which also work for `integer`.
The following example shows how some of the options work.

<mf2-interactive>

```mf2
.local $n1 = {$num :number notation=scientific minimumSignificantDigits=5}
.local $n2 = {$num :number style=percent}
.local $n3 = {$num :number minimumIntegerDigits=4 minimumFractionDigits=4}
.local $n4 = {$num :number maximumSignificantDigits=6}
{{The number in scientific notation is {$n1}. As a percentage, it's {$n2}.
Formatted with at least four integer digits and four fractional digits, it's
{$n3}. Formatted with at most six significant digits, it's {$n4}.}}
```

```json
{ "num": 3.1415927 }
```

</mf2-interactive>

For the most part, these options can be combined arbitrarily.

#### Number selection

When used as a selector in a `.match`, the default behavior of `number` is to
find the CLDR plural category of the operand, and compare the variants against
that category. This behavior can be customized using options.

Revisiting the Czech example from the quick start guide:

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

Notice that the value of the operand `$numDays` is 2, but it matches with the
key `few`. The `number` function uses CLDR data for the `cs-CZ` locale to
determine that the plural category of 2 is "few".

However, `number` can also do exact matching:

<mf2-interactive locale="cs-CZ">

```mf2
.input {$numDays :number select=exact}
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

With this option, since "2" is not literally equal to any of the other keys, the
`*` variant matches.

#### Options

The following table includes all the options that can be passed to `:number`,
according to
[the specification](https://github.com/unicode-org/message-format-wg/blob/main/spec/registry.md#options-1).
A description of each option follows.

| Option name      | Allowed values                                    | Default value | Used with `:integer`? |
|------------------|---------------------------------------------------|---------------|-----------------------|
|`select`          | `plural`, `ordinal`, `exact`                      | `plural`      | yes                   |
|`compactDisplay`  | `short`, `long`                                   | `short`       | no                    |
|`notation`        | `standard`, `scientific`, `engineering`, `compact`| `standard`    | no                    |
|`numberingSystem` | a valid [Unicode Number System Identifier](https://cldr-smoke.unicode.org/spec/main/ldml/tr35.html#UnicodeNumberSystemIdentifier) | Locale-dependent | yes |
|`signDisplay`     | `auto`, `always`, `exceptZero`, `negative`, `never` | `auto`      | yes                   |
|`style`           | `decimal`, `percent`                              | `decimal`     | yes                   |
|`useGrouping`     | `auto`, `always`, `never`, `min2`                 | `auto`        | yes                   |
|`minimumIntegerDigits` | Digit size option (see below)                | `1`           | yes                   |
|`minimumFractionDigits`| Digit size option (see below)                | No default    | no                    |
|`maximumFractionDigits`| Digit size option (see below)                | No default    | no                    |
|`minimumSignificantDigits` | Digit size option (see below)            | No default    | no                    |
|`maximumSignificantDigits` | Digit size option (see below)            | No defualt    | yes                   |

All the same options can be passed to `:integer`, except where noted in the rightmost
column of the table.

Many of the options are similar to the [JavaScript `Intl.NumberFormat` API.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat)

**The `select` option**

The `select` option controls how selectors are matched against keys
when an expression annotated with `:number` is used as a selector.
When `plural` (the default value) is provided as the value of this option,
matching uses CLDR plural rules for cardinal numbers.
When `ordinal` is provided, values are matched based on CLDR plural rules
for ordinal numbers.
When `exact` is provided, values are matched based on their exact contents.

Compare the following three examples:

<mf2-interactive>

```mf2
.input {$num :number}
.match $num
one  {{one!}}
*    {{many!}}
```

```json
{ "num": 2 }
```
</mf2-interactive>

<mf2-interactive>

```mf2
.input {$num :number select=ordinal}
.match $num
one  {{You are {$num}st}}
two  {{You are {$num}nd}}
few {{You are {$num}rd}}
*    {{You are {$num}th}}
```

```json
{ "num": 2 }
```
</mf2-interactive>

<mf2-interactive>

```mf2
.input {$num :number select=exact}
.match $num
1 {{one!}}
2 {{two!}}
3 {{three!}}
* {{other!}}
```

```json
{ "num": 2 }
```
</mf2-interactive>

**The `compactDisplay` option**

The `compactDisplay` option only has meaning when combined with the `notation` option.
The meaning is locale-dependent, but the following examples show how it works
for the `en-US` locale:

<mf2-interactive locale=en-US>

```mf2
short: {$num :number compactDisplay=short notation=compact}
long: {$num :number compactDisplay=long notation=compact}
```

```json
{ "num": 10001 }
```
</mf2-interactive>

With this option, numbers are rounded to the nearest thousand,
million, or billion, which is then either represented as
`K`/`M`/`B` or spelled out.

**The `notation` option**

The `notation` option has the following effects, depending on its value:
* `standard`: Plain number formatting.
* `scientific`: Order of magnitude.
* `engineering`: Return the exponent of ten when divisible by three.
* `compact` Number is abbreviated as explained previously.

<mf2-interactive locale=en-US>

```mf2
standard: {$num :number notation=standard}
scientific: {$num :number notation=scientific}
engineering: {$num :number notation=engineering}
compact: {$num :number notation=compact}
```

```json
{ "num": 3001 }
```
</mf2-interactive>

**The `numberingSystem` option**

The `numberingSystem` option specifies which numbering system to use
for formatting the number. [The list of possible values](https://cldr-smoke.unicode.org/spec/main/ldml/tr35.html#UnicodeNumberSystemIdentifier)
is specified by Unicode.

<mf2-interactive>

```mf2
{$num :number numberingSystem=roman} or
{$num :number numberingSystem=arab} or
{$num :number numberingSystem=thai}
```

```json
{ "num": 3001 }
```
</mf2-interactive>

**The `signDisplay` option**

The `signDisplay` option specifies how to format the sign of a number.
The possible values are:

* `auto`: Display the sign for negative numbers only.
* `always`: Always display the sign.
* `exceptZero`: Display the sign for any non-zero number.
* `negative`: Display the sign for negative numbers, excluding negative zero.
* `never`: Never display the sign.

The following example shows how negative 0 is processed:

<mf2-interactive>

```mf2
auto: {$num :number signDisplay=auto}
always: {$num :number signDisplay=always}
exceptZero: {$num :number signDisplay=exceptZero}
negative: {$num :number signDisplay=negative}
never: {$num :number signDisplay=never}
```

```json
{ "num": -0 }
```
</mf2-interactive>

**The `style` option**

The `style` option specifies whether to format a number as a decimal
or as a percentage.

<mf2-interactive>

```mf2
decimal: {$num :number style=decimal}
percent: {$num :number style=percent}
```

```json
{ "num": 42 }
```
</mf2-interactive>

Passing `percent` causes the formatted number to be the input
number, multiplied by 100.

**The `useGrouping` option**

The `useGrouping` option controls whether to use grouping
separators, such as thousands separators in the `en-US` locale.

The possible values are:

* `auto`: Display grouping separators based on locale.
* `always`: Always display grouping separators.
* `never`: Never display grouping separators.
* `min2`: Display grouping separators only when there are at least
2 digits in a group.

(Note: a bug in the messageformat package prevents inclusion
of an interactive example.)

**Digit size options**

The five remaining options all take a "digit size" option,
which is a small integer value greater than or equal to zero,
or a string that can be parsed as one.

The options are:

* `minimumIntegerDigits`: The minimum number of integer digits
to use in formatting the number. The number will be left-padded
with zeros as much as necessary.
* `minimumFractionDigits`: The minimum number of fraction digits
to use in formatting the number.
* `maximumFractionDigits`: The maximum number of fraction digits
to use in formatting the number.
* `minimumSignificantDigits`: The minimum number of significant
digits to use.
* `maximumSignificantDigits`: The maximum number of significant
digits to use.

The following example combines all five options and shows
how two different numbers are formatted:

<mf2-interactive>

```mf2
first: {$num1 :number minimumIntegerDigits=2 minimumFractionDigits=3 maximumFractionDigits=5 minimumSignificantDigits=1 maximumSignificantDigits=5}
second: {$num2 :number minimumIntegerDigits=2 minimumFractionDigits=3 maximumFractionDigits=5 minimumSignificantDigits=1 maximumSignificantDigits=5}
```

```json
{ "num1": 3.1415927,
  "num2": 42.01 }
```
</mf2-interactive>

### The `string` function

The `string` function is both a selector and a formatter function. It works on
strings and on any operands that can be converted to a string.

#### String selection

When used as a selector, `string` matches strings exactly.

<mf2-interactive>

```mf2
.input {$operand :string}
.match $operand
1    {{Number 1}}
one  {{String "one"}}
*    {{Something else}}
```

```json
{ "operand": "1" }
```

</mf2-interactive>

This may not seem very useful, but anything used as a selector in a `.match`
must have an annotation, so `string` can be used to express your intention to
match on a value exactly.

#### String formatting

When used as a formatter, `string` returns a string representation of its
operand.

<mf2-interactive>

```mf2
{$operand :string}
```

```json
{ "operand": { "name": "days", "value": 5 } }
```

</mf2-interactive>

The exact details of how to stringify an operand are implementation-dependent,
as you can see in this example (in JavaScript, the default stringification
behavior of objects is to print them as `[object Object]`).

#### Options

The `string` function has no options.

### The `date`, `time`, and `datetime` functions

The `date`, `time`, and `datetime` functions are formatting functions that
format dates. `date` is a version of `datetime` that ignores the time component
of a date, while `time` is a version of `datetime` that ignores the date
component.

<mf2-interactive>

```mf2
Today is {$date :datetime weekday=long}.
The time is {$date :time style=full}.
The date is {$date :date style=short}.
```

```json
{ "date": "2006-01-02T15:04:06" }
```

</mf2-interactive>

If supplied as a string, the operand has to be in ISO 8601 format, followed by
an optional timezone offset. Some implementations may also accept other date
types, such as an integer timestamp:

<mf2-interactive>

```mf2
Today is {$date :datetime weekday=long}.
The time is {$date :time style=full}.
The date is {$date :date style=short}.
```

```json
{ "date": 1722746637000 }
```

</mf2-interactive>

`datetime` has two kinds of options: style options and field options. In the
above example, `weekday` is an example of a field option. There are also field
options for each part of a date/time. Their meanings are
implementation-dependent. The names of all the options can be found in the
[spec](https://github.com/unicode-org/message-format-wg/blob/main/spec/registry.md#field-options).
The style options are either `dateStyle` or `timeStyle`, whose values can be
`full`, `long`, `medium`, or `short`. The meaning of these values is also
implementation-dependent.

<mf2-interactive>

```mf2
Today is {$date :datetime dateStyle=full timeStyle=long}.
Or: today is {$date :datetime dateStyle=long timeStyle=short}.
Or: today is {$date :datetime dateStyle=medium timeStyle=full}.
Or: today is {$date :datetime dateStyle=short}.
Or: today is {$date :datetime timeStyle=medium}.
```

```json
{ "date": "2006-01-02T15:04:06" }
```

</mf2-interactive>

`date` and `time` both only have one option: `style`. The values are the same as
for `:datetime`.

<mf2-interactive>

```mf2
Today is {$date :date style=full}.
Or: today is {$date :date style=short}.
The time is {$date :time style=medium}.
Or: the time is {$date :time style=long}.
```

```json
{ "date": "2006-01-02T15:04:06" }
```

</mf2-interactive>

#### Options

**Options for `:datetime`:**

| Option name      | Allowed values                                    | Default value |
|------------------|---------------------------------------------------|---------------|
|`dateStyle`       | `full`, `long`, `medium`, `short`                 | `medium`      |
|`timeStyle`       | `full`, `long`, `medium`, `short`                 | `short`       |
| `weekday`        | `long`, `short`, `narrow`                         | none          |
| `era`            | `long`, `short`, `narrow`                         | none          |
| `year`           | `numeric`, `2-digit`                              | none          |
| `month`          | `numeric`, `2-digit`, `long`, `short`, `narrow`   | none          |
| `day`            | `numeric`, `2-digit`                              | none          |
| `hour`           | `numeric`, `2-digit`                              | none          |
| `minute`         | `numeric`, `2-digit`                              | none          |
| `second`         | `numeric`, `2-digit`                              | none          |
| `fractionalSecondDigits` | `1`, `2`, `3`                             | none          |
| `hourCycle`      | `h11`, `h12`, `h23`, `h24`                        | locale-specific |
| `timeZoneName`   | `long`, `short`, `shortOffset`, `longOffset`, `shortGeneric`, `longGeneric` | none |

All the options other than `dateStyle` and `timeStyle` are called "field options".
Field options do not have defaults, as they're intended to override locale-
and implementation-dependent default values.

Field options cannot be specified if either `dateStyle` or `timeStyle` (or both)
is specified.

**Options for `:date` and `:time`**

The `:date` and `:time` functions only have one option: `style`.
Like the `dateStyle` and `timeStyle` options to `:datetime`, its values
can be `full`, `long`, `medium`, or `short`. For `:date`, the default
is medium, and for `:time`, the default is `:short`.

The names of these options are largely derived from the
[JavaScript `Intl.DateTimeFormat` API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions#description)
and they can be expected to have the same meaning as in `Intl.DateTimeFormat`.

**Style options**

The meanings of the style options (`dateStyle`/`timeStyle`/`style`) are
locale-dependent. The following interactive example can be used to see
how these options work.

<mf2-interactive>

```mf2
Short: {$date :datetime dateStyle=short timeStyle=short}.
Medium: {$date :datetime dateStyle=medium timeStyle=medium}.
Long: {$date :datetime dateStyle=long timeStyle=long}.
Full: {$date :datetime dateStyle=full timeStyle=full}.
```

```json
{ "date": "2024-10-25T14:05:06" }
```

</mf2-interactive>

**Field options**

The meanings of the `weekday`, `era`, `year`, `month`, `day`, `hour`, `minute`, `second`,
`fractionalSecondDigits`, and `timeZoneName` options depend on
the available representations for dates and times in the current locale.

The `hourCycle` option specifies the timekeeping convention
to use in formatting the time:

* `h12`: Hour system using 1-12 (12-hour clock with midnight at 12:00 AM).
* `h23`: Hour system using 0-23 (24-hour clock with midnight at 0:00).
* `h11`: Hour system using 0-11 (12-hour clock with midnight at 0:00 AM).
* `h24`: Hour system using 0-24 (24-hour click with midnight at 24:00).


When field options are used, only the explicitly-specified fields
are present in the output. In the following example, the formatted
date only contains the year and weekday.

<mf2-interactive>

```mf2
{$date :datetime weekday=long year=|2-digit|}.
```

```json
{ "date": "2024-10-25T14:05:06" }
```

</mf2-interactive>

It's up to the developer to use a combination of field options
that makes sense for the desired locale.

## Custom functions

Here are some examples of what you can do with custom functions. The examples
are not interactive, because the playground doesn't currently support supplying
a custom function registry. The details on how to write and register these
functions are implementation-dependent.

### Examples: custom formatters

#### Text transformations

A custom formatter function could stringify its argument and apply a text
transformation to it, like converting it to uppercase:

```mf2
Check out {MessageFormat :uppercase}.
```

Result: `Check out MESSAGEFORMAT`

#### List formatting

In an implementation with a list type (such as the JavaScript implementation), a
custom formatter function could format lists:

```mf2
I know how to program in {$languages :list type=AND}
```

Parameters: `{ "languages": ["JavaScript", "C++", "Python"] }`

Result: `I know how to program in JavaScript, C++, and Python`

### Examples: custom selectors

#### Selecting a field

In an implementation with an object type (such as the JavaScript
implementation), custom selectors could extract a field from an operand and
match on that:

```mf2
.local $pronoun = {$person :pronoun}
.match $pronoun
he {{{$person :name} won his game}}
she {{{$person :name} won her game}}
they {{{$person :name} won their game}}
* {{{$person :name} won the game}}
```

Parameters: `{ "person": { "name": "Alice", "pronoun": "she", "age": 42 } }`

Result: `Alice won her game`

In this example, `pronoun` is a custom selector that extracts the `pronoun`
field from its operand if supplied an object, and matches it against keys `name`
is a custom formatter that extracts and formats a `name` field from its operand.

#### Range matching

```mf2
.local $range = {$name :range}
.match $range
|A-J| {{{$name} is in the first group}}
|J-P| {{{$name} is in the second group}}
|Q-Z| {{{$name} is in the third group}}
*     {{Should be unreachable}}
```

Parameters: `{"name": "Kim"}`

Result: `Kim is in the second group`

In this example, `range` is a custom selector that compares the first letter of
its string operand against alphabetic ranges. It could be extended to support
things like time and date ranges.
