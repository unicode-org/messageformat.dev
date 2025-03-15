---
title: Displaying or hiding the sign
description: (Forcibly) display or hide the sign of a number.
---

<mf2-interactive>

```mf2
{ 1 :number signDisplay=always }
{ -1 :number signDisplay=always }
```

</mf2-interactive>

<mf2-interactive>

```mf2
{ 1 :number signDisplay=never }
{ -1 :number signDisplay=never }
```

</mf2-interactive>

By default, positive numbers are not prefixed with a sign, while negative
numbers are prefixed with a minus sign.

The `signDisplay` option can be used to forcibly display or hide the sign of a
number. The possible values are:

- `auto` (default): Display the sign only for negative numbers, including
  negative zero.
- `always`: Always display the sign, even for positive numbers, and positive
  zero.
- `never`: Never display the sign, even for negative numbers, and negative zero.
- `exceptZero`: Display the sign for all numbers, except for zero.
- `negative`: Display the sign only for negative numbers, but not for negative
  zero.

> Floating-point numbers distinguish between positive and negative zero. In
> modes `auto` and `always`, the sign of negative zero is displayed. If you do
> not want to display the sign for negative zero, use `negative` instead of
> `auto`, or `exceptZero` instead of `always`.
