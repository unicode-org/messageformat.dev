---
title: Scientific notation
description: Print numbers in scientific notation, such as 1.001E2.
related:
  - examples/numbers/rounding-and-precision/
---

<mf2-interactive>

```mf2
{ 100.100 :number notation=scientific }
```

</mf2-interactive>

[Scientific notation](https://en.wikipedia.org/wiki/Scientific_notation) is a
way of expressing numbers that are too large or too small to be conveniently
written in decimal form. It is commonly used in scientific applications.

To print a number in scientific notation, use the `:number` function with the
`notation=scientific` option.
