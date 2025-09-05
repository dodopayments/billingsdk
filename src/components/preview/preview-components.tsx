"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Palette, Check, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { getThemeStyles } from "@/lib/themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PreviewComponentsProps {
  className?: string;
  children?: React.ReactNode;
  registryName?: string;
}

export function PreviewComponents({ className, children, registryName }: PreviewComponentsProps) {
  const { currentTheme, setTheme, themes, previewDarkMode, setPreviewDarkMode } = useTheme();
  const themeStyles = getThemeStyles(currentTheme, previewDarkMode);
  const registryUrl = `https://billingsdk.com/r/${registryName}.json`;

  // Open-in helpers
  const openInV0 = () => {
    window.open(`https://v0.dev/chat/api/open?url=${registryUrl}`, '_blank')
  }

  const openInLovable = () => {
    const prompt = encodeURIComponent(
      `Import this component from ${registryUrl} and open the code for editing. IMPORTANT: preserve the component exactly as-is. Do NOT change colors, CSS variables, Tailwind classes, spacing, fonts, or any visual styles. Do NOT regenerate or restyle the UI. Create files from the registry JSON verbatim and show the code tree.`
    )
    const lovableUrl = `https://lovable.dev/?prompt=${prompt}&autosubmit=true`
    window.open(lovableUrl, '_blank')
  }

  const openInBolt = async () => {
    try {
      const res = await fetch(registryUrl)
      const text = await res.text()
      const MAX_EMBED = 1400
      if (text.length <= MAX_EMBED) {
        const prompt = encodeURIComponent(
          `Here is a shadcn registry JSON for a component. Create a new project with these files and open the code for editing. IMPORTANT: import files verbatim and preserve ALL styles/colors/classes/fonts as-is. Do NOT restyle or regenerate the UI. JSON contents below as inline text.\n\n${text}`,
        )
        const boltUrl = `https://bolt.new/?prompt=${prompt}&autosubmit=true`
        window.open(boltUrl, '_blank')
      } else {
        try {
          await navigator.clipboard.writeText(text)
        } catch { }
        const prompt = encodeURIComponent(
          `I have copied a shadcn registry JSON for a component to the clipboard. Create the project by pasting the JSON I will provide and generate the files, then open the code for editing. IMPORTANT: import files verbatim and preserve ALL styles/colors/classes/fonts as-is. Do NOT restyle or regenerate the UI. If clipboard is not available, ask me to paste the JSON.`,
        )
        const boltUrl = `https://bolt.new/?prompt=${prompt}&autosubmit=true`
        window.open(boltUrl, '_blank')
      }
    } catch {
      const promptFallback = encodeURIComponent(
        `Import this component from ${registryUrl} and open the code for editing. IMPORTANT: preserve the component exactly as-is (no color/style/layout changes). If you cannot fetch external URLs, ask me to paste the JSON from that link.`,
      )
      const boltUrl = `https://bolt.new/?prompt=${promptFallback}&autosubmit=true`
      window.open(boltUrl, '_blank')
    }
  }

  return (
    <Card
      className={cn("not-prose bg-background", className)}
      style={themeStyles}
    >
      <CardHeader className="pb-0" style={previewDarkMode ? themes[0].cssVars.dark : themes[0].cssVars.light}>
        <div className="flex gap-2 justify-end">
          <div className="flex gap-2">
            {registryName && (
              <div className="flex items-center">
                <Button variant="outline" size={"sm"} aria-label="Open in V0" onClick={openInV0} className="rounded-r-none border-r-0" style={{
                  backgroundColor: previewDarkMode ? '#ffffff' : '#000000',
                  color: previewDarkMode ? '#000000' : '#ffffff',
                  borderColor: previewDarkMode ? '#ffffff' : '#000000'
                }}>
                  <span className="hidden md:block">Open in</span>
                  <svg
                    viewBox="0 0 40 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-current"
                  >
                    <path
                      d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z"
                      fill="currentColor"
                    />
                    <path
                      d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z"
                      fill="currentColor"
                    />
                  </svg>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default" size={"sm"} className="rounded-l-none border-l-0 px-2">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent sideOffset={4} className="w-fit min-w-full">
                    <DropdownMenuItem onClick={openInLovable}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2 transform rotate-45"
                      >
                        <path
                          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                          fill="currentColor"
                        />
                      </svg>
                      Lovable
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={openInBolt}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                      >
                        <path
                          d="M13 2L3 14h9l-1 8 12-12h-9l1-8z"
                          fill="currentColor"
                        />
                      </svg>
                      Bolt
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPreviewDarkMode(!previewDarkMode)}
            >
              {previewDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle preview dark mode</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Palette className="h-4 w-4" />
                  <span className="sr-only">Switch theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent sideOffset={4} className="w-fit min-w-full">
                {themes.map((theme) => (
                  <DropdownMenuItem
                    key={theme.name}
                    onClick={() => setTheme(theme)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-1 border-border overflow-clip">
                        <div
                          className="size-4"
                          style={{
                            backgroundImage: `linear-gradient(45deg, ${theme.cssVars.light['--primary']}, ${theme.cssVars.light['--accent']})`,
                        
                          }}
                        />
                      </div>
                      <span>{theme.label}</span>
                      {currentTheme.name === theme.name && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 w-full h-full justify-center items-center">
        {children}
      </CardContent>
    </Card>
  );
}