import { useState } from "react"
import {
  Pencil,
  Brush,
  Droplet,
  SprayCanIcon as Spray,
  Square,
  Circle,
  Triangle,
  Star,
  Hexagon,
  Minus,
  Octagon,
  Pentagon,
  Diamond,
  Trash2,
  Save,
  Type,
  ImageIcon,
  Eraser,
  Plus,
} from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HexColorPicker } from "react-colorful"
import { Slider } from "@/components/ui/slider"

const tools = [
  { name: "pencil", icon: Pencil, tooltip: "Pencil" },
  { name: "brush", icon: Brush, tooltip: "Brush" },
  { name: "bucket", icon: Droplet, tooltip: "Fill" },
  { name: "spray", icon: Spray, tooltip: "Spray" },
  { name: "eraser", icon: Eraser, tooltip: "Eraser" },
  { name: "text", icon: Type, tooltip: "Text" },
  { name: "image", icon: ImageIcon, tooltip: "Upload Image" },
]

const shapes = [
  { name: "rectangle", icon: Square, tooltip: "Rectangle" },
  { name: "circle", icon: Circle, tooltip: "Circle" },
  { name: "triangle", icon: Triangle, tooltip: "Triangle" },
  { name: "star", icon: Star, tooltip: "Star" },
  { name: "hexagon", icon: Hexagon, tooltip: "Hexagon" },
  { name: "line", icon: Minus, tooltip: "Line" },
  { name: "octagon", icon: Octagon, tooltip: "Octagon" },
  { name: "pentagon", icon: Pentagon, tooltip: "Pentagon" },
  { name: "diamond", icon: Diamond, tooltip: "Diamond" },
]

export function Toolbar({
  accentColor1,
  accentColor2,
  tool,
  setTool,
  color,
  setColor,
  onClear,
  onSave,
  colors,
  addColor,
  brushSize,
  setBrushSize,
}: {
  accentColor1: string
  accentColor2: string
  tool: string
  setTool: (tool: string) => void
  color: string
  setColor: (color: string) => void
  onClear: () => void
  onSave: () => void
  colors: string[]
  addColor: (color: string) => void
  brushSize: number
  setBrushSize: (size: number) => void
}) {
  const [customColor, setCustomColor] = useState("#000000")

  const handleAddColor = () => {
    addColor(customColor)
    setCustomColor("#000000")
  }

  const renderToolGroup = (items: typeof tools, title: string, className: string) => (
    <div className={className}>
      <h3 className="mb-2 text-sm font-medium">{title}</h3>
      <ScrollArea className="h-[100px]">
        <div className="grid grid-cols-3 gap-2 pr-4">
          {items.map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTool(item.name)}
                  className={`w-10 h-10 ${tool === item.name ? `border-2 border-${accentColor1}` : ""}`}
                >
                  <item.icon className="h-5 w-5" style={{ color: tool === item.name ? accentColor1 : "black" }} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="px-2 py-1 text-xs" sideOffset={5}>
                <div className="arrow-up"></div>
                {item.tooltip}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  )

  return (
    <TooltipProvider delayDuration={0}>
      <div className="bg-white shadow-sm p-3">
        <ScrollArea className="w-full" orientation="horizontal">
          <div className="flex items-center space-x-4 min-w-max mx-auto max-w-7xl">
            <div className="flex-shrink-0">
              <h1
                className="text-5xl font-bold"
                style={{
                  fontFamily: "'Island Moments', cursive",
                  background: `linear-gradient(45deg, ${accentColor1}, ${accentColor2})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Slipe
              </h1>
            </div>
            <Separator orientation="vertical" className="h-[120px]" />
            <div className="w-[200px]">{renderToolGroup(tools, "Tools", "tools-section")}</div>
            <Separator orientation="vertical" className="h-[120px]" />
            <div className="w-[200px]">{renderToolGroup(shapes, "Shapes", "shapes-section")}</div>
            <Separator orientation="vertical" className="h-[120px]" />
            <div className="w-[200px]">
              <div className="colors-section">
                <h3 className="mb-2 text-sm font-medium">Colors</h3>
                <ScrollArea className="h-[100px]">
                  <div className="grid grid-cols-5 gap-2 pr-4">
                    {colors.map((c) => (
                      <Tooltip key={c}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setColor(c)}
                            className={`w-6 h-6 rounded-sm ${color === c ? "ring-2 ring-offset-2" : ""}`}
                            style={{ backgroundColor: c }}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="px-2 py-1 text-xs" sideOffset={5}>
                          <div className="arrow-up"></div>
                          {c}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="w-6 h-6 rounded-sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="flex flex-col space-y-2">
                          <label htmlFor="custom-color" className="text-sm font-medium">
                            Add New Color
                          </label>
                          <HexColorPicker
                            color={customColor}
                            onChange={setCustomColor}
                            style={{ width: "100%", height: "150px" }}
                          />
                          <Button
                            onClick={handleAddColor}
                            className="bg-white text-black border border-black hover:bg-gray-100"
                          >
                            Add Color
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </div>
            </div>
            <Separator orientation="vertical" className="h-[120px]" />
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="w-10 h-10">
                    <Circle className="h-5 w-5" style={{ fill: "currentColor", fillOpacity: brushSize / 50 }} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="brush-size" className="text-sm font-medium">
                      Brush Size: {brushSize}
                    </label>
                    <Slider
                      id="brush-size"
                      min={1}
                      max={50}
                      step={1}
                      value={[brushSize]}
                      onValueChange={(value) => setBrushSize(value[0])}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <Separator orientation="vertical" className="h-[120px]" />
            <div className="flex items-center space-x-2 action-buttons">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={onClear}>
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="px-2 py-1 text-xs" sideOffset={5}>
                  <div className="arrow-up"></div>
                  Clear Canvas
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={onSave}>
                    <Save className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="px-2 py-1 text-xs" sideOffset={5}>
                  <div className="arrow-up"></div>
                  Save Creation
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </TooltipProvider>
  )
}

