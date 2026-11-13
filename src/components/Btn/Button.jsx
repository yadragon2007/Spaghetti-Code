import { useRef, useEffect } from "react";
import "./Button.css";

export default function Button({
  children,
  onClick,
  sound = "/soundEffects/BtnClickSoundEffect.mp3",
  volume = 0.5,
  className = "",
  ...props
}) {
  const audioRef = useRef(null);

  // preload the sound once so there's no delay on the first click
  useEffect(() => {
    audioRef.current = new Audio(sound);
    audioRef.current.volume = volume;
    audioRef.current.preload = "auto";
  }, [sound, volume]);

  const handleClick = (e) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0; // restart so rapid clicks still play
      audio.play().catch(() => {}); // ignore browser blocking errors
    }
    onClick?.(e);
  };

  return (
    <button className={`btn ${className}`} onClick={handleClick} {...props}>
      {children}
    </button>
  );
}