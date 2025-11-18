"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings, Volume2, Github, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { KanaData } from "@/lib/kana-data";
import { LocalStorage } from "@/lib/local-storage";
import { FYType, type MemoObject, type DisplayMode } from "@/lib/types";

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
  const [displayMode, setDisplayMode] = useState<DisplayMode>("A");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadKanaData();
  }, []);

  const loadKanaData = () => {
    const kd = new KanaData();
    const savedData = LocalStorage.load<MemoObject[]>("selectedData");
    const savedMode = LocalStorage.load<DisplayMode>("displayType");

    if (savedData) {
      setKanaList(savedData);
    } else {
      setKanaList(kd.getJP50());
    }

    if (savedMode) {
      setDisplayMode(savedMode);
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
  };

  const selectKanasByType = (type: FYType, selected: boolean) => {
    const updated = kanaList.map((k) =>
      k.fyType === type ? { ...k, selected } : k
    );
    setKanaList(updated);
  };

  const handleStart = () => {
    setIsStarted(true);
    getRandomKana();
  };

  const getRandomKana = () => {
    setShowRemind(false);

    if (displayKanaList.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * displayKanaList.length);
    const selectedKana = displayKanaList[randomIndex];

    let displayText = "";
    let remindText = "";

    switch (displayMode) {
      case "A":
        const rand = Math.round(Math.random());
        displayText =
          rand === 1 ? selectedKana.displayText : selectedKana.displayText2;
        remindText = selectedKana.remind;
        break;
      case "Ping":
        displayText = selectedKana.displayText;
        remindText = selectedKana.remind;
        break;
      case "Pian":
        displayText = selectedKana.displayText2;
        remindText = selectedKana.remind;
        break;
      case "luo":
        displayText = selectedKana.remind;
        remindText = `${selectedKana.displayText}  ${selectedKana.displayText2}`;
        break;
      case "swap":
        const rand2 = Math.round(Math.random());
        displayText =
          rand2 === 1 ? selectedKana.displayText : selectedKana.displayText2;
        remindText =
          rand2 === 1 ? selectedKana.displayText2 : selectedKana.displayText;
        break;
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

  const handleSaveSettings = () => {
    refreshDisplayData();
    LocalStorage.save("selectedData", kanaList);
    LocalStorage.save("displayType", displayMode);
    setIsSettingsOpen(false);
  };

  const goToGitHub = () => {
    window.open("https://github.com/kidynecat/KanaSyllabaryMemory", "_blank");
  };

  if (!mounted) return null;

  const qingCount = kanaList.filter(
    (k) => k.fyType === FYType.qing && k.selected
  ).length;
  const zhuoCount = kanaList.filter(
    (k) => k.fyType === FYType.zhuo && k.selected
  ).length;
  const niuCount = kanaList.filter(
    (k) => k.fyType === FYType.niu && k.selected
  ).length;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 md:p-6">
      <audio ref={audioRef} />

      <div className="w-full max-w-2xl space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center px-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            假名记忆
          </h1>
          <div className="flex gap-1.5 sm:gap-2">
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
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10"
              onClick={goToGitHub}
            >
              <Github className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {/* Main Card */}
        <Card className="border-2">
          <CardContent className="p-6 sm:p-8 md:p-12">
            <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-8">
              {!isStarted ? (
                <div className="text-center space-y-4 sm:space-y-6">
                  <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-muted-foreground">
                    準備
                  </div>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    已选择: {qingCount + zhuoCount + niuCount} 个假名
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold cursor-pointer hover:scale-105 active:scale-95 transition-transform touch-none select-none"
                    onClick={() => playSound(currentKana.id)}
                  >
                    {currentKana.displayText}
                  </div>

                  {showRemind && (
                    <div className="text-xl sm:text-2xl md:text-3xl text-muted-foreground animate-in fade-in">
                      {currentKana.remind}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                      onClick={() => setShowRemind(true)}
                    >
                      显示提示
                    </Button>
                    <Button
                      size="lg"
                      className="w-full sm:w-auto"
                      onClick={() => playSound(currentKana.id)}
                    >
                      <Volume2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      发音
                    </Button>
                  </div>
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                {!isStarted ? (
                  <Button
                    className="w-full sm:flex-1"
                    size="lg"
                    onClick={handleStart}
                    disabled={qingCount + zhuoCount + niuCount === 0}
                  >
                    开始练习
                  </Button>
                ) : (
                  <Button
                    className="w-full sm:flex-1"
                    size="lg"
                    onClick={getRandomKana}
                  >
                    下一个
                  </Button>
                )}

                <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      <Settings className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      设置
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
                    <SheetHeader className="px-4 sm:px-6 pt-6 pb-4 border-b">
                      <SheetTitle>设置</SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
                      <div className="space-y-5 sm:space-y-6">
                        {/* Display Mode */}
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="font-semibold text-base sm:text-lg">
                            显示模式
                          </h3>
                          <RadioGroup
                            value={displayMode}
                            onValueChange={(v) =>
                              setDisplayMode(v as DisplayMode)
                            }
                          >
                            <div className="flex items-center space-x-2 py-1">
                              <RadioGroupItem value="A" id="mode-a" />
                              <Label
                                htmlFor="mode-a"
                                className="text-sm sm:text-base cursor-pointer"
                              >
                                混合
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 py-1">
                              <RadioGroupItem value="Ping" id="mode-ping" />
                              <Label
                                htmlFor="mode-ping"
                                className="text-sm sm:text-base cursor-pointer"
                              >
                                平假名
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 py-1">
                              <RadioGroupItem value="Pian" id="mode-pian" />
                              <Label
                                htmlFor="mode-pian"
                                className="text-sm sm:text-base cursor-pointer"
                              >
                                片假名
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 py-1">
                              <RadioGroupItem value="luo" id="mode-luo" />
                              <Label
                                htmlFor="mode-luo"
                                className="text-sm sm:text-base cursor-pointer"
                              >
                                罗马音
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 py-1">
                              <RadioGroupItem value="swap" id="mode-swap" />
                              <Label
                                htmlFor="mode-swap"
                                className="text-sm sm:text-base cursor-pointer"
                              >
                                互换
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {/* Kana Selection */}
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="font-semibold text-base sm:text-lg">
                            选择假名类型
                          </h3>
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <Label className="text-sm sm:text-base">
                                清音 ({qingCount}/46)
                              </Label>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 sm:flex-none text-xs sm:text-sm h-8"
                                  onClick={() =>
                                    selectKanasByType(FYType.qing, true)
                                  }
                                >
                                  全选
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 sm:flex-none text-xs sm:text-sm h-8"
                                  onClick={() =>
                                    selectKanasByType(FYType.qing, false)
                                  }
                                >
                                  全不选
                                </Button>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <Label className="text-sm sm:text-base">
                                浊音 ({zhuoCount}/25)
                              </Label>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 sm:flex-none text-xs sm:text-sm h-8"
                                  onClick={() =>
                                    selectKanasByType(FYType.zhuo, true)
                                  }
                                >
                                  全选
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 sm:flex-none text-xs sm:text-sm h-8"
                                  onClick={() =>
                                    selectKanasByType(FYType.zhuo, false)
                                  }
                                >
                                  全不选
                                </Button>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <Label className="text-sm sm:text-base">
                                拗音 ({niuCount}/33)
                              </Label>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 sm:flex-none text-xs sm:text-sm h-8"
                                  onClick={() =>
                                    selectKanasByType(FYType.niu, true)
                                  }
                                >
                                  全选
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 sm:flex-none text-xs sm:text-sm h-8"
                                  onClick={() =>
                                    selectKanasByType(FYType.niu, false)
                                  }
                                >
                                  全不选
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Individual Kana Selection */}
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="font-semibold text-base sm:text-lg">
                            详细选择
                          </h3>
                          <div className="space-y-4">
                            {/* 清音 */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="h-px flex-1 bg-border" />
                                <h4 className="text-xs sm:text-sm font-medium text-muted-foreground">
                                  清音 ({qingCount}/46)
                                </h4>
                                <div className="h-px flex-1 bg-border" />
                              </div>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-1">
                                {kanaList
                                  .filter((k) => k.fyType === FYType.qing)
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

                            {/* 浊音 */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="h-px flex-1 bg-border" />
                                <h4 className="text-xs sm:text-sm font-medium text-muted-foreground">
                                  浊音 ({zhuoCount}/25)
                                </h4>
                                <div className="h-px flex-1 bg-border" />
                              </div>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-1">
                                {kanaList
                                  .filter((k) => k.fyType === FYType.zhuo)
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
                                  拗音 ({niuCount}/33)
                                </h4>
                                <div className="h-px flex-1 bg-border" />
                              </div>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-1">
                                {kanaList
                                  .filter((k) => k.fyType === FYType.niu)
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

                    <div className="border-t px-4 sm:px-6 py-4 bg-background">
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleSaveSettings}
                      >
                        保存设置
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs sm:text-sm text-muted-foreground px-2 space-y-1">
          <p>日语假名（平假名、片假名）记忆练习工具</p>
          <p>Copyright © 2025 phpz.xyz All rights reserved.</p>
        </div>
      </div>
    </main>
  );
}
