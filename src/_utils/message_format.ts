import {
  MessageExpressionPart,
  MessageFormat,
} from "npm:messageformat@4.0.0-8";

export { MessageFormat };

export function formatMessageToHTML(
  { output, message, data }: {
    output: HTMLElement;
    message: MessageFormat;
    data: Record<string, unknown>;
  },
) {
  const errors: string[] = [];

  try {
    const parts = message.formatToParts(
      data,
      // deno-lint-ignore no-explicit-any
      (error) => errors.push((error as any).message),
    );
    let currentElement: HTMLElement = output;
    for (const part of parts) {
      if (part.type === "markup" && "kind" in part) {
        if (part.kind === "standalone" && part.name === "star-icon") {
          const starIcon = document.createElement("span");
          starIcon.textContent = "⭐";
          currentElement.appendChild(starIcon);
          continue;
        } else if (part.kind === "open" || part.kind === "standalone") {
          switch (part.name) {
            case "bold": {
              const bold = document.createElement("strong");
              currentElement.appendChild(bold);
              currentElement = bold;
              break;
            }
            case "italic": {
              const italic = document.createElement("em");
              currentElement.appendChild(italic);
              currentElement = italic;
              break;
            }
            case "error": {
              const errored = document.createElement("span");
              errored.classList.add("text-red-600");
              currentElement.appendChild(errored);
              currentElement = errored;
              break;
            }
            case "link": {
              const link = document.createElement("a");
              link.href = part.options?.to as string;
              link.target = "_blank";
              link.rel = "noopener noreferrer";
              currentElement.appendChild(link);
              currentElement = link;
              break;
            }
            default: {
              errors.push(`Unknown markup: ${part.name}`);
            }
          }
        }
        if (part.kind === "close" || part.kind === "standalone") {
          if (currentElement === output) {
            errors.push(`Unexpected close: ${part.name}`);
          }
          switch (part.name) {
            case "bold": {
              if (currentElement.tagName !== "STRONG") {
                errors.push(`Unexpected close: ${part.name}`);
              }
              break;
            }
            case "italic": {
              if (currentElement.tagName !== "EM") {
                errors.push(`Unexpected close: ${part.name}`);
              }
              break;
            }
            case "error": {
              if (!currentElement.classList.contains("text-red-600")) {
                errors.push(`Unexpected close: ${part.name}`);
              }
              break;
            }
            case "link": {
              if (currentElement.tagName !== "A") {
                errors.push(`Unexpected close: ${part.name}`);
              }
              break;
            }
            default: {
              errors.push(`Unknown markup: ${part.name}`);
              continue;
            }
          }
          currentElement = currentElement.parentElement!;
        }
      } else {
        const p = part as MessageExpressionPart;
        let text = "";
        if (p.parts !== undefined) {
          for (const part of p.parts) {
            if (part.value !== undefined) {
              text += String(part.value);
            } else {
              text = String(`{${p.source}}`);
              break;
            }
          }
        } else if (p.value !== undefined) {
          text = String(p.value);
        } else {
          text = `{${p.source}}`;
        }
        currentElement.appendChild(document.createTextNode(text));
      }
    }
    if (currentElement !== output) {
      errors.push("Unclosed markup");
    }

    return errors;
  } catch (e) {
    errors.push((e as Error).message);
    return errors;
  }
}
