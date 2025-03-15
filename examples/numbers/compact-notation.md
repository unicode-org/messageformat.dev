---
title: Compact notation
description: Print numbers in compact notation, such as 100K or 1.23M.
related:
  - examples/numbers/rounding-and-precision/
---

<mf2-interactive>

```mf2
{ 123456 :number notation=compact }
```

</mf2-interactive>

<mf2-interactive>

```mf2
{ 123456 :number notation=compact compactDisplay=long }
```

</mf2-interactive>

Compact notation is a way of expressing large numbers in a more concise form. It
is commonly used in financial and scientific applications.

The denominator of the compact form is a power of 10. In US English, examples
are 1,000 (K), 1,000,000 (M), or 1,000,000,000 (B). In other locales, different
denominators may be used, which may not always be a power of 1000. In India, for
example, 1,00,000 (L) is used to represent 100,000.

<mf2-interactive locale="en-IN">

```mf2
{ 123456 :number notation=compact }
```

</mf2-interactive>
