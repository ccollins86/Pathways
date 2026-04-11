const HAVE_ENOUGH_DATA = 4;
const pendingListeners = new WeakMap<HTMLAudioElement, () => void>();

export function createPreloadedAudio(src: string, volume = 0.5): HTMLAudioElement {
  const audio = new Audio(src);
  audio.preload = "auto";
  audio.volume = volume;
  return audio;
}

export function playPreloadedSound(audio: HTMLAudioElement | null, volume = 0.5): void {
  if (!audio) return;

  if (audio.readyState < HAVE_ENOUGH_DATA) {
    const prev = pendingListeners.get(audio);
    if (prev) {
      audio.removeEventListener("canplaythrough", prev);
    }
    const onReady = () => {
      audio.removeEventListener("canplaythrough", onReady);
      pendingListeners.delete(audio);
      audio.currentTime = 0;
      audio.volume = volume;
      audio.play().catch((e) => console.warn("Audio play failed:", e));
    };
    pendingListeners.set(audio, onReady);
    audio.addEventListener("canplaythrough", onReady);
    return;
  }

  audio.currentTime = 0;
  audio.volume = volume;
  audio.play().catch((e) => console.warn("Audio play failed:", e));
}
