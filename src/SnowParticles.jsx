import React, { useRef, useMemo } from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const SnowParticles = ({ count = 1000, radius = 2 }) => {
    const pointsRef = useRef();

    // Генерация случайных позиций для частиц
    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const x = Math.random() * radius * 2 - radius; // Случайная координата X
            const y = Math.random() * radius * 2; // Случайная координата Y
            const z = Math.random() * radius * 2 - radius; // Случайная координата Z
            positions[i * 3] = x; // X
            positions[i * 3 + 1] = y; // Y
            positions[i * 3 + 2] = z; // Z
        }
        return positions;
    }, [count, radius]);

    // Анимация частиц (падение снега)
    useFrame((state, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.1; // Медленное вращение
            const positions = pointsRef.current.geometry.attributes.position.array;
            for (let i = 1; i < positions.length; i += 3) {
                positions[i] -= delta * 0.5; // Падение вниз
                if (positions[i] < -radius * 2) {
                    positions[i] = radius * 2; // Перемещение частицы вверх, если она упала слишком низко
                }
            }
            pointsRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <Points ref={pointsRef} positions={particles}>
            <PointMaterial
                transparent
                color="white"
                size={0.05}
                sizeAttenuation={true}
                alphaTest={0.5}
                opacity={0.8}
            />
        </Points>
    );
};

export default SnowParticles;