let onReadyCbs: (() => void)[] | null = [];

document.addEventListener("DOMContentLoaded", () => {
  document.fonts.ready.then(() => {
    arrows();
    for (const fn of onReadyCbs!) fn();
    onReadyCbs = null;
  });
});

// For each note, find the element it points to. Attach an intersection
// observer to the pointee, and when it intersects, show the note and the
// arrow.
function arrows() {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const target = entry.target as HTMLElement;
      observer.unobserve(target);

      const note = document.querySelector<HTMLElement>(
        `[data-arrow-to="${target.id}"]`,
      );
      if (note) {
        setTimeout(() => {
          note.dataset.arrowAttached = "true";
          const line = new LeaderLine(
            note,
            target,
            {
              hide: true,
              path: note.dataset.arrowPath || "magnet",
              startSocket: note.dataset.arrowDirection || "left",
              endSocket: note.dataset.arrowTargetDirection || "top",
              color: "rgba(0, 0, 0, 0.5)",
              size: 3,
            },
          );
          setTimeout(() => line.show("draw"), 200);
        }, 200);
      }
    }
  });

  const notes = document.querySelectorAll<HTMLElement>("[data-arrow-to]");
  for (const note of notes) {
    const target = document.getElementById(note.dataset.arrowTo!);
    if (target) observer.observe(target);
  }
}

function rollingShutter(el: HTMLElement, modify: (el: HTMLElement) => void) {
  el.style.animation = "slideFadeOut .3s forwards";
  el.addEventListener("animationend", () => {
    modify(el);
    el.style.animation = "slideFadeIn .6s forwards";
    el.addEventListener("animationend", () => {
      el.style.animation = "";
    }, { once: true });
  }, { once: true });
}

function onReady(fn: () => void) {
  if (onReadyCbs) onReadyCbs.push(fn);
  else fn();
}

// @ts-expect-error Can't be bothered to type this
globalThis.rollingShutter = rollingShutter;
// @ts-expect-error Can't be bothered to type this
globalThis.onReady = onReady;
