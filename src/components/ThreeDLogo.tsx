import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

export default function ThreeDLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    
    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      1,
      1000
    );
    camera.position.z = 350;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 4. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(150, 150, 250);
    scene.add(dirLight);

    // Cyan accent light from top-right
    const pointLight1 = new THREE.PointLight(0x38bdf8, 2.5, 600);
    pointLight1.position.set(200, 200, 100);
    scene.add(pointLight1);

    // Purple accent light from bottom-left
    const pointLight2 = new THREE.PointLight(0xe879f9, 2.5, 600);
    pointLight2.position.set(-200, -200, 100);
    scene.add(pointLight2);

    let logoGroup: THREE.Group | null = null;
    const targetRotation = { x: 0, y: 0 };
    const currentRotation = { x: 0, y: 0 };

    // 5. Load SVG and Extrude
    const loader = new SVGLoader();
    loader.load(
      "/logo_vector_color.svg",
      (data) => {
        const paths = data.paths;
        logoGroup = new THREE.Group();

        paths.forEach((path) => {
          // Parse fill color
          const userData = path.userData as any;
          const fillColor = userData?.style?.fill;
          const material = new THREE.MeshStandardMaterial({
            color: fillColor ? new THREE.Color(fillColor) : 0xa78bfa,
            roughness: 0.2,
            metalness: 0.65,
            side: THREE.DoubleSide,
            depthWrite: true,
          });

          const shapes = SVGLoader.createShapes(path);
          shapes.forEach((shape) => {
            const geometry = new THREE.ExtrudeGeometry(shape, {
              depth: 10,
              bevelEnabled: true,
              bevelThickness: 1.5,
              bevelSize: 0.8,
              bevelSegments: 4,
              curveSegments: 12,
            });

            const mesh = new THREE.Mesh(geometry, material);
            logoGroup?.add(mesh);
          });
        });

        // Center the logo group's children relative to its local origin
        const box = new THREE.Box3().setFromObject(logoGroup);
        const center = box.getCenter(new THREE.Vector3());

        logoGroup.children.forEach((child) => {
          child.position.x -= center.x;
          child.position.y -= center.y;
          child.position.z -= center.z;
        });

        scene.add(logoGroup);
        updateScale();
      },
      undefined,
      (error) => {
        console.error("Error loading SVG for 3D model:", error);
      }
    );

    // 6. Responsive Scaling Helper
    const updateScale = () => {
      if (!logoGroup) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const minDimension = Math.min(width, height);
      
      // Calculate responsive scale factor
      const targetSize = Math.min(minDimension * 0.45, 420);
      const originalSVGDimension = 382;
      const scale = targetSize / originalSVGDimension;
      
      // Flip Y axis because SVG origin is top-left while WebGL is bottom-left
      logoGroup.scale.set(scale, -scale, scale);
    };

    // 7. Mouse Interaction Tracker
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Tilts away from the cursor (pushing the mouse-side edge in)
      targetRotation.x = y * 0.6; 
      targetRotation.y = -x * 0.6; 
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 8. Handle Resize
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      updateScale();
    };

    window.addEventListener("resize", handleResize);

    // 9. Animation Tick Loop
    let animationFrameId: number;
    
    // Slow ambient rotation offset over time
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.003;

      if (logoGroup) {
        // Interpolate mouse movement rotation (lerp)
        currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
        currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;

        // Apply mouse tilts and add a subtle background floating animation
        logoGroup.rotation.x = currentRotation.x + Math.sin(time) * 0.1;
        logoGroup.rotation.y = currentRotation.y + Math.cos(time * 0.8) * 0.1;
        logoGroup.position.y = Math.sin(time * 1.2) * 10; // floating translation
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
