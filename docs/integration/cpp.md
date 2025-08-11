---
title: Using MF2 with C++
sidebar_title: C++
---

A Technical Preview implementation of MF2 is available in ICU,
the International Components for Unicode library.
Beginning with version 75.0, ICU includes MF2
implementations in C++ and [Java](/docs/integration/java).

For comprehensive documentation on the C++ implementation, see
[the ICU API guide](https://unicode-org.github.io/icu-docs/apidoc/released/icu4c/classicu_1_1message2_1_1MessageFormatter.html).
The [ICU User Guide](https://unicode-org.github.io/icu/userguide/) contains
general information on using ICU, but has not yet been updated to include
MF2 documentation.

## Quick start

The following instructions presume using the `clang` C/C++
compiler on a Linux system.

The Tech Preview implementation of MF2 in ICU4C continues to evolve,
so to ensure consistency with this documentation, it's best to build ICU
from source. Building ICU takes some time, but only needs to be done
once (unless further changes occur to the API).

```bash
git clone https://github.com/unicode-org/icu.git
cd icu
../icu4c/source/runConfigureICU Linux/clang  --disable-renaming \
    --prefix=$HOME/icu76
make          # or make -j8 to build in parallel on 8 cores
make install
```

ICU is now installed in the `icu76` subdirectory of your home directory.
Avoid installing globally, since it may override the version of ICU that
comes with your distribution, and break things that depend on ICU.

> If you don't want to build ICU from source, ICU 76 should be
> fairly close to the version of the MessageFormat syntax and APIs
> described on this site, but some differences may exist, such as
> the syntax of `.match` (whether it selects on expressions or variables).
> As of this writing, ICU 76 is a release candidate that can be
> downloaded [from GitHub](https://unicode-org.github.io/icu/download/).
> In the future, it might be sufficient to upgrade ICU using your
> system package manager.

### A simple client program

Next, let's write a simple program that uses the MF2 API:

```cpp
#define U_DISABLE_RENAMING 1

#include <unicode/messageformat2.h>

using namespace icu;
using namespace message2;

bool testMessageFormat() {
    UErrorCode errorCode = U_ZERO_ERROR;
    UParseError parseError;

    MessageFormatter::Builder builder(errorCode);
    UnicodeString pattern = "Hello, {$userName}!";
    MessageFormatter mf =
        builder.setPattern(pattern, parseError, errorCode)
               .build(errorCode);

    std::map<UnicodeString, message2::Formattable> argMap;
    argMap["userName"] = message2::Formattable("John");
    MessageArguments args(argMap, errorCode);

    UnicodeString result = mf.formatToString(args, errorCode);
    return (result == "Hello, John!");
}

int main() {
    return testMessageFormat() ? 0 : 1;
}

```

> **The line `#define U_DISABLE_RENAMING 1` is important** if you installed ICU
> from source. Without it, you may see linker
> errors due to the library defining symbols in the `icu` namespace while your code relies
> on symbols in the `icu_76` namespace.

Before we look at how to compile and run this program,
let's go through what it does.

#### Error handling

The line beginning with `UErrorCode errorCode` sets up an error code
that will be passed by reference to all the MessageFormat functions.
ICU4C does not use exceptions, so this mechanism is used for signaling errors.
By default, the MF2 API provides fallback output for certain types of errors,
while other types of errors (syntax errors and data model errors) are a
hard failure. The message embedded in this program doesn't contain any
errors, so we won't go into detail here. The error code is also used to
signal errors that could happen at lower layers of ICU, like a memory
allocation failure.

The next line, beginning with `UParseError`, sets up a data structure
that is used by the MF2 parser in case the message contains any parse
errors. In that case, the structure will be set to contain a line and
column number. There's no need to worry about that yet, since this
message has no syntax errors.

For more details, see the [ICU FAQ](https://unicode-org.github.io/icu/userguide/icu4c/faq.html#how-are-errors-handled-in-icu)
on error handling.

#### `MessageFormatter::Builder`

In the next line, we start invoking the MF2 API. The `MessageFormatter`
class is immutable, so like other immutable classes in ICU, it's
constructed using the builder pattern. `builder` is now bound to a
mutable `MessageFormatter::Builder` object.

Next, we declare a C++ variable holding a message, using
ICU's `UnicodeString` type:

```cpp
UnicodeString pattern = "Hello, {$userName}!";
```

The next line creates a `MessageFormatter` object by first calling
`setPattern()` on the builder, and then `build()`. The builder
methods can all be chained. We now have a `MessageFormatter` that
has our desired message built into it.

For more details, see the API documentation on [`MessageFormatter`](https://unicode-org.github.io/icu-docs/apidoc/released/icu4c/classicu_1_1message2_1_1MessageFormatter.html)
and [`MessageFormatter::Builder`](https://unicode-org.github.io/icu-docs/apidoc/released/icu4c/classicu_1_1message2_1_1MessageFormatter_1_1Builder.html).

#### Arguments and `Formattable`

Since this message has a variable, `$userName`, that is not declared
as a `.local`, we need to provide it as an external argument.
This is done using the `MessageArguments` class. The line beginning
with `std::map` creates a C++ map object where the keys are
`UnicodeStrings` and the values are `Formattable` objects.
The next line sets the `userName` key in the map to `"John"`.

It's a little more complicated than that, because the
`message2::Formattable` class has to be used to represent the values
of arguments to the message. This is basically a wrapper class that
allows arguments to have different types. Usually, calling the
`Formattable` constructor as in the example just works.

> The class `Formattable` is referred to explicitly as
> `message2::Formattable` because there is a separate `icu::Formattable`
> class that is different.

The next line constructs a `MessageArguments` object from the
`std::map` we just created. This is necessary for internal reasons.

For more details, see the API documentation on
[`MessageArguments`](https://unicode-org.github.io/icu-docs/apidoc/released/icu4c/classicu_1_1message2_1_1MessageArguments.html)
and [`message2::Formattable`](https://unicode-org.github.io/icu-docs/apidoc/released/icu4c/classicu_1_1message2_1_1Formattable.html).

#### Formatting to string

Finally, we call the `MessageFormatter`'s `formatToString()` method
on the arguments. Note that the message (pattern) is fixed for each
`MessageFormatter` object, but it can be called repeatedly on
different `MessageArguments` objects, so the same formatter can be
applied to different arguments.

The last line returns a boolean indicating whether the output of
the message formatter was the expected value, specifically `"Hello, John!"`.
The `main()` method in the program sets the shell exit code based on
the return value of our test method.

### Building and running the program

To compile this program, save it to a file named `testmessageformat.cpp` and
use the following command:

```bash
clang++  -I$HOME/icu76/include -L$HOME/icu76/lib \
  -o testmessageformat testmessageformat.cpp \
  -licui18n -licuuc -licudata -licuio
```

> For more complicated experiments, you'll want to create a simple Makefile
> or use your preferred build system; the [ICU user guide](https://unicode-org.github.io/icu/userguide/icu/howtouseicu)
> has some information on integrating ICU with different build systems.

Before running the program, set your `LD_LIBRARY_PATH` so that the loader
knows where to search for the shared ICU library:

```bash
declare -x LD_LIBRARY_PATH=$HOME/icu76/lib
```

And then run the program with:

```bash
./testmessageformat
```

This program has no output, but you can check the exit code
to see that the string comparison succeeded and the output of
the formatter was correct:

```bash
$ echo $?
0
```
