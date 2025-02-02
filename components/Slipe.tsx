import { useState, useRef } from "react"
import { Toolbar } from "./Toolbar"
import { Canvas } from "./Canvas"

// Define our accent colors
const accentColor1 = "#FF6B6B"
const accentColor2 = "#4ECDC4"

export default function Slipe() {
  const [tool, setTool] = useState("brush")
  const [color, setColor] = useState(accentColor1)
  const [brushSize, setBrushSize] = useState(5)
  const [shapes, setShapes] = useState<any[]>([])
  const [colors, setColors] = useState([accentColor1, accentColor2, "#000000", "#FFFFFF"])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleClear = () => {
    setShapes([])
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (context) {
      context.fillStyle = "#FFFFFF"
      context.fillRect(0, 0, canvas.width, canvas.height)
    }
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = "slipe-creation.png"
      link.href = dataUrl
      link.click()
    }
  }

  const addColor = (newColor: string) => {
    setColors([...colors, newColor])
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden font-sans">
      <Toolbar
        accentColor1={accentColor1}
        accentColor2={accentColor2}
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        onClear={handleClear}
        onSave={handleSave}
        colors={colors}
        addColor={addColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
      />
      <div className="flex flex-1 overflow-hidden">
        <Canvas
          ref={canvasRef}
          tool={tool}
          color={color}
          brushSize={brushSize}
          shapes={shapes}
          setShapes={setShapes}
          onClear={handleClear}
        />
      </div>
    </div>
  )
}

