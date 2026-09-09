import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ── react-three-fiber shader background, adapted for Al Nojoom's light hero ──
   Converted from the shadcn/Tailwind/TS component to plain JSX. The ShaderPlane
   is a three.js mesh, so it's composed inside a <Canvas> here and sized to fill
   the full viewport. Recolored from the original orange (#ff5722) to wine, over
   a transparent canvas so the light hero shows through. Honors reduced-motion.
   (The original EnergyRing was dropped — it read as a circle over the content.) */

const vertexShader = `
  uniform float time;
  uniform float intensity;
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;

    vec3 pos = position;
    pos.y += sin(pos.x * 10.0 + time) * 0.1 * intensity;
    pos.x += cos(pos.y * 8.0 + time * 1.5) * 0.05 * intensity;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  uniform float intensity;
  uniform vec3 color1;
  uniform vec3 color2;
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vec2 uv = vUv;

    // Create animated noise pattern
    float noise = sin(uv.x * 20.0 + time) * cos(uv.y * 15.0 + time * 0.8);
    noise += sin(uv.x * 35.0 - time * 2.0) * cos(uv.y * 25.0 + time * 1.2) * 0.5;

    // Mix colors based on noise and position
    vec3 color = mix(color1, color2, noise * 0.5 + 0.5);
    color = mix(color, vec3(1.0), pow(abs(noise), 2.0) * intensity);

    // Even, full-width wash that fades softly only near the outer edges
    // (instead of the tight centered radial that looked like a blob).
    float fade = smoothstep(1.5, 0.2, length(uv - 0.5));

    gl_FragColor = vec4(color, fade * 0.5);
  }
`;

function ShaderPlane({
  color1 = "#ffffff", // wine
  color2 = "#ded0d6", // rose (was #ffffff)
  speed = 0.25, // animation speed multiplier (lower = slower)
}) {
  const mesh = useRef(null);
  // Size the plane to the full viewport (in world units) so it fills the hero
  // edge to edge. Overscale slightly so the vertex wobble never reveals a gap.
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      intensity: { value: 1.0 },
      color1: { value: new THREE.Color(color1) },
      color2: { value: new THREE.Color(color2) },
    }),
    [color1, color2]
  );

  useFrame((state) => {
    if (mesh.current) {
      const t = state.clock.elapsedTime * speed;
      uniforms.time.value = t;
      uniforms.intensity.value = 1.0 + Math.sin(t * 2) * 0.5;
    }
  });

  return (
    <mesh
      ref={mesh}
      scale={[(viewport.width / 2) * 1.2, (viewport.height / 2) * 1.2, 1]}
    >
      <planeGeometry args={[2, 2, 32, 32]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function PaperShaderBackground({ className = "" }) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      className={className}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none", // clicks pass through to hero content
      }}
    >
      <Canvas
        dpr={[1, 1.5]} // cap pixel density for performance
        camera={{ position: [0, 0, 5], fov: 75 }}
        frameloop={prefersReducedMotion ? "demand" : "always"}
        gl={{ alpha: true, antialias: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <ShaderPlane />
      </Canvas>
    </div>
  );
}
