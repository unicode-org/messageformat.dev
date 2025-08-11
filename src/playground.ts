import locales from "npm:locale-codes@1.3.1";
import { LocalHighlightRegistry } from "@nic/local-highlight-registry";
import { formatMessageToHTML, MessageFormat } from "./_utils/message_format.ts";
import { type HighlightedTextarea } from "./textarea.ts";

import "./textarea.ts";
import { mf2Highlight } from "./highlighters/mf2.ts";
import { jsonHighlight } from "./highlighters/json.ts";

globalThis.addEventListener("DOMContentLoaded", () => {
  const supportedLocales = locales.all
    .map((locale) => {
      if (locale.location == null) return null;
      try {
        return {
          locale: new Intl.Locale(locale.tag),
          name: locale.name,
          region: locale.location,
        };
      } catch {
        return null;
      }
    })
    .filter((locale) => locale !== null) as {
      locale: Intl.Locale;
      name: string;
      region: string;
    }[];

  const localeSelect = document.getElementById("locale") as HTMLSelectElement;
  const shareButton = document.getElementById("share") as HTMLButtonElement;
  const messageArea = document.getElementById("message") as HighlightedTextarea;
  const messageErrors = document.getElementById(
    "message-errors",
  ) as HTMLDivElement;
  const messagePopup = document.getElementById(
    "message-popup",
  ) as HTMLDivElement;
  const dataArea = document.getElementById("data") as HighlightedTextarea;
  const dataErrors = document.getElementById("data-errors") as HTMLDivElement;
  const outputArea = document.getElementById("output") as HTMLDivElement;
  const outputErrors = document.getElementById(
    "output-errors",
  ) as HTMLDivElement;

  localeSelect.addEventListener("change", onUpdate);
  shareButton.addEventListener("click", share);
  messageArea.addEventListener("input", onUpdate);
  dataArea.addEventListener("input", onUpdate);

  let currentMessageErrors: string[] = [];

  messageArea.highlighter = function* (code) {
    const highlights = mf2Highlight(code);
    currentMessageErrors = [];
    for (const token of highlights) {
      if (token.label === "error") {
        currentMessageErrors.push(token.diagnostic!);
      }
      yield token;
    }
  };

  function* merge<T>(it1: Iterable<T>, it2: Iterable<T>): IterableIterator<T> {
    yield* it1;
    yield* it2;
  }

  const messageVariablesBackgrounds = new LocalHighlightRegistry();
  messageArea.addEventListener("hoverchange", ({ detail }) => {
    messageVariablesBackgrounds.clear();
    for (const [token, range] of merge(detail.preserved, detail.added)) {
      if (token.label === "variable") {
        messageVariablesBackgrounds.add("variable-hover", range, 1);
      }
      if (token.label === "error") {
        messageVariablesBackgrounds.add("error-hover", range, 1);
      }
    }
  });

  messageArea.addEventListener("hoverchange", ({ detail }) => {
    for (const [token, range] of merge(detail.preserved, detail.added)) {
      if (token.label !== "error") continue;

      messagePopup.textContent = token.diagnostic!;
      messagePopup.removeAttribute("hidden");

      const rect = range.getBoundingClientRect();
      messagePopup.style.top = `calc(${rect.top + rect.height}px + 0.25em)`;
      messagePopup.style.left = `${rect.left}px`;

      return;
    }
    messagePopup.setAttribute("hidden", "");
  });

  messageArea.addEventListener("input", () => {
    messageVariablesBackgrounds.clear();
    messagePopup.setAttribute("hidden", "");
  });

  dataArea.highlighter = jsonHighlight;

  localeSelect.innerHTML = "";

  for (const { locale, name, region } of supportedLocales) {
    const option = document.createElement("option");
    option.value = locale.baseName;
    option.textContent = `${name} (${region})`;
    if (locale.baseName === "en-US") {
      option.selected = true;
    }
    localeSelect.appendChild(option);
  }

  const hash = globalThis.location.hash.slice(1);
  try {
    if (hash) {
      const [encodedMessage, encodedData, encodedLocale] = hash.split(".");
      const message = atob(encodedMessage);
      const data = atob(encodedData);
      const locale = atob(encodedLocale);
      messageArea.value = message;
      dataArea.value = data;
      localeSelect.value = locale;
      onUpdate();
    }
  } catch (_) {
    // Ignore errors
  }

  function share() {
    navigator.clipboard.writeText(globalThis.location.href);
    shareButton.textContent = "Copied!";
    setTimeout(() => {
      shareButton.textContent = "Share";
    }, 1000);
  }

  function onUpdate() {
    const locale = localeSelect.value;
    const message = messageArea.value;
    const data = dataArea.value;

    messageErrors.textContent = "";
    messageErrors.hidden = true;
    dataErrors.textContent = "";
    dataErrors.hidden = true;
    outputArea.textContent = "";
    outputErrors.textContent = "";
    outputErrors.hidden = true;

    let mf2: MessageFormat | null = null;

    if (currentMessageErrors.length > 0) {
      messageErrors.textContent = currentMessageErrors.join("\n");
      messageErrors.hidden = false;
    } else {
      try {
        mf2 = new MessageFormat(locale, message);
      } catch (e) {
        messageErrors.textContent = (e as Error).message;
        messageErrors.hidden = false;
      }
    }

    let dataObj: Record<string, unknown> = {};
    try {
      dataObj = JSON.parse(data);
    } catch (e) {
      dataErrors.textContent = (e as Error).message;
      dataErrors.hidden = false;
    }

    if (mf2 !== null) {
      const errors = formatMessageToHTML({
        output: outputArea,
        message: mf2,
        data: dataObj,
      });
      if (errors.length > 0) {
        outputErrors.textContent = errors.join("\n");
        outputErrors.hidden = false;
      }
    }

    const encodedMessage = btoa(messageArea.value);
    const encodedData = btoa(dataArea.value);
    const encodedLocale = btoa(localeSelect.value);
    const hash = `#${encodedMessage}.${encodedData}.${encodedLocale}`
      .replaceAll("/", "_").replaceAll("+", "-").replaceAll("=", "");
    history.replaceState(null, "", hash);
  }
});
