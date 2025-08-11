---
title: Variables
description: Variables are used to dynamically reference runtime data in localized messages.
---

Variables are used to reference data that is not known at the time the message
is authored, but is passed to the message at runtime (when it is displayed).

In a message, variables are always prefixed with a `$` character. The variable
name can contain almost all characters that are not spaces or punctuation. A
variable name can't start with a number.

## Usage

Variables can be interpolated into a message using a placeholder expression.

<mf2-interactive>

```mf2
Your name is {$name}.
```

```json
{ "name": "Alice" }
```

</mf2-interactive>

Variables can be used in [function](/docs/reference/functions/) options
and [markup](/docs/reference/markup/) options.

<mf2-interactive>

```mf2
You have {42 :number style=currency currency=$currency}.
```

```json
{ "currency": "USD" }
```

</mf2-interactive>

## Declarations

In addition to referring to external input values, variables can be declared
within a message. A declaration binds a variable to a value within the scope of
a message. This variable can then be used in other expressions within the same
message. Declarations are useful for breaking down complex messages into smaller
parts, or for reusing values multiple times.

### Local declarations

Variables can be declared within a message using a `.local` statement. The
declaration is followed by the variable name, an equals sign, and an expression
that evaluates to the value of the variable.

<mf2-interactive>

```mf2
.local $count = {42}
{{The count is: {$count}}}
```

</mf2-interactive>

Expressions inside of a `.local` statement can contain literals and
functions. They can also reference other variables (local and external ones).
When referencing a variable, they cannot reference themselves or variables that
are declared syntactically _after_ them — only variables that are declared
_before_ them.

<mf2-interactive>

<!-- TODO: this should work -->

```mf2
.local $score = {0.42}
.local $score_percent = {$score :number style=percent}
{{Your score was {$score_percent}.}}
```

</mf2-interactive>

### Input declarations

Input declarations are similar to local declarations, but they are used to
explicitly name an external input value.
This can be useful to annotate an input value with a specific type or format:

<mf2-interactive>

```mf2
.input {$count :number}
{{The count is: {$count}}}
```

```json
{ "count": 32 }
```

</mf2-interactive>

Because the `:number` annotation results in a formatting error if
the value of `$count` is non-numeric, annotating `$count` explicitly
makes it easier to detect if a non-numeric value is accidentally passed in:

<mf2-interactive>

```mf2
.input {$count :number}
{{The count is: {$count}}}
```

```json
{ "count": "not a number" }
```

</mf2-interactive>

Notice the error message "Input is not numeric".

Input declarations can also be useful to ensure that an input variable is
always formatted in a specific way.

Input declarations are declared using a `.input` statement. The declaration is
followed by an expression, specifically an expression whose operand is a variable.
The variable in this expression is both the input variable being referenced,
and the name of the local variable being declared.

<mf2-interactive>

```mf2
.input {$count}
{{The count is: {$count}}}
```

```json
{ "count": 32 }
```

</mf2-interactive>

In the above example, `.input` is just being used to ensure that the `count` is
always passed. It acts as a form of documentation for both the developer and the
translator: it tells the developer that the message expects a `count` variable,
and it tells the translator that the message gets a `count` variable passed in.

Ideally expressions in `.input` should also specify a [function](/docs/reference/functions).
like `:string`, `:number`, or `:datetime`. These functions are not type assertions.
They act as type coercions, returning a new value of the specified type
based on the operand (or signaling an error if no coercion is possible).
This also means that formatting options can be specified in the
function.

<mf2-interactive>

```mf2
.input {$amount :number style=currency currency=USD}
{{The price is: {$amount}.}}
```

```json
{ "amount": 32 }
```

</mf2-interactive>

Selector options can also be specified in the function:

<mf2-interactive>

```mf2
.input {$rank :number select=ordinal}
.match $rank
one {{This is the {$rank}st most expensive item}}
two {{This is the {$rank}nd most expensive item}}
few {{This is the {$rank}rd most expensive item}}
*   {{This is the {$rank}th most expensive item}}
```

```json
{ "rank": 32 }
```

</mf2-interactive>

When the function in the `.input` declaration is later used
as a selector, any options attached to it are carried to any
`.match` statement that uses the declared variable.

### Shadowing and redeclaration

If a local variable has the same name as an external input value,
the local variable shadows the external one. That is, the meaning
of any subsequent references to the variable name is the value
bound to the _local_ variable.

<mf2-interactive>

```mf2
.local $count = {42}
{{The count is: {$count}}}
```

```json
{ "count": 32 }
```

</mf2-interactive>

Variables can also only be declared once within a message. Redeclaring a
variable will result in an error.

<mf2-interactive>

```mf2
.local $count = {42}
.local $count = {32}
{{The count is: {$count}}}
```

</mf2-interactive>

The same rule applies to `.input` declarations:

<mf2-interactive>

```mf2
.input {$count :number}
.local $count = {32}
{{The count is: {$count}}}
```

```json
{ "count": 32 }
```
</mf2-interactive>

The `.local` declaration causes an error because there is already
an `.input` declaration for `$count`. The same thing happens if
the `.local` and `.input` declarations are swapped:

<mf2-interactive>

```mf2
.local $count = {32}
.input {$count :number}
{{The count is: {$count}}}
```

```json
{ "count": 32 }
```
</mf2-interactive>


Another rule is that referring to an external input variable creates an
_implicit_ declaration, and the "variables can only be declared once"
rule applies to implicit declarations as well:

<mf2-interactive>

```mf2
.local $count1 = {$count}
.local $count = {32}
{{The count is: {$count}}}
```

</mf2-interactive>

Notice that this also causes a "duplicate declaration" error, even though
there was no `.local` declaration for `$count` before it was used in
the declaration of `$count1`. Why? Because when `$count` is first used,
that creates an _implicit_ declaration of `$count`; so the subsequent
`.local $count` declaration is considered a duplicate declaration.
