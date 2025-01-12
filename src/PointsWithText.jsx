import { Html, Text } from '@react-three/drei';
import { useState, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

const points = [
    { position: [0.7, -0.9, 0.5], text: "Это первая точка." },
    { position: [0.9, -0.9, -0.5], text: "Вторая точка." },
    { position: [-0.8, -1, -0.7], text: "Третья точка." }
];

const StatsDisplay = ({ health, money, fatigue }) => (
    <Html position={[0, 0, 0]}>
        <div className="stats-container">
            <div>Health: {health} Money: {money}</div>
            <div>Fatigue: {fatigue}</div>
        </div>
    </Html>
);

const TrianglePlayer = () => {
    const [stats, setStats] = useState({ health: 100, money: 500, fatigue: 0 });
    const [targetPosition, setTargetPosition] = useState(points[0].position);
    const [currentPosition, setCurrentPosition] = useState(points[0].position);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const triangleRef = useRef();
    const textRef = useRef();

    const { camera } = useThree();

    useFrame(() => {
        const lerpFactor = 0.1;
        const newPosition = currentPosition.map((coord, index) =>
            coord + (targetPosition[index] - coord) * lerpFactor
        );
        setCurrentPosition(newPosition);
        triangleRef.current.position.set(...newPosition);

        if (textRef.current) {
            textRef.current.lookAt(camera.position);
        }
    });

    const handleCircleClick = (index) => {
        setTargetPosition(points[index].position);

        switch (index) {
            case 0:
                setStats(prevStats => ({
                    ...prevStats,
                    money: prevStats.money + 2,
                    fatigue: Math.max(0, prevStats.fatigue - 2),
                }));
                break;
            case 1:
                setStats(prevStats => ({
                    ...prevStats,
                    health: Math.min(100, prevStats.health + 2),
                }));
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prevStats => ({
                health: Math.max(0, prevStats.health - 1),
                money: Math.max(0, prevStats.money - 2),
                fatigue: Math.min(100, prevStats.fatigue + 2),
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <StatsDisplay health={stats.health} money={stats.money} fatigue={stats.fatigue} />

            {points.map((point, index) => (
                <group key={index}>
                    <mesh
                        position={point.position}
                        onClick={() => handleCircleClick(index)}
                        onPointerEnter={() => setHoveredIndex(index)}
                        onPointerLeave={() => setHoveredIndex(null)}
                    >
                        <sphereGeometry args={[0.04, 16, 16]} />
                        <meshBasicMaterial color="#ff7777" />
                    </mesh>

                    <Html position={point.position} style={{ opacity: hoveredIndex === index ? 1 : 0, transition: 'opacity 0.3s' }}>
                        <div className="point-text">
                            {point.text}
                        </div>
                    </Html>
                </group>
            ))}

            <mesh ref={triangleRef} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.1, 0.2, 16]} />
                <meshBasicMaterial color="#77ff77" />
            </mesh>

            <Text
                font="./bangers-v20-latin-regular.woff"
                ref={textRef}
                position={[currentPosition[0], currentPosition[1] + 0.3, currentPosition[2]]}
                fontSize={0.1}
                color="#7777FF"
                anchorX="center"
                anchorY="middle"
            >
                you
            </Text>
        </>
    );
};

export default TrianglePlayer;