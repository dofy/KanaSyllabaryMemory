"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { KanaData } from "@/lib/kana-data";
import { LocalStorage } from "@/lib/local-storage";
import { FYType, type DisplayMode, type MemoObject } from "@/lib/types";
import { Github, Moon, Settings, Sun, Volume2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [kanaList, setKanaList] = useState<MemoObject[]>([]);
  const [displayKanaList, setDisplayKanaList] = useState<MemoObject[]>([]);
  const [usedKanaList, setUsedKanaList] = useState<MemoObject[]>([]);

  const [currentKana, setCurrentKana] = useState({
    id: "",
    displayText: "",
    remind: "",
  });

  const [isStarted, setIsStarted] = useState(false);
  const [showRemind, setShowRemind] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("mixed");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLearningMode, setIsLearningMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadKanaData();
  }, []);

  const loadKanaData = () => {
    const kd = new KanaData();
    const savedData = LocalStorage.load<MemoObject[]>("selectedData");
    const savedMode = LocalStorage.load<DisplayMode>("displayType");
    const savedLearningMode = LocalStorage.load<boolean>("learningMode");

    if (savedData) {
      setKanaList(savedData);
    } else {
      setKanaList(kd.getJP50());
    }

    if (savedMode) {
      setDisplayMode(savedMode);
    }

    if (savedLearningMode !== null) {
      setIsLearningMode(savedLearningMode);
    }
  };

  const refreshDisplayData = () => {
    const selected = kanaList.filter((k) => k.selected);
    setDisplayKanaList(selected);
    setUsedKanaList([]);
  };

  useEffect(() => {
    if (kanaList.length > 0) {
      refreshDisplayData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kanaList]);

  const toggleKanaSelection = (id: string) => {
    const updated = kanaList.map((k) =>
      k.id === id ? { ...k, selected: !k.selected } : k
    );
    setKanaList(updated);
    LocalStorage.save("selectedData", updated);
  };

  const selectKanasByType = (type: FYType, selected: boolean) => {
    const updated = kanaList.map((k) =>
      k.fyType === type ? { ...k, selected } : k
    );
    setKanaList(updated);
    LocalStorage.save("selectedData", updated);
  };

  const handleStart = () => {
    setIsStarted(true);
    getRandomKana();
  };

  const getRandomKana = () => {
    setShowRemind(isLearningMode);

    if (displayKanaList.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * displayKanaList.length);
    const selectedKana = displayKanaList[randomIndex];

    let displayText = "";

    switch (displayMode) {
      case "mixed":
        const rand = Math.round(Math.random());
        displayText =
          rand === 1 ? selectedKana.displayText : selectedKana.displayText2;
        break;
      case "hiragana":
        displayText = selectedKana.displayText;
        break;
      case "katakana":
        displayText = selectedKana.displayText2;
        break;
      case "romaji":
        displayText = selectedKana.remind;
        break;
      case "swap":
        const rand2 = Math.round(Math.random());
        displayText =
          rand2 === 1 ? selectedKana.displayText : selectedKana.displayText2;
        break;
    }

    // Smart remind logic based on what's displayed
    let remindText = "";
    if (displayText === selectedKana.displayText) {
      // Displaying Hiragana → show Katakana + Romaji
      remindText = `${selectedKana.displayText2}  ${selectedKana.remind}`;
    } else if (displayText === selectedKana.displayText2) {
      // Displaying Katakana → show Hiragana + Romaji
      remindText = `${selectedKana.displayText}  ${selectedKana.remind}`;
    } else if (displayText === selectedKana.remind) {
      // Displaying Romaji → show Hiragana + Katakana
      remindText = `${selectedKana.displayText}  ${selectedKana.displayText2}`;
    }

    if (currentKana.displayText !== displayText) {
      setCurrentKana({
        id: selectedKana.id,
        displayText,
        remind: remindText,
      });

      if (displayKanaList.length > 1) {
        const newDisplay = [...displayKanaList];
        const removed = newDisplay.splice(randomIndex, 1);
        setDisplayKanaList(newDisplay);
        setUsedKanaList([...usedKanaList, ...removed]);
      }
    } else if (displayKanaList.length > 1) {
      getRandomKana();
    } else {
      setDisplayKanaList([...displayKanaList, ...usedKanaList]);
      setUsedKanaList([]);
    }
  };

  const playSound = (id: string) => {
    if (audioRef.current) {
      audioRef.current.src = `/assets/${id}.mp3`;
      audioRef.current
        .play()
        .catch((err) => console.error("Audio play error:", err));
    }
  };

  const handleDisplayModeChange = (mode: DisplayMode) => {
    setDisplayMode(mode);
    LocalStorage.save("displayType", mode);
  };

  const handleLearningModeChange = (isLearning: boolean) => {
    setIsLearningMode(isLearning);
    LocalStorage.save("learningMode", isLearning);
    if (isStarted) {
      setShowRemind(isLearning);
    }
  };

  const goToGitHub = () => {
    window.open("https://github.com/dofy/KanaSyllabaryMemory", "_blank");
  };

  if (!mounted) return null;

  const seionCount = kanaList.filter(
    (k) => k.fyType === FYType.seion && k.selected
  ).length;
  const dakuonCount = kanaList.filter(
    (k) => k.fyType === FYType.dakuon && k.selected
  ).length;
  const yoonCount = kanaList.filter(
    (k) => k.fyType === FYType.yoon && k.selected
  ).length;

  return (
    <main className="min-h-screen flex flex-col sm:items-center sm:justify-center p-0 sm:p-6 md:p-8">
      <audio ref={audioRef} />

      <div className="w-full max-w-2xl flex flex-col sm:block h-screen sm:h-auto sm:space-y-6">
        {/* Header */}
        <div className="relative px-4 pt-4 pb-3 sm:px-0 sm:pt-0 sm:pb-0 border-b sm:border-b-0">
          {/* Tool Buttons */}
          <div className="absolute top-4 right-4 sm:top-0 sm:right-0 flex gap-1.5 sm:gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
            <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 sm:h-10 sm:w-10"
                >
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
                <SheetHeader className="px-4 sm:px-6 pt-6 pb-4 border-b">
                  <SheetTitle>設置</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 mb-4">
                  <div className="space-y-5 sm:space-y-6">
                    {/* Learning Mode */}
                    <div className="space-y-2 sm:space-y-3">
                      <h3 className="font-semibold text-sm sm:text-base">
                        練習模式
                      </h3>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleLearningModeChange(true)}
                          className={`
                            flex-1 px-3 py-2 sm:px-4 sm:py-2.5
                            text-xs sm:text-sm
                            rounded-md
                            border
                            transition-all
                            ${
                              isLearningMode
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background hover:bg-accent hover:text-accent-foreground border-input"
                            }
                          `}
                        >
                          學習模式
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLearningModeChange(false)}
                          className={`
                            flex-1 px-3 py-2 sm:px-4 sm:py-2.5
                            text-xs sm:text-sm
                            rounded-md
                            border
                            transition-all
                            ${
                              !isLearningMode
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background hover:bg-accent hover:text-accent-foreground border-input"
                            }
                          `}
                        >
                          記憶模式
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {isLearningMode
                          ? "學習模式：自動顯示提示，適合初學者"
                          : "記憶模式：手動顯示提示，適合複習鞏固"}
                      </p>
                    </div>

                    {/* Display Mode */}
                    <div className="space-y-2 sm:space-y-3">
                      <h3 className="font-semibold text-sm sm:text-base">
                        顯示模式
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: "mixed", label: "混合" },
                          { value: "hiragana", label: "平假名" },
                          { value: "katakana", label: "片假名" },
                          { value: "romaji", label: "羅馬音" },
                          { value: "swap", label: "互換" },
                        ].map((mode) => (
                          <button
                            key={mode.value}
                            type="button"
                            onClick={() =>
                              handleDisplayModeChange(mode.value as DisplayMode)
                            }
                            className={`
                              px-3 py-1.5 sm:px-4 sm:py-2
                              text-xs sm:text-sm
                              rounded-md
                              border
                              transition-all
                              ${
                                displayMode === mode.value
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-background hover:bg-accent hover:text-accent-foreground border-input"
                              }
                            `}
                          >
                            {mode.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Kana Selection */}
                    <div className="space-y-2 sm:space-y-3">
                      <h3 className="font-semibold text-sm sm:text-base">
                        快速選擇
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">
                            清音 {seionCount}/46
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs h-7 px-2"
                              onClick={() =>
                                selectKanasByType(FYType.seion, true)
                              }
                            >
                              全選
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs h-7 px-2"
                              onClick={() =>
                                selectKanasByType(FYType.seion, false)
                              }
                            >
                              清空
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">
                            濁音 {dakuonCount}/25
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs h-7 px-2"
                              onClick={() =>
                                selectKanasByType(FYType.dakuon, true)
                              }
                            >
                              全選
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs h-7 px-2"
                              onClick={() =>
                                selectKanasByType(FYType.dakuon, false)
                              }
                            >
                              清空
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">
                            拗音 {yoonCount}/33
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs h-7 px-2"
                              onClick={() =>
                                selectKanasByType(FYType.yoon, true)
                              }
                            >
                              全選
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs h-7 px-2"
                              onClick={() =>
                                selectKanasByType(FYType.yoon, false)
                              }
                            >
                              清空
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Individual Kana Selection */}
                    <div className="space-y-2 sm:space-y-3">
                      <h3 className="font-semibold text-sm sm:text-base">
                        詳細選擇
                      </h3>
                      <div className="space-y-4">
                        {/* 清音 */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="h-px flex-1 bg-border" />
                            <h4 className="text-xs sm:text-sm font-medium text-muted-foreground">
                              清音 ({seionCount}/46)
                            </h4>
                            <div className="h-px flex-1 bg-border" />
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-1">
                            {kanaList
                              .filter((k) => k.fyType === FYType.seion)
                              .map((kana) => (
                                <div
                                  key={kana.id}
                                  className="flex items-center space-x-1.5 sm:space-x-2"
                                >
                                  <Checkbox
                                    id={kana.id}
                                    checked={kana.selected}
                                    onCheckedChange={() =>
                                      toggleKanaSelection(kana.id)
                                    }
                                    className="h-4 w-4"
                                  />
                                  <Label
                                    htmlFor={kana.id}
                                    className="text-sm sm:text-base cursor-pointer leading-tight"
                                  >
                                    {kana.displayText}
                                  </Label>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* 濁音 */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="h-px flex-1 bg-border" />
                            <h4 className="text-xs sm:text-sm font-medium text-muted-foreground">
                              濁音 ({dakuonCount}/25)
                            </h4>
                            <div className="h-px flex-1 bg-border" />
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-1">
                            {kanaList
                              .filter((k) => k.fyType === FYType.dakuon)
                              .map((kana) => (
                                <div
                                  key={kana.id}
                                  className="flex items-center space-x-1.5 sm:space-x-2"
                                >
                                  <Checkbox
                                    id={kana.id}
                                    checked={kana.selected}
                                    onCheckedChange={() =>
                                      toggleKanaSelection(kana.id)
                                    }
                                    className="h-4 w-4"
                                  />
                                  <Label
                                    htmlFor={kana.id}
                                    className="text-sm sm:text-base cursor-pointer leading-tight"
                                  >
                                    {kana.displayText}
                                  </Label>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* 拗音 */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="h-px flex-1 bg-border" />
                            <h4 className="text-xs sm:text-sm font-medium text-muted-foreground">
                              拗音 ({yoonCount}/33)
                            </h4>
                            <div className="h-px flex-1 bg-border" />
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-1">
                            {kanaList
                              .filter((k) => k.fyType === FYType.yoon)
                              .map((kana) => (
                                <div
                                  key={kana.id}
                                  className="flex items-center space-x-1.5 sm:space-x-2"
                                >
                                  <Checkbox
                                    id={kana.id}
                                    checked={kana.selected}
                                    onCheckedChange={() =>
                                      toggleKanaSelection(kana.id)
                                    }
                                    className="h-4 w-4"
                                  />
                                  <Label
                                    htmlFor={kana.id}
                                    className="text-sm sm:text-base cursor-pointer leading-tight"
                                  >
                                    {kana.displayText}
                                  </Label>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10"
              onClick={goToGitHub}
            >
              <Github className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Title Section */}
          <div className="pr-20 sm:pr-24">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              假名記憶
            </h1>
          </div>
        </div>

        {/* Main Card */}
        <Card className="flex-1 flex flex-col border-0 sm:border-2 rounded-none sm:rounded-lg overflow-hidden sm:flex-initial">
          <CardContent className="flex-1 flex flex-col p-6 sm:p-8 md:p-12">
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 sm:space-y-8">
              {!isStarted ? (
                <div className="text-center space-y-4 sm:space-y-6">
                  <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-muted-foreground">
                    準備
                  </div>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    已選擇: {seionCount + dakuonCount + yoonCount} 個假名
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
                    <div className="text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-bold">
                      {currentKana.displayText}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-14 w-14 sm:h-16 sm:w-16 rounded-full hover:bg-accent flex-shrink-0"
                      onClick={() => playSound(currentKana.id)}
                    >
                      <Volume2 className="h-7 w-7 sm:h-8 sm:w-8" />
                    </Button>
                  </div>

                  {showRemind && (
                    <div className="flex gap-3 sm:gap-4 animate-in fade-in px-4 sm:px-0">
                      <div className="flex-1 rounded-lg border-2 bg-card px-4 py-3 sm:px-6 sm:py-4">
                        <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                          {currentKana.remind.split("  ")[0] ===
                          currentKana.displayText
                            ? "片假名"
                            : currentKana.remind
                                .split("  ")[0]
                                .match(/^[a-z]+$/i)
                            ? "羅馬音"
                            : "平假名"}
                        </div>
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                          {currentKana.remind.split("  ")[0]}
                        </div>
                      </div>
                      <div className="flex-1 rounded-lg border-2 bg-card px-4 py-3 sm:px-6 sm:py-4">
                        <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                          {currentKana.remind.split("  ")[1] ===
                          currentKana.displayText
                            ? "片假名"
                            : currentKana.remind
                                .split("  ")[1]
                                .match(/^[a-z]+$/i)
                            ? "羅馬音"
                            : "平假名"}
                        </div>
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                          {currentKana.remind.split("  ")[1]}
                        </div>
                      </div>
                    </div>
                  )}

                  {!isLearningMode && (
                    <div className="w-full px-4 sm:px-0 sm:w-auto">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto sm:min-w-[200px]"
                        onClick={() => setShowRemind(true)}
                      >
                        顯示提示
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-4 sm:px-0 sm:pb-0">
              {!isStarted ? (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleStart}
                  disabled={seionCount + dakuonCount + yoonCount === 0}
                >
                  開始
                </Button>
              ) : (
                <Button className="w-full" size="lg" onClick={getRandomKana}>
                  下一個
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground/60 px-4 py-3 sm:px-2 sm:py-0 border-t sm:border-t-0">
          <p>Copyright © 2025 Powered by phpZ.xyz</p>
        </div>
      </div>
    </main>
  );
}
