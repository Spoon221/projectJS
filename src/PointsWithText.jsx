import { Html } from '@react-three/drei';
import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const points = [
    {
        position: [0.7, -0.9, 0.5],
        text: "Здесь можно зарядиться энергией"
    },
    {
        position: [0.9, -0.9, -0.5],
        text: "Здесь повышаем жизни"
    },
    {
        position: [-0.8, -1, -0.7],
        text: "Здесь зарабатываем деньги"
    }
];

const TrianglePlayer = () => {
    const [targetPosition, setTargetPosition] = useState(points[0].position);
    const [currentPosition, setCurrentPosition] = useState(points[0].position);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const triangleRef = useRef();

    useFrame(() => {
        // Плавное перемещение треугольника к целевой позиции
        const lerpFactor = 0.1;
        const newPosition = currentPosition.map((coord, index) => 
            coord + (targetPosition[index] - coord) * lerpFactor
        );
        setCurrentPosition(newPosition);
        triangleRef.current.position.set(...newPosition);
    });

    const handleCircleClick = (index) => {
        setTargetPosition(points[index].position);
    };

    return (
        <>
            {points.map((point, index) => (
                <group key={index}>
                    {/* Круг */}
                    <mesh
                        position={point.position}
                        onClick={() => handleCircleClick(index)}
                        onPointerEnter={() => setHoveredIndex(index)}
                        onPointerLeave={() => setHoveredIndex(null)}
                    >
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshBasicMaterial color="white" />
                    </mesh>

                    {/* Текст */}
                    <Html position={point.position} style={{ opacity: hoveredIndex === index ? 1 : 0, transition: 'opacity 0.3s' }}>
                        <div className="point-text">
                            {point.text}
                        </div>
                    </Html>
                </group>
            ))}

            {/* Треугольник */}
            <mesh ref={triangleRef}>
                <coneGeometry args={[0.1, 0.2, 16]} />
                <meshBasicMaterial color="red" />
            </mesh>
        </>
    );
};

export default TrianglePlayer;