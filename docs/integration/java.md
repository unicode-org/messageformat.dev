---
title: Using MF2 with Java
sidebar_title: Java
---

A Technical Preview implementation of MF2 is available in ICU,
the International Components for Unicode library.
Beginning with version 75.0, ICU includes MF2
implementations in Java and [C++](/docs/integration/cpp).

For documentation on the Java implementation, see
[the ICU API guide](https://unicode-org.github.io/icu-docs/apidoc/released/icu4j/com/ibm/icu/message2/package-summary.html).
For more introductory content, see the [ICU User Guide](https://unicode-org.github.io/icu/userguide/)
page on [using MF2 with ICU in Java](https://unicode-org.github.io/icu/userguide/format_parse/messages/mf2.html).
This page may not be as up-to-date as this documentation
and some examples may use an older version of the MF2 syntax.

## Quick start

The following instructions use command-line tools and presume a Linux system.

The Tech Preview implementation of MF2 in ICU4J continues to evolve,
so to ensure consistency with this documentation, it's best to build ICU
from source. Building ICU takes some time, but only needs to be done
once (unless further changes occur to the API).

```bash
git clone https://github.com/unicode-org/icu.git
cd icu/icu4j
mvn package -DskipTests
```

The last command builds the `.jar` files for ICU4J in a subdirectory
of the `icu` directory that the git checkout uses.
It's best to avoid installing globally, since it may override the version
of ICU that comes with your distribution, and break things that depend on ICU.

> If you don't want to build ICU from source, ICU 76 should be
> fairly close to the version of the MessageFormat syntax and APIs
> described on this site, but some differences may exist, such as
> the syntax of `.match` (whether it selects on expressions or variables).
> As of this writing, ICU 76 is a release candidate that can be
> downloaded [from github](https://unicode-org.github.io/icu/download/).
> In the future, it might be sufficient to upgrade ICU using your
> system package manager.

### A simple client program

Now, let's write a simple program that uses the MF2 API

```java
import com.ibm.icu.message2.MessageFormatter;
import java.util.HashMap;
import java.util.Map;

public final class TestMessageFormat {

    private static final boolean testMessageFormat() {
        MessageFormatter mf = MessageFormatter.builder()
            .setPattern("Hello, {$userName}!").build();

        Map<String, Object> arguments = new HashMap<>();
        arguments.put("userName", "John");

        String result = mf.formatToString(arguments);
        return result.equals("Hello, John!");
    }

    public static void main(String[] argv) {
        System.exit(testMessageFormat() ? 0 : 1);
    }

}
```

Before we look at how to compile and run this program,
let's go through what it does.

#### `MessageFormatter.builder()`

The call to `MessageFormatter.builder()` creates a mutable builder
object. `MessageFormatter` is immutable, so like other immutable
classes in ICU, it's constructed using the builder pattern.
The code immediately calls `setPattern()` on the builder to set
the message for this formatter, and then calls `build()`,
giving an immutable `MessageFormatter` object.

#### Message arguments

In ICU4J, message arguments are simply a Java `Map` with string
keys and `Object` values. The code creates an argument map called
`arguments`, then adds an argument to it with the name `"userName"`
and value `"John"`.

#### Formatting to string

Finally, we call the `MessageFormatter`'s `formatToString()` method
on the arguments. Note that the message (pattern) is fixed for each
`MessageFormatter` objects, but it can be called repeatedly on
different argument maps, so the same formatter can be applied to
different arguments.

### Building and running the program

To compile this program, save it to a file named `TestMessageFormat.java`.
Then set your `CLASSPATH` to include the main `.jar` file for ICU:

```bash
declare -x CLASSPATH=$HOME/icu/icu4j/main/core/target/core-76.1-SNAPSHOT.jar:$CLASSPATH
```

This line will need to be changed according to the ICU version
you are using -- in this case, version 76.1.

And finally, compile and run the program with:

```bash
java TestMessageFormat.java
```

You can ignore the deprecation warnings, as these are just telling you
that the MF2 API is a tech preview API that should not be depended on
in production.

> For more complicated experiments, you'll want to use Maven or your
> preferred build system. See [the ICU user guide](https://unicode-org.github.io/icu/userguide/icu4j/).
> As a reminder, you will need to build ICU from source and depend
> on it in your project in order to use the MF2 syntax as described
> in this documentation.

This program has no output, but you can check the exit code
to see that the string comparison succeeded and the output of
the formatter was correct:

```bash
$ echo $?
0
```

