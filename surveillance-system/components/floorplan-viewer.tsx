"use client"

import { useState, useRef, useEffect } from "react"
import { Spinner } from "@/components/ui/spinner"

export function FloorplanViewer({
  imagePath,
  isMeasuring = false,
  onMeasure = () => {},
  onHover = () => {},
  syncViews = false,
  showCoverage = false,
  coverageOpacity = 0.5,
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [imageExists, setImageExists] = useState(false)
  const [measurePoints, setMeasurePoints] = useState([])
  const [scale, setScale] = useState(1.0) // meters per pixel
  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const containerRef = useRef(null)

  // Check if the image exists
  useEffect(() => {
    const checkImage = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(imagePath, { method: "HEAD" })
        setImageExists(response.ok)
      } catch (error) {
        console.error("Error checking floorplan image:", error)
        setImageExists(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkImage()
  }, [imagePath])

  // Draw the floorplan
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (imageExists) {
      // Draw the floorplan image if it exists
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        imageRef.current = img

        // Calculate scale based on image dimensions
        // Assuming the image has a scale indicator or known dimensions
        // For this example, we'll use a fixed scale, but in a real app
        // this would be extracted from metadata or user input
        setScale(0.1) // 10cm per pixel

        // Fit image to canvas while maintaining aspect ratio
        const canvasRatio = canvas.width / canvas.height
        const imgRatio = img.width / img.height

        let drawWidth,
          drawHeight,
          offsetX = 0,
          offsetY = 0

        if (canvasRatio > imgRatio) {
          // Canvas is wider than image
          drawHeight = canvas.height
          drawWidth = img.width * (canvas.height / img.height)
          offsetX = (canvas.width - drawWidth) / 2
        } else {
          // Canvas is taller than image
          drawWidth = canvas.width
          drawHeight = img.height * (canvas.width / img.width)
          offsetY = (canvas.height - drawHeight) / 2
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

        // Draw coverage overlay if enabled
        if (showCoverage) {
          drawCoverageOverlay(ctx, offsetX, offsetY, drawWidth, drawHeight)
        }

        // Draw measurement points and lines if any
        drawMeasurements(ctx)
      }

      img.onerror = () => {
        console.error("Error loading floorplan image")
        setImageExists(false)
        drawFallbackFloorplan(ctx)
      }

      img.src = imagePath
    } else {
      // Draw a fallback floorplan if the image doesn't exist
      drawFallbackFloorplan(ctx)
    }
  }, [imageExists, imagePath, measurePoints, showCoverage, coverageOpacity])

  // Draw coverage overlay
  const drawCoverageOverlay = (ctx, offsetX, offsetY, width, height) => {
    // Save current context state
    ctx.save()

    // Set global alpha for transparency
    ctx.globalAlpha = coverageOpacity

    // Draw camera coverage areas (simplified for demo)
    // Camera 1
    ctx.fillStyle = "rgba(0, 255, 0, 0.5)"
    ctx.beginPath()
    ctx.arc(offsetX + width * 0.25, offsetY + height * 0.25, width * 0.15, 0, Math.PI * 2)
    ctx.fill()

    // Camera 2
    ctx.fillStyle = "rgba(0, 255, 0, 0.5)"
    ctx.beginPath()
    ctx.arc(offsetX + width * 0.75, offsetY + height * 0.25, width * 0.15, 0, Math.PI * 2)
    ctx.fill()

    // Camera 3
    ctx.fillStyle = "rgba(0, 255, 0, 0.5)"
    ctx.beginPath()
    ctx.arc(offsetX + width * 0.25, offsetY + height * 0.75, width * 0.15, 0, Math.PI * 2)
    ctx.fill()

    // Camera 4
    ctx.fillStyle = "rgba(0, 255, 0, 0.5)"
    ctx.beginPath()
    ctx.arc(offsetX + width * 0.75, offsetY + height * 0.75, width * 0.15, 0, Math.PI * 2)
    ctx.fill()

    // Draw blindspots
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)"
    ctx.beginPath()
    ctx.arc(offsetX + width * 0.5, offsetY + height * 0.5, width * 0.05, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "rgba(255, 0, 0, 0.5)"
    ctx.beginPath()
    ctx.rect(offsetX + width * 0.05, offsetY + height * 0.05, width * 0.1, height * 0.1)
    ctx.fill()

    ctx.fillStyle = "rgba(255, 0, 0, 0.5)"
    ctx.beginPath()
    ctx.rect(offsetX + width * 0.85, offsetY + height * 0.85, width * 0.1, height * 0.1)
    ctx.fill()

    // Restore context state
    ctx.restore()
  }

  // Draw a fallback floorplan
  const drawFallbackFloorplan = (ctx) => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set background
    ctx.fillStyle = "#f8f9fa"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#e9ecef"
    ctx.lineWidth = 1

    const gridSize = 50
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw room outlines
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const roomWidth = canvas.width * 0.8
    const roomHeight = canvas.height * 0.8

    ctx.strokeStyle = "#6c757d"
    ctx.lineWidth = 2

    // Outer walls
    ctx.strokeRect(centerX - roomWidth / 2, centerY - roomHeight / 2, roomWidth, roomHeight)

    // Inner walls - horizontal divider
    ctx.beginPath()
    ctx.moveTo(centerX - roomWidth / 2, centerY)
    ctx.lineTo(centerX + roomWidth / 2, centerY)
    ctx.stroke()

    // Inner walls - vertical divider
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - roomHeight / 2)
    ctx.lineTo(centerX, centerY)
    ctx.stroke()

    // Inner walls - another vertical divider
    ctx.beginPath()
    ctx.moveTo(centerX - roomWidth / 4, centerY)
    ctx.lineTo(centerX - roomWidth / 4, centerY + roomHeight / 2)
    ctx.stroke()

    // Room labels
    ctx.fillStyle = "#495057"
    ctx.font = "16px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    ctx.fillText("Office A", centerX - roomWidth / 4, centerY - roomHeight / 4)
    ctx.fillText("Office B", centerX + roomWidth / 4, centerY - roomHeight / 4)
    ctx.fillText("Conference Room", centerX - (roomWidth * 3) / 8, centerY + roomHeight / 4)
    ctx.fillText("Reception", centerX + roomWidth / 4, centerY + roomHeight / 4)

    // Draw some furniture
    ctx.fillStyle = "#ced4da"

    // Office A desk
    ctx.fillRect(centerX - roomWidth / 3, centerY - roomHeight / 4 - 30, 80, 40)

    // Office B desk
    ctx.fillRect(centerX + roomWidth / 4 - 40, centerY - roomHeight / 4 - 30, 80, 40)

    // Conference table
    ctx.beginPath()
    ctx.ellipse(centerX - (roomWidth * 3) / 8, centerY + roomHeight / 4, 60, 30, 0, 0, Math.PI * 2)
    ctx.fill()

    // Reception desk
    ctx.fillRect(centerX + roomWidth / 4 - 30, centerY + roomHeight / 4 - 20, 60, 30)

    // Draw camera positions
    ctx.fillStyle = "#007bff"

    // Camera 1 (Office A)
    ctx.beginPath()
    ctx.arc(centerX - roomWidth / 3, centerY - roomHeight / 3, 8, 0, Math.PI * 2)
    ctx.fill()

    // Camera 2 (Office B)
    ctx.beginPath()
    ctx.arc(centerX + roomWidth / 3, centerY - roomHeight / 3, 8, 0, Math.PI * 2)
    ctx.fill()

    // Camera 3 (Conference)
    ctx.beginPath()
    ctx.arc(centerX - roomWidth / 3, centerY + roomHeight / 3, 8, 0, Math.PI * 2)
    ctx.fill()

    // Camera 4 (Reception)
    ctx.beginPath()
    ctx.arc(centerX + roomWidth / 3, centerY + roomHeight / 3, 8, 0, Math.PI * 2)
    ctx.fill()

    // Draw coverage overlay if enabled
    if (showCoverage) {
      // Save current context state
      ctx.save()

      // Set global alpha for transparency
      ctx.globalAlpha = coverageOpacity

      // Draw camera coverage areas
      // Camera 1
      ctx.fillStyle = "rgba(0, 255, 0, 0.5)"
      ctx.beginPath()
      ctx.arc(centerX - roomWidth / 3, centerY - roomHeight / 3, roomWidth * 0.15, 0, Math.PI * 2)
      ctx.fill()

      // Camera 2
      ctx.fillStyle = "rgba(0, 255, 0, 0.5)"
      ctx.beginPath()
      ctx.arc(centerX + roomWidth / 3, centerY - roomHeight / 3, roomWidth * 0.15, 0, Math.PI * 2)
      ctx.fill()

      // Camera 3
      ctx.fillStyle = "rgba(0, 255, 0, 0.5)"
      ctx.beginPath()
      ctx.arc(centerX - roomWidth / 3, centerY + roomHeight / 3, roomWidth * 0.15, 0, Math.PI * 2)
      ctx.fill()

      // Camera 4
      ctx.fillStyle = "rgba(0, 255, 0, 0.5)"
      ctx.beginPath()
      ctx.arc(centerX + roomWidth / 3, centerY + roomHeight / 3, roomWidth * 0.15, 0, Math.PI * 2)
      ctx.fill()

      // Draw blindspots
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)"
      ctx.beginPath()
      ctx.arc(centerX, centerY, roomWidth * 0.05, 0, Math.PI * 2)
      ctx.fill()

      // Restore context state
      ctx.restore()
    }
  }

  // Draw measurement points and lines
  const drawMeasurements = (ctx) => {
    if (!measurePoints || measurePoints.length === 0) return

    // Draw points
    ctx.fillStyle = "#6366f1"
    measurePoints.forEach((point) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw line between points if we have two points
    if (measurePoints.length === 2) {
      ctx.strokeStyle = "#6366f1"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(measurePoints[0].x, measurePoints[0].y)
      ctx.lineTo(measurePoints[1].x, measurePoints[1].y)
      ctx.stroke()
      ctx.setLineDash([])

      // Calculate and display distance
      const dx = measurePoints[1].x - measurePoints[0].x
      const dy = measurePoints[1].y - measurePoints[0].y
      const pixelDistance = Math.sqrt(dx * dx + dy * dy)
      const meterDistance = (pixelDistance * scale).toFixed(1)

      // Draw distance text
      const midX = (measurePoints[0].x + measurePoints[1].x) / 2
      const midY = (measurePoints[0].y + measurePoints[1].y) / 2

      ctx.font = "14px sans-serif"
      ctx.fillStyle = "white"
      ctx.strokeStyle = "black"
      ctx.lineWidth = 4
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Draw text with outline for better visibility
      ctx.strokeText(`${meterDistance}m`, midX, midY - 15)
      ctx.fillText(`${meterDistance}m`, midX, midY - 15)

      // Notify parent component about the measurement
      onMeasure(measurePoints, meterDistance)
    }
  }

  // Handle canvas click for measurements
  const handleCanvasClick = (e) => {
    if (!isMeasuring) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    // Get the actual position relative to the canvas
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    if (measurePoints.length < 2) {
      setMeasurePoints([...measurePoints, { x, y }])
    } else {
      setMeasurePoints([{ x, y }])
    }
  }

  // Handle mouse move for syncing with 3D view
  const handleMouseMove = (e) => {
    if (!syncViews) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    onHover(x, y)
  }

  // Ensure the floorplan viewer is properly centered and responsive
  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center">
            <Spinner className="h-8 w-8 text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Loading floorplan...</p>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full object-contain"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
      />

      {!isLoading && !imageExists && (
        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg border">
          <p className="text-xs text-muted-foreground">Using demo floorplan (image file not found)</p>
        </div>
      )}
    </div>
  )
}

