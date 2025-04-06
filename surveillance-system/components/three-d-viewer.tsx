"use client"

import { useState, useEffect, Suspense } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Html, PerspectiveCamera } from "@react-three/drei"
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader"
import * as THREE from "three"
import { Spinner } from "@/components/ui/spinner"

// Fallback 3D scene component
const FallbackScene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Walls */}
      <group>
        {/* Outer walls */}
        <mesh position={[0, 0, -5]} scale={[10, 1, 0.1]}>
          <boxGeometry />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
        <mesh position={[0, 0, 5]} scale={[10, 1, 0.1]}>
          <boxGeometry />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
        <mesh position={[-5, 0, 0]} scale={[0.1, 1, 10]}>
          <boxGeometry />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
        <mesh position={[5, 0, 0]} scale={[0.1, 1, 10]}>
          <boxGeometry />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>

        {/* Inner walls */}
        <mesh position={[1.7, 0, 0]} scale={[0.1, 1, 10]}>
          <boxGeometry />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
        <mesh position={[-1.7, 0, 0]} scale={[0.1, 1, 5]}>
          <boxGeometry />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
        <mesh position={[0, 0, 0]} scale={[3.3, 1, 0.1]}>
          <boxGeometry />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
      </group>

      {/* Furniture */}
      {/* Living Room */}
      <mesh position={[-3, -0.25, -2]} scale={[1.5, 0.25, 1]}>
        <boxGeometry />
        <meshStandardMaterial color="#a0a0a0" />
      </mesh>
      <mesh position={[-1, -0.25, -2]} scale={[1.5, 0.25, 1.5]}>
        <cylinderGeometry />
        <meshStandardMaterial color="#a0a0a0" />
      </mesh>

      {/* Kitchen */}
      <mesh position={[3, -0.25, -2]} scale={[1.5, 0.25, 0.5]}>
        <boxGeometry />
        <meshStandardMaterial color="#a0a0a0" />
      </mesh>

      {/* Bedroom */}
      <mesh position={[-3, -0.25, 2]} scale={[2, 0.25, 1.5]}>
        <boxGeometry />
        <meshStandardMaterial color="#a0a0a0" />
      </mesh>

      {/* Office */}
      <mesh position={[3, -0.25, 2]} scale={[1, 0.25, 1.5]}>
        <boxGeometry />
        <meshStandardMaterial color="#a0a0a0" />
      </mesh>

      <gridHelper args={[10, 10, "#a1a1aa", "#d4d4d8"]} />
    </>
  )
}

// PLY Model component
const PLYModel = ({ url, useSimpleVisualization }) => {
  const [geometry, setGeometry] = useState(null)
  const [error, setError] = useState(false)
  const { camera } = useThree()

  useEffect(() => {
    const loader = new PLYLoader()

    loader.load(
      url,
      (loadedGeometry) => {
        loadedGeometry.computeVertexNormals()
        setGeometry(loadedGeometry)

        // Center camera on the model
        const box = new THREE.Box3().setFromObject(new THREE.Mesh(loadedGeometry))
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const fov = camera.fov * (Math.PI / 180)
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))
        cameraZ *= 1.5 // Zoom out a bit

        // Update camera position
        camera.position.set(center.x, center.y, center.z + cameraZ)

        // Only use lookAt if it's available (it should be on PerspectiveCamera)
        if (typeof camera.lookAt === "function") {
          camera.lookAt(center)
          camera.updateProjectionMatrix()
        }
      },
      undefined,
      (error) => {
        console.error("Error loading PLY file:", error)
        setError(true)
      },
    )
  }, [url, camera])

  if (error) return null

  if (!geometry)
    return (
      <Html center>
        <div className="flex flex-col items-center justify-center">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Loading 3D model...</p>
        </div>
      </Html>
    )

  const pointsMaterial = new THREE.PointsMaterial({
    size: 0.01, // Adjust the size of the points as needed
    vertexColors: geometry.hasAttribute("color"), // Use vertex colors if available
  })

  return (
    <points geometry={geometry} material={pointsMaterial} />
  )
}

// Measurement visualization in 3D
const MeasurementVisualization = ({ points }) => {
  if (!points || points.length < 2) return null

  // Convert 2D floorplan points to 3D space
  const point1 = [(points[0].x / 100) * 10 - 5, 0, (points[0].y / 100) * 10 - 5]
  const point2 = [(points[1].x / 100) * 10 - 5, 0, (points[1].y / 100) * 10 - 5]

  return (
    <group>
      <mesh position={point1} scale={[0.1, 0.1, 0.1]}>
        <sphereGeometry />
        <meshStandardMaterial color="red" />
      </mesh>
      <mesh position={point2} scale={[0.1, 0.1, 0.1]}>
        <sphereGeometry />
        <meshStandardMaterial color="red" />
      </mesh>
      <line>
        <bufferGeometry
          attach="geometry"
          onUpdate={(self) => {
            const positions = new Float32Array([point1[0], point1[1], point1[2], point2[0], point2[1], point2[2]])
            self.setAttribute("position", new THREE.BufferAttribute(positions, 3))
          }}
        />
        <lineBasicMaterial attach="material" color="red" linewidth={2} />
      </line>
    </group>
  )
}

// Camera controller
const CameraController = ({ position, target }) => {
  const { camera } = useThree()

  useEffect(() => {
    if (position && target) {
      camera.position.set(...position)
      if (typeof camera.lookAt === "function") {
        camera.lookAt(new THREE.Vector3(...target))
      }
      camera.updateProjectionMatrix()
    }
  }, [camera, position, target])

  return null
}

// Main ThreeDViewer component
export function ThreeDViewer({ plyUrl, cameraPosition, cameraTarget, measurePoints, useSimpleVisualization = false }) {
  const [isLoading, setIsLoading] = useState(true)
  const [modelExists, setModelExists] = useState(false)

  useEffect(() => {
    // Check if the PLY file exists
    const checkFile = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(plyUrl, { method: "HEAD" })
        setModelExists(response.ok)
      } catch (error) {
        console.error("Error checking PLY file:", error)
        setModelExists(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkFile()
  }, [plyUrl])

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center">
            <Spinner className="h-8 w-8 text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Checking for 3D model...</p>
          </div>
        </div>
      )}

      <Canvas>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
        <CameraController position={cameraPosition} target={cameraTarget} />

        <Suspense
          fallback={
            <Html center>
              <Spinner className="h-8 w-8 text-primary" />
            </Html>
          }
        >
          <Environment preset="apartment" />
          {modelExists ? <PLYModel url={plyUrl} useSimpleVisualization={useSimpleVisualization} /> : <FallbackScene />}
          {measurePoints && measurePoints.length >= 2 && <MeasurementVisualization points={measurePoints} />}
          <OrbitControls enableDamping dampingFactor={0.05} />
        </Suspense>
      </Canvas>

      {!isLoading && !modelExists && (
        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg border">
          <p className="text-xs text-muted-foreground">Using demo 3D scene (PLY file not found)</p>
        </div>
      )}
    </div>
  )
}