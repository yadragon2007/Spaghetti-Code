let current = null;

export function stopVoice() {
  if (current) current.pause();
  current = null;
}

/* plays a voice file. Resolves with:
   "ended"   - it finished playing
   "blocked" - the browser needs a tap first
   "error"   - the file couldn't be loaded or played */
export function playVoice(src, volume = 1) {
  stopVoice();
  return new Promise((resolve) => {
    const a = new Audio(src);
    a.volume = volume;
    current = a;
    a.addEventListener("ended", () => resolve("ended"), { once: true });
    a.addEventListener("error", () => resolve("error"), { once: true });
    a.play().catch((err) =>
      resolve(err.name === "NotAllowedError" ? "blocked" : "error")
    );
  });
}

/* resolves on the user's first tap, click or key press */
export function waitForTap() {
  const events = ["click", "touchend", "keydown"];
  return new Promise((resolve) => {
    const go = () => {
      events.forEach((e) => window.removeEventListener(e, go));
      resolve();
    };
    events.forEach((e) => window.addEventListener(e, go));
  });
}