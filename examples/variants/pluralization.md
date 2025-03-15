---
title: Pluralization
description: Display different messages based on the number of items.
---

<mf2-interactive>

```mf2
.input {$count :number}
.match $count
  0 {{There are no items.}}
  one {{There is one item.}}
  * {{There are {$count} items.}}
```

```json
{ "count": 1 }
```

</mf2-interactive>

Pluralization is a way of expressing different messages based on the number of
items. It is commonly used in user interfaces to provide feedback on the number
of items in a list, for example.

In different locales, the rules for pluralization can vary. In English, for
example, there are two plural forms: one for the singular and one for the
plural. In other languages, there may be more plural forms, such as a separate
form for zero, or for numbers ending in 2, 3, or 4.

In Czech, for example, the plural forms are:

- `one`: 1 item
- `few`: 2, 3, or 4 items
- `many`: numbers with a decimal part
- `other`: all integers 5 and up

<mf2-interactive locale="cs-CZ">

```mf2
.input {$count :number}
.match $count
  0   {{Zde nejsou žádné prvky.}}
  one {{Je zde jeden prvek.}}
  few {{Jsou zde {$count} prvky.}}
  many {{Jsou zde {$count} prvků.}}
  *    {{Jsou zde {$count} prvků.}}
```

```json
{ "count": 3 }
```

</mf2-interactive>

The
[full set of plural forms](https://www.unicode.org/cldr/charts/47/supplemental/language_plural_rules.html)
for each locale is defined in the Unicode Common Locale Data Repository (CLDR).
