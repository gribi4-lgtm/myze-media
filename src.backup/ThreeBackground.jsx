import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        const W = mount.clientWidth;
        const H = mount.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
        camera.position.z = 3;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        // Particles — dark on light
        const COUNT = 1800;
        const positions = new Float32Array(COUNT * 3);

        for (let i = 0; i < COUNT; i++) {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 12;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const mat = new THREE.PointsMaterial({
            size: 0.02,
            color: new THREE.Color(0xB65F46),
            transparent: true,
            opacity: 0.3,
            sizeAttenuation: true,
        });

        const particles = new THREE.Points(geo, mat);
        scene.add(particles);

        // Subtle grid lines
        const lineMat = new THREE.LineBasicMaterial({
            color: 0x2F3E46,
            transparent: true,
            opacity: 0.04,
        });
        const lineGeos = [];
        for (let i = -5; i <= 5; i++) {
            const pts1 = [new THREE.Vector3(i, -6, -2), new THREE.Vector3(i, 6, -2)];
            const pts2 = [new THREE.Vector3(-6, i, -2), new THREE.Vector3(6, i, -2)];
            const g1 = new THREE.BufferGeometry().setFromPoints(pts1);
            const g2 = new THREE.BufferGeometry().setFromPoints(pts2);
            lineGeos.push(g1, g2);
            scene.add(new THREE.Line(g1, lineMat));
            scene.add(new THREE.Line(g2, lineMat));
        }

        // Mouse parallax
        const mouse = { x: 0, y: 0 };
        const onMouseMove = (e) => {
            mouse.x = (e.clientX / window.innerWidth - 0.5) * 0.4;
            mouse.y = (e.clientY / window.innerHeight - 0.5) * -0.4;
        };
        window.addEventListener('mousemove', onMouseMove);

        let frame;
        const clock = new THREE.Clock();
        const animate = () => {
            frame = requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();
            particles.rotation.y = elapsed * 0.015;
            particles.rotation.x = elapsed * 0.008;
            camera.position.x += (mouse.x - camera.position.x) * 0.03;
            camera.position.y += (mouse.y - camera.position.y) * 0.03;
            renderer.render(scene, camera);
        };
        animate();

        const onResize = () => {
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', onResize);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            geo.dispose();
            mat.dispose();
            lineMat.dispose();
            lineGeos.forEach(g => g.dispose());
            renderer.dispose();
            if (mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        />
    );
}
