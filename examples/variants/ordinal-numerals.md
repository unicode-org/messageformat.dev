---
title: Ordinal numerals
description: Display ordinal numerals for given numbers, such as `1st`, `2nd`, `3rd`, etc.
---

<mf2-interactive>

```mf2
.input {$number :number select=ordinal}
.match $number
  one {{The {$number}st item.}}
  two {{The {$number}nd item.}}
  few {{The {$number}rd item.}}
  *   {{The {$number}th item.}}
```

```json
{ "number": 1 }
```

</mf2-interactive>

Ordinal numerals are a way of expressing numbers as a position in a sequence.
They are commonly used in lists, rankings, and other ordered collections.

In English, the ordinal numerals are formed by adding a suffix to the number.
For numbers ending in 1, 2, and 3, the suffixes are `st`, `nd`, and `rd`,
respectively (with exceptions for 11, 12, and 13). For all other numbers, the
suffix is `th`.

In many other languages, the rules for forming ordinal numerals are different.
Some languages have just one suffix, like German or Dutch with `te` or `de`,
respectively.

The
[full set of ordinal rules](https://www.unicode.org/cldr/charts/47/supplemental/language_plural_rules.html)
for each locale is defined in the Unicode Common Locale Data Repository (CLDR).
