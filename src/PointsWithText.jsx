import { Html, Text } from '@react-three/drei';
import { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

const points = [
    {
        position: [0.7, -0.9, 0.5],
        text: "Это первая точка. Здесь можно написать что-то важное."
    },
    {
        position: [0.9, -0.9, -0.5],
        text: "Вторая точка. Текст появляется при наведении."
    },
    {
        position: [-0.8, -1, -0.7],
        text: "Третья точка. Наведите курсор, чтобы увидеть текст."
    }
];

const TrianglePlayer = () => {
    const [targetPosition, setTargetPosition] = useState(points[0].position);
    const [currentPosition, setCurrentPosition] = useState(points[0].position);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [textColor, setTextColor] = useState("#7777FF"); // Цвет текста
    const [circleColor, setCircleColor] = useState("#ff7777"); // Цвет круга
    const [triangle, setTriangleColor] = useState("#77ff77"); // Цвет треугольника

    const triangleRef = useRef();
    const textRef = useRef();

    const { camera } = useThree(); // Получаем доступ к камере

    useFrame(() => {
        // Плавное перемещение треугольника к целевой позиции
        const lerpFactor = 0.1;
        const newPosition = currentPosition.map((coord, index) => 
            coord + (targetPosition[index] - coord) * lerpFactor
        );
        setCurrentPosition(newPosition);
        triangleRef.current.position.set(...newPosition);

        // Поворот текста "you" в сторону камеры
        if (textRef.current) {
            textRef.current.lookAt(camera.position); // Поворачиваем текст к камере
        }
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
                        <sphereGeometry args={[0.04, 16, 16]} />
                        <meshBasicMaterial color={circleColor} /> {/* Цвет круга из переменной */}
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
            <mesh ref={triangleRef} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.1, 0.2, 16]} />
                <meshBasicMaterial color={triangle} />
            </mesh>

            {/* Надпись "you" над треугольником */}
            <Text
                font="./bangers-v20-latin-regular.woff"
                ref={textRef}
                position={[currentPosition[0], currentPosition[1] + 0.3, currentPosition[2]]} // Позиция немного выше треугольника
                fontSize={0.1} // Размер текста
                color={textColor} // Цвет текста из переменной
                anchorX="center" // Центрирование по оси X
                anchorY="middle" // Центрирование по оси Y
            >
                you
            </Text>
        </>
    );
};

export default TrianglePlayer;