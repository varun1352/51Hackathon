"use client"

import { useState, useEffect } from "react"

export function MeasurementTool({ canvasRef }) {
  const [points, setPoints] = useState([])
  const [measuring, setMeasuring] = useState(false)
  const [distance, setDistance] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Scale factor (pixels to meters)
  const scaleFactor = 0.05 // 1 pixel = 5cm

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (points.length === 0) {
        setPoints([{ x, y }])
        setMeasuring(true)
      } else if (points.length === 1) {
        setPoints([...points, { x, y }])
        setMeasuring(false)

        // Calculate distance
        const dx = points[0].x - x
        const dy = points[0].y - y
        const pixelDistance = Math.sqrt(dx * dx + dy * dy)
        const meterDistance = pixelDistance * scaleFactor
        setDistance(meterDistance.toFixed(2))
      } else {
        // Reset and start new measurement
        setPoints([{ x, y }])
        setMeasuring(true)
        setDistance(null)
      }
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setMousePos({ x, y })
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mousemove", handleMouseMove)
    }
  }, [canvasRef, points])

  useEffect(() => {
    const drawMeasurement = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      const originalData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      // Draw the measurement line
      ctx.lineWidth = 2
      ctx.strokeStyle = "#6366f1"
      ctx.fillStyle = "#6366f1"

      // Draw points
      points.forEach((point) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw line between points
      if (points.length === 1 && measuring) {
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        ctx.lineTo(mousePos.x, mousePos.y)
        ctx.stroke()

        // Calculate current distance
        const dx = points[0].x - mousePos.x
        const dy = points[0].y - mousePos.y
        const pixelDistance = Math.sqrt(dx * dx + dy * dy)
        const meterDistance = pixelDistance * scaleFactor

        // Draw distance text
        const midX = (points[0].x + mousePos.x) / 2
        const midY = (points[0].y + mousePos.y) / 2

        ctx.font = "14px sans-serif"
        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.lineWidth = 4
        ctx.strokeText(`${meterDistance.toFixed(2)}m`, midX + 10, midY - 10)
        ctx.fillText(`${meterDistance.toFixed(2)}m`, midX + 10, midY - 10)
      } else if (points.length === 2) {
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        ctx.lineTo(points[1].x, points[1].y)
        ctx.stroke()

        // Draw distance text
        const midX = (points[0].x + points[1].x) / 2
        const midY = (points[0].y + points[1].y) / 2

        ctx.font = "14px sans-serif"
        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.lineWidth = 4
        ctx.strokeText(`${distance}m`, midX + 10, midY - 10)
        ctx.fillText(`${distance}m`, midX + 10, midY - 10)
      }

      // Schedule next frame
      requestAnimationFrame(() => {
        ctx.putImageData(originalData, 0, 0)
        drawMeasurement()
      })
    }

    const animationId = requestAnimationFrame(drawMeasurement)
    return () => cancelAnimationFrame(animationId)
  }, [canvasRef, points, measuring, mousePos, distance])

  return null // This component doesn't render anything, it just adds functionality
}

