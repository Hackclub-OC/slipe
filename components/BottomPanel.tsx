import { Slider } from "@/components/ui/slider"

export function BottomPanel({ brushSize, setBrushSize }: { brushSize: number; setBrushSize: (size: number) => void }) {
  return (
    <div className="bg-white shadow-sm p-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Brush Size:</span>
        <Slider
          value={[brushSize]}
          onValueChange={(value) => setBrushSize(value[0])}
          max={50}
          step={1}
          className="w-64"
        />
      </div>
      <div className="text-xs text-gray-500">© 2023 Spline. All rights reserved.</div>
    </div>
  )
}

