import { formatMessageToHTML, MessageFormat } from "./_utils/message_format.ts";
import { jsonHighlight } from "./highlighters/json.ts";
import { mf2Highlight } from "./highlighters/mf2.ts";
import type { HighlightedTextarea } from "./textarea.ts";

import "./textarea.ts";

export class Mf2Interactive extends HTMLElement {
  #locale: string = "en-US";

  #originalCode: string = "";
  #originalData: string = "{}";

  #codeInput: HighlightedTextarea | null = null;
  #dataInput: HighlightedTextarea | null = null;
  #output: HTMLDivElement | null = null;
  #reset: HTMLButtonElement | null = null;
  #share: HTMLAnchorElement | null = null;

  #messageDiagnostics: string[] = [];

  constructor() {
    super();
  }

  connectedCallback() {
    this.#locale = this.attributes.getNamedItem("locale")?.value ??
      this.#locale;
    this.classList.add("ready");

    const codeEl = this.querySelector("code.language-mf2");
    const code = codeEl?.textContent ?? null;
    const dataEl = this.querySelector("code.language-json");
    const data = dataEl?.textContent ?? null;

    if (code !== null) {
      this.#codeInput = document.createElement(
        "highlighted-textarea",
      ) as HighlightedTextarea;
      this.#codeInput.highlighter = function* (
        this: Mf2Interactive,
        code: string,
      ) {
        const highlights = mf2Highlight(code);
        this.#messageDiagnostics = [];
        for (const token of highlights) {
          if (token.label === "error") {
            this.#messageDiagnostics.push(token.diagnostic!);
          }
          yield token;
        }
      }.bind(this);
      this.#codeInput.classList.add("code");
      this.#codeInput.classList.add("highlighted");
      this.#originalCode = this.#codeInput.value = code.replace(/\n$/, "");
      this.#codeInput.spellcheck = false;
      const codePreEl = codeEl!.parentElement!;
      codeEl!.remove();
      codePreEl.replaceWith(this.#codeInput);
      this.#codeInput.addEventListener("input", this.#onChange.bind(this));
    }

    if (data !== null) {
      this.#dataInput = document.createElement(
        "highlighted-textarea",
      ) as HighlightedTextarea;
      this.#dataInput.highlighter = jsonHighlight;
      this.#dataInput.classList.add("data");
      this.#dataInput.classList.add("highlighted");
      this.#originalData = this.#dataInput.value = data.replace(/\n$/, "");
      this.#dataInput.spellcheck = false;
      const dataPreEl = dataEl!.parentElement!;
      dataEl!.remove();
      dataPreEl.replaceWith(this.#dataInput);
      this.#dataInput.addEventListener("input", this.#onChange.bind(this));
    }

    const header = document.createElement("div");
    header.classList.add("header");
    const title = document.createElement("span");
    title.classList.add("title");
    title.textContent = "TRY IT OUT";
    const actions = document.createElement("div");
    this.#reset = document.createElement("button");
    this.#reset.classList.add("reset");
    this.#reset.disabled = true;
    this.#reset.innerHTML =
      `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 0.825rem; height: 0.825rem"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg> Reset`;
    actions.appendChild(this.#reset);
    this.#reset.addEventListener("click", () => {
      this.#reset!.disabled = true;
      if (this.#codeInput !== null) {
        this.#codeInput.value = this.#originalCode;
      }
      if (this.#dataInput !== null) {
        this.#dataInput.value = this.#originalData;
      }
      this.#onChange();
    });
    const locale = document.createElement("span");
    locale.classList.add("locale");
    locale.textContent = this.#locale;
    actions.appendChild(locale);
    this.#share = document.createElement("a");
    this.#share.classList.add("share");
    this.#share.innerHTML =
      `Playground <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 0.825rem; height: 0.825rem"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
`;
    actions.appendChild(this.#share);
    header.appendChild(title);
    header.appendChild(actions);
    this.insertBefore(header, this.firstChild);

    this.#output = document.createElement("div");
    this.#output.classList.add("output");
    this.appendChild(this.#output);

    this.#onChange();
  }

  #onChange() {
    if (
      this.#codeInput === null || this.#output === null || this.#share === null
    ) {
      return;
    }

    const code = this.#codeInput.value;
    const data = this.#dataInput?.value ?? "{}";

    this.#reset!.disabled = code === this.#originalCode &&
      data === this.#originalData;

    this.#output.classList.remove("error");
    this.#output.innerHTML = "";

    const encodedMessage = btoa(code);
    const encodedData = btoa(data);
    const encodedLocale = btoa(this.#locale);
    const hash = `#${encodedMessage}.${encodedData}.${encodedLocale}`
      .replaceAll("/", "_").replaceAll("+", "-").replaceAll("=", "");
    this.#share.href = `/playground/${hash}`;

    let message!: MessageFormat;
    let dataObj!: Record<string, unknown>;
    let errors: string[] = [];

    if (this.#messageDiagnostics.length > 0) {
      errors = this.#messageDiagnostics;
    } else {
      try {
        message = new MessageFormat(this.#locale, code);
      } catch (e) {
        errors = [(e as Error).message];
      }
    }

    try {
      dataObj = JSON.parse(data);
    } catch (e) {
      errors.push((e as Error).message);
    }

    if (errors.length === 0) {
      errors = formatMessageToHTML({
        output: this.#output,
        message,
        data: dataObj,
      });
    }

    if (errors.length > 0) {
      this.#output.classList.add("error");
      this.#output.textContent = errors.join("\n");
    }
  }
}

customElements.whenDefined("highlighted-textarea").then(() => {
  customElements.define("mf2-interactive", Mf2Interactive);
});
