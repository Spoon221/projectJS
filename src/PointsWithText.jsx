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
    const [currentPointIndex, setCurrentPointIndex] = useState(0);

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
        setCurrentPointIndex(index);

        switch (index) {
            case 0:
                setStats(prevStats => ({
                    ...prevStats,
                    fatigue: Math.max(0, prevStats.fatigue - 2),
                }));
                break;
            case 1:
                setStats(prevStats => ({
                    ...prevStats,
                    health: Math.min(100, prevStats.health + 2),
                }));
                break;
            case 2:
                setStats(prevStats => ({
                    ...prevStats,
                    money: Math.max(0, prevStats.money - 2),
                }));
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prevStats => {
                let newHealth = prevStats.health;
                let newMoney = prevStats.money;
                let newFatigue = prevStats.fatigue;

                // Если на точке 1, уменьшаем усталость на 2
                if (currentPointIndex === 0) {
                    newFatigue = Math.max(0, prevStats.fatigue - 2);
                }

                // Если на точке 2, увеличиваем здоровье на 2
                if (currentPointIndex === 1) {
                    newHealth = Math.min(100, prevStats.health + 2);
                }

                // Если на точке 3, увеличиваем деньги на 2
                if (currentPointIndex === 2) {
                    newMoney = Math.min(1000, prevStats.money + 2);
                }

                // Уменьшаем здоровье и деньги каждую секунду, если не на точке 2
                if (currentPointIndex !== 1) {
                    newHealth = Math.max(0, newHealth - 1);
                    newMoney = Math.max(0, newMoney - 1);
                }

                // Увеличиваем усталость каждую секунду
                newFatigue = Math.min(100, newFatigue + 1);

                return {
                    health: newHealth,
                    money: newMoney,
                    fatigue: newFatigue,
                };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [currentPointIndex]);

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
                        <meshBasicMaterial color="#ff777" />
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