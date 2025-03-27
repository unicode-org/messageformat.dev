---
title: Padding with zeros
description: Pad numbers with zeros to a specific width.
related:
  - examples/numbers/rounding-and-precision/
---

<mf2-interactive>

```mf2
{ 3 :number minimumIntegerDigits=3 }
```

</mf2-interactive>

Some applications require numbers to be padded with zeros to a specific width.
This is often the case when numbers are displayed in a fixed-width font or
formatted as part of a larger string.

The minimum number of integer digits can be specified using the
`minimumIntegerDigits` option. Any missing digits are filled with zeros.
