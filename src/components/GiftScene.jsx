import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, ContactShadows, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function Present({ onOpen }) {
  const group = useRef()
  const lid = useRef()
  const pointer = useRef({ x: 0, y: 0 })
  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.16
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, pointer.current.y * 0.14, 3, delta)
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, -pointer.current.x * 0.12, 3, delta)
  })
  return (
    <group ref={group} position={[0, -0.05, 0]} onPointerMove={(event) => { pointer.current.x = event.pointer.x; pointer.current.y = event.pointer.y }} onClick={onOpen}>
      <mesh castShadow receiveShadow position={[0, -0.15, 0]}><boxGeometry args={[1.45, 1.1, 1.2]} /><meshStandardMaterial color="#b76e79" roughness={0.35} metalness={0.08} /></mesh>
      <mesh castShadow position={[0, -0.15, 0.615]}><boxGeometry args={[0.2, 1.12, 0.025]} /><meshStandardMaterial color="#e9c98b" metalness={0.55} roughness={0.25} /></mesh>
      <mesh castShadow position={[0, 0.42, 0]}><boxGeometry args={[1.58, 0.22, 1.33]} /><meshStandardMaterial color="#c7848c" roughness={0.32} metalness={0.08} /></mesh>
      <mesh ref={lid} castShadow position={[0, 0.62, 0]}><boxGeometry args={[0.19, 0.08, 0.16]} /><meshStandardMaterial color="#e9c98b" metalness={0.5} roughness={0.25} /></mesh>
      <mesh castShadow position={[-0.22, 0.69, 0]} rotation={[0, 0, 0.45]}><torusGeometry args={[0.2, 0.045, 12, 32, Math.PI * 1.7]} /><meshStandardMaterial color="#e9c98b" metalness={0.48} roughness={0.24} /></mesh>
      <mesh castShadow position={[0.22, 0.69, 0]} rotation={[0, 0, -0.45]}><torusGeometry args={[0.2, 0.045, 12, 32, Math.PI * 1.7]} /><meshStandardMaterial color="#e9c98b" metalness={0.48} roughness={0.24} /></mesh>
      <mesh castShadow position={[0, 0.69, 0]}><sphereGeometry args={[0.09, 20, 20]} /><meshStandardMaterial color="#f0d99d" metalness={0.4} roughness={0.25} /></mesh>
    </group>
  )
}

export default function GiftScene({ onOpen }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [3.2, 2.45, 4.5], fov: 34 }} shadows gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={1.6} />
      <directionalLight position={[3, 5, 4]} intensity={3} castShadow shadow-mapSize={[512, 512]} />
      <pointLight position={[-3, 1, -2]} intensity={2} color="#e9c98b" />
      <Float speed={1.6} rotationIntensity={0.16} floatIntensity={0.45}>
        <Present onOpen={onOpen} />
      </Float>
      <ContactShadows position={[0, -0.8, 0]} opacity={0.24} scale={4} blur={2.2} far={2.5} />
      <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.8} />
    </Canvas>
  )
}
