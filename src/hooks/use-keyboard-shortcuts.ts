import { useEffect } from "react";

interface KeyboardShortcutsConfig {
  onNext?: () => void;
  onShowHint?: () => void;
  onPlaySound?: () => void;
  onToggleSettings?: () => void;
  onToggleHelp?: () => void;
  isStarted?: boolean;
  isSettingsOpen?: boolean;
  isHelpOpen?: boolean;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onNext,
  onShowHint,
  onPlaySound,
  onToggleSettings,
  onToggleHelp,
  isStarted = false,
  isSettingsOpen = false,
  isHelpOpen = false,
  enabled = true,
}: KeyboardShortcutsConfig) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Global shortcuts (work even when not started)
      if (key === "s") {
        if (!isHelpOpen && onToggleSettings) {
          e.preventDefault();
          onToggleSettings();
        }
        return;
      }

      if (key === "?") {
        if (!isSettingsOpen && onToggleHelp) {
          e.preventDefault();
          onToggleHelp();
        }
        return;
      }

      // Practice shortcuts (only work when started and no dialogs open)
      if (isStarted && !isSettingsOpen && !isHelpOpen) {
        switch (key) {
          case " ":
          case "arrowright":
          case "n":
            if (onNext) {
              e.preventDefault();
              onNext();
            }
            break;
          case "h":
            if (onShowHint) {
              e.preventDefault();
              onShowHint();
            }
            break;
          case "p":
          case "v":
            if (onPlaySound) {
              e.preventDefault();
              onPlaySound();
            }
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    onNext,
    onShowHint,
    onPlaySound,
    onToggleSettings,
    onToggleHelp,
    isStarted,
    isSettingsOpen,
    isHelpOpen,
    enabled,
  ]);
}

// Standard shortcuts list for all learning pages
export const STANDARD_SHORTCUTS = [
  { key: "S", description: "開關設置" },
  { key: "?", description: "開關幫助" },
  { key: "Space / N / →", description: "下一個" },
  { key: "H", description: "顯示提示" },
  { key: "P / V", description: "播放發音" },
];
