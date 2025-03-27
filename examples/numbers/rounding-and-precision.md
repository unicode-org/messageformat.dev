---
title: Rounding and precision
description: Round numbers to a specific number of decimal places or significant digits.
related:
  - examples/numbers/scientific-notation/
---

## Fractional digits

Fractional digits are the number of digits to the right of the decimal point in
a number.

<mf2-interactive>

```mf2
{ 3.12345 :number maximumFractionDigits=2 }
```

</mf2-interactive>

<mf2-interactive>

```mf2
{ 3 :number minimumFractionDigits=3 }
```

</mf2-interactive>

When using the `minimumFractionDigits` option, any missing decimal places in the
original number are filled with zeros.

## Significant digits

[Significant digits](https://en.wikipedia.org/wiki/Significant_figures) are the
number of digits that carry meaning in a number. They are used to indicate the
precision of a measurement or calculation.

Any leading zeros are not considered significant. For example, `0.00123` has 3
significant digits, while `0.001230` has 4 significant digits.

<mf2-interactive>

```mf2
{ 12.34 :number maximumSignificantDigits=3 }
```

</mf2-interactive>

<mf2-interactive>

```mf2
{ 3 :number minimumSignificantDigits=3 }
```

</mf2-interactive>

When using the `minimumSignificantDigits` option, any missing significant digits
in the original number are filled with zeros.
