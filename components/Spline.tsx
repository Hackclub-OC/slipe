import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { Toolbar } from "./Toolbar"
import { Canvas } from "./Canvas"

// Define our accent colors
const accentColor1 = "#FF6B6B"
const accentColor2 = "#4ECDC4"

export default function Spline() {
  const [tool, setTool] = useState("brush")
  const [color, setColor] = useState(accentColor1)
  const [brushSize, setBrushSize] = useState(2)
  const [shapes, setShapes] = useState<any[]>([])

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden font-sans">
      <Sidebar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        accentColor1={accentColor1}
        accentColor2={accentColor2}
      />
      <div className="flex-1 flex flex-col">
        <Toolbar accentColor1={accentColor1} accentColor2={accentColor2} />
        <Canvas tool={tool} color={color} brushSize={brushSize} shapes={shapes} setShapes={setShapes} />
      </div>
    </div>
  )
}

