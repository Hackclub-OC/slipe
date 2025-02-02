import { useRef, useState, useEffect } from "react"
import { Rnd } from "react-rnd"
import type React from "react"

export function Canvas({
  tool,
  color,
  brushSize,
  shapes,
  setShapes,
  onClear,
}: {
  tool: string
  color: string
  brushSize: number
  shapes: any[]
  setShapes: React.Dispatch<React.SetStateAction<any[]>>
  onClear: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [cursorStyle, setCursorStyle] = useState("default")
  const [textBoxes, setTextBoxes] = useState<Array<{ id: number; text: string; x: number; y: number }>>([])
  const [nextTextId, setNextTextId] = useState(1)
  const [canvasState, setCanvasState] = useState<ImageData | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (context && canvasState) {
      context.putImageData(canvasState, 0, 0)
      shapes.forEach((shape) => drawShape(context, shape))
    }
  }, [shapes, canvasState])

  useEffect(() => {
    switch (tool) {
      case "pencil":
        setCursorStyle('url("/cursors/pencil.png") 0 32, auto')
        break
      case "brush":
        setCursorStyle('url("/cursors/brush.png") 0 32, auto')
        break
      case "bucket":
        setCursorStyle('url("/cursors/bucket.png") 16 32, auto')
        break
      case "spray":
        setCursorStyle('url("/cursors/spray.png") 16 32, auto')
        break
      case "eraser":
        setCursorStyle('url("/cursors/eraser.png") 16 32, auto')
        break
      case "text":
        setCursorStyle("text")
        break
      default:
        setCursorStyle("default")
    }
  }, [tool])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (context) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setStartPos({ x, y })
      setIsDrawing(true)

      if (["pencil", "brush", "eraser"].includes(tool)) {
        context.beginPath()
        context.moveTo(x, y)
      } else if (tool === "bucket") {
        floodFill(context, x, y, color)
      } else if (tool === "spray") {
        spray(context, x, y, color, brushSize)
      } else if (tool === "text") {
        setTextBoxes([...textBoxes, { id: nextTextId, text: "", x, y }])
        setNextTextId(nextTextId + 1)
      }

      // Save the current canvas state
      setCanvasState(context.getImageData(0, 0, canvas.width, canvas.height))
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (context) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (["pencil", "brush", "eraser"].includes(tool)) {
        context.lineTo(x, y)
        context.strokeStyle = tool === "eraser" ? "#FFFFFF" : color
        context.lineWidth = tool === "pencil" ? brushSize / 2 : brushSize
        context.lineCap = "round"
        if (tool === "pencil") {
          context.setLineDash([brushSize, brushSize])
        } else {
          context.setLineDash([])
        }
        context.stroke()
      } else if (tool === "spray") {
        spray(context, x, y, color, brushSize)
      } else if (
        ["rectangle", "circle", "triangle", "star", "hexagon", "line", "octagon", "pentagon", "diamond"].includes(tool)
      ) {
        const newShapes = [...shapes]
        newShapes[newShapes.length - 1] = {
          type: tool,
          startX: startPos.x,
          startY: startPos.y,
          endX: x,
          endY: y,
          color,
          size: brushSize,
        }
        setShapes(newShapes)
      }
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    if (
      ["rectangle", "circle", "triangle", "star", "hexagon", "line", "octagon", "pentagon", "diamond"].includes(tool)
    ) {
      setShapes([
        ...shapes,
        {
          type: tool,
          startX: startPos.x,
          startY: startPos.y,
          endX: startPos.x,
          endY: startPos.y,
          color,
          size: brushSize,
        },
      ])
    }

    // Save the current canvas state
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (context) {
      setCanvasState(context.getImageData(0, 0, canvas.width, canvas.height))
    }
  }

  const drawShape = (context: CanvasRenderingContext2D, shape: any) => {
    context.beginPath()
    context.strokeStyle = shape.color
    context.fillStyle = shape.color
    context.lineWidth = shape.size || 2

    switch (shape.type) {
      case "rectangle":
        context.rect(shape.startX, shape.startY, shape.endX - shape.startX, shape.endY - shape.startY)
        context.stroke()
        break
      case "circle":
        const radius = Math.sqrt(Math.pow(shape.endX - shape.startX, 2) + Math.pow(shape.endY - shape.startY, 2))
        context.arc(shape.startX, shape.startY, radius, 0, 2 * Math.PI)
        context.stroke()
        break
      case "triangle":
        context.moveTo(shape.startX, shape.endY)
        context.lineTo(shape.endX, shape.endY)
        context.lineTo((shape.startX + shape.endX) / 2, shape.startY)
        context.closePath()
        context.stroke()
        break
      case "star":
        drawStar(context, shape.startX, shape.startY, 5, shape.endX - shape.startX, shape.endY - shape.startY)
        context.stroke()
        break
      case "hexagon":
        drawPolygon(context, shape.startX, shape.startY, 6, shape.endX - shape.startX)
        context.stroke()
        break
      case "line":
        context.moveTo(shape.startX, shape.startY)
        context.lineTo(shape.endX, shape.endY)
        context.stroke()
        break
      case "octagon":
        drawPolygon(context, shape.startX, shape.startY, 8, shape.endX - shape.startX)
        context.stroke()
        break
      case "pentagon":
        drawPolygon(context, shape.startX, shape.startY, 5, shape.endX - shape.startX)
        context.stroke()
        break
      case "diamond":
        context.moveTo(shape.startX, (shape.startY + shape.endY) / 2)
        context.lineTo((shape.startX + shape.endX) / 2, shape.startY)
        context.lineTo(shape.endX, (shape.startY + shape.endY) / 2)
        context.lineTo((shape.startX + shape.endX) / 2, shape.endY)
        context.closePath()
        context.stroke()
        break
    }
  }

  const floodFill = (context: CanvasRenderingContext2D, x: number, y: number, fillColor: string) => {
    const imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
    const targetColor = getPixel(imageData, x, y)
    const fillColorRgb = hexToRgb(fillColor)

    if (!fillColorRgb) return

    const stack = [[x, y]]
    while (stack.length > 0) {
      const [x, y] = stack.pop()!
      if (x < 0 || x >= imageData.width || y < 0 || y >= imageData.height) continue
      if (!compareColor(getPixel(imageData, x, y), targetColor)) continue

      setPixel(imageData, x, y, fillColorRgb)
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
    }

    context.putImageData(imageData, 0, 0)
  }

  const spray = (context: CanvasRenderingContext2D, x: number, y: number, color: string, size: number) => {
    const density = size * 2
    for (let i = 0; i < density; i++) {
      const offsetX = getRandomInt(-size, size)
      const offsetY = getRandomInt(-size, size)
      if (offsetX * offsetX + offsetY * offsetY <= size * size) {
        context.fillStyle = color
        context.fillRect(x + offsetX, y + offsetY, 1, 1)
      }
    }
  }

  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const drawStar = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number,
  ) => {
    let rot = (Math.PI / 2) * 3
    let x = cx
    let y = cy
    const step = Math.PI / spikes

    ctx.beginPath()
    ctx.moveTo(cx, cy - outerRadius)
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius
      y = cy + Math.sin(rot) * outerRadius
      ctx.lineTo(x, y)
      rot += step

      x = cx + Math.cos(rot) * innerRadius
      y = cy + Math.sin(rot) * innerRadius
      ctx.lineTo(x, y)
      rot += step
    }
    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath()
  }

  const drawPolygon = (ctx: CanvasRenderingContext2D, x: number, y: number, sides: number, radius: number) => {
    ctx.beginPath()
    ctx.moveTo(x + radius * Math.cos(0), y + radius * Math.sin(0))
    for (let i = 1; i <= sides; i++) {
      ctx.lineTo(x + radius * Math.cos((i * 2 * Math.PI) / sides), y + radius * Math.sin((i * 2 * Math.PI) / sides))
    }
    ctx.closePath()
  }

  const getPixel = (imageData: ImageData, x: number, y: number) => {
    const index = (y * imageData.width + x) * 4
    return [imageData.data[index], imageData.data[index + 1], imageData.data[index + 2], imageData.data[index + 3]]
  }

  const setPixel = (imageData: ImageData, x: number, y: number, color: [number, number, number, number]) => {
    const index = (y * imageData.width + x) * 4
    imageData.data[index] = color[0]
    imageData.data[index + 1] = color[1]
    imageData.data[index + 2] = color[2]
    imageData.data[index + 3] = color[3]
  }

  const compareColor = (color1: number[], color2: number[]) => {
    return color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2] && color1[3] === color2[3]
  }

  const hexToRgb = (hex: string): [number, number, number, number] | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? [Number.parseInt(result[1], 16), Number.parseInt(result[2], 16), Number.parseInt(result[3], 16), 255]
      : null
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        width={window.innerWidth - 80}
        height={window.innerHeight - 50}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        className="flex-grow bg-white"
        style={{ cursor: cursorStyle }}
      />
      {textBoxes.map((textBox) => (
        <Rnd
          key={textBox.id}
          default={{
            x: textBox.x,
            y: textBox.y,
            width: 200,
            height: 40,
          }}
          minWidth={100}
          minHeight={40}
          bounds="parent"
        >
          <textarea
            value={textBox.text}
            onChange={(e) => {
              const updatedTextBoxes = textBoxes.map((tb) =>
                tb.id === textBox.id ? { ...tb, text: e.target.value } : tb,
              )
              setTextBoxes(updatedTextBoxes)
            }}
            style={{
              width: "100%",
              height: "100%",
              resize: "none",
              border: "1px solid #ccc",
              padding: "5px",
              fontSize: `${brushSize * 1.5}px`,
              color: color,
              backgroundColor: "transparent",
            }}
          />
        </Rnd>
      ))}
    </>
  )
}

