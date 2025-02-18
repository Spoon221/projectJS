import { Text, Html, ContactShadows, PresentationControls, Float, Environment, useGLTF } from '@react-three/drei';
import { useState, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import sound0 from './static/foot.mp3';
import backgroundMusic from './static/fon.mp3';
import clockMusic from './static/clock.mp3';

const points = [
    { position: [0.7, -0.9, 0.5], text: "This is a place to recharge your energy." },
    { position: [0.9, -0.9, -0.5], text: "Here, you can restore your life." },
    { position: [-0.8, -1, -0.7], text: "In this spot, you can earn money." }
];

const StatsDisplay = ({ health, money, fatigue, timeElapsed }) => (
    <Html position={[0, 0, 0]}>
        <div className="stats-container">
            <div>Health: {health} Money: {money}</div>
            <div>Fatigue: {fatigue}</div>
            <div>Time: {timeElapsed}s</div>
        </div>
    </Html>
);

const TrianglePlayer = () => {
    const [stats, setStats] = useState({ health: 100, money: 100, fatigue: 0 });
    const [currentPosition, setCurrentPosition] = useState(points[0].position);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [currentPointIndex, setCurrentPointIndex] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [clockRotation, setClockRotation] = useState([0, 0, 0]);
    const clockModel = useGLTF('./static/clock.glb');
    const triangleRef = useRef();
    const textRef = useRef();
    const { camera } = useThree();
    const [healthAndMoneyDecreaseValue, setHealthAndMoneyDecreaseValue] = useState(2);
    useEffect(() => {
        const audio = new Audio(backgroundMusic);
        audio.volume = 0.5;
        audio.loop = true;

        audio.play().catch(error => {
            console.error("Failed to play background music:", error);
        });

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    useEffect(() => {
        if (!gameOver) {
            const clockInterval = setInterval(() => {
                const audio = new Audio(clockMusic);
                audio.volume = 0.5;
                audio.play().catch(error => {
                    console.error("Failed to play sound:", error);
                });

                // Анимация тряски часов
                setClockRotation([0.1, 0, 0]);
                setTimeout(() => {
                    setClockRotation([-0.1, 0, 0]);
                }, 150);
                setTimeout(() => {
                    setClockRotation([0.1, 0, 0]);
                }, 300);
                setTimeout(() => {
                    setClockRotation([-0.1, 0, 0]);
                }, 450);
            }, 10000);
            return () => {
                clearInterval(clockInterval);
            };
        }
    }, [gameOver]);

    useEffect(() => {
        if (!gameOver) {
            const timerInterval = setInterval(() => {
                setTimeElapsed(prevTime => prevTime + 1);
            }, 1000);

            return () => clearInterval(timerInterval);
        }
    }, [gameOver]);

    useEffect(() => {
        if (!gameOver) {
            const increaseDecreaseValueInterval = setInterval(() => {
                setHealthAndMoneyDecreaseValue(prevValue => prevValue + 2);
            }, 10000);
            return () => clearInterval(increaseDecreaseValueInterval);
        }
    }, [gameOver]);

    useEffect(() => {
        if (!gameOver) {
            const oneSecondInterval = setInterval(() => {
                setStats(prevStats => {
                    let newHealth = prevStats.health;
                    let newMoney = prevStats.money;
                    let newFatigue = prevStats.fatigue;

                    if (currentPointIndex === 0) {
                        newFatigue = Math.max(0, prevStats.fatigue - 4);
                    }

                    if (currentPointIndex === 1) {
                        newHealth = Math.min(100, prevStats.health + 2);
                        newMoney = Math.max(0, prevStats.money - 2);
                    }

                    if (currentPointIndex === 2) {
                        newMoney = Math.min(101, prevStats.money + 3);
                    }

                    if (currentPointIndex !== 1) {
                        newHealth = Math.max(0, newHealth - healthAndMoneyDecreaseValue);
                        newMoney = Math.max(0, newMoney - healthAndMoneyDecreaseValue);
                    }

                    newFatigue = Math.min(100, newFatigue + 3);

                    return {
                        health: newHealth,
                        money: newMoney,
                        fatigue: newFatigue,
                    };
                });
            }, 1000);

            return () => clearInterval(oneSecondInterval);
        }
    }, [currentPointIndex, gameOver, healthAndMoneyDecreaseValue]);

    useEffect(() => {
        if (stats.health <= 0 || stats.fatigue >= 100 || stats.money <= 0) {
            setGameOver(true);
        }
    }, [stats]);

    useFrame(() => {
        if (triangleRef.current && points[currentPointIndex]) {
            const lerpFactor = 0.1;
            const newPosition = currentPosition.map((coord, index) =>
                coord + (points[currentPointIndex].position[index] - coord) * lerpFactor
            );
            setCurrentPosition(newPosition);
            triangleRef.current.position.set(...newPosition);

            if (textRef.current) {
                textRef.current.lookAt(camera.position);
            }
        }
    });

    const handleCircleClick = (index) => {
        setCurrentPointIndex(index);
        const audio0 = new Audio(sound0);
        switch (index) {
            case 0:
                setStats(prevStats => ({
                    ...prevStats,
                    fatigue: Math.max(0, prevStats.fatigue - 2),
                }));
                audio0.play()
                break;
            case 1:
                setStats(prevStats => ({
                    ...prevStats,
                    health: Math.min(100, prevStats.health + 2),
                }));
                audio0.play()
                break;
            case 2:
                setStats(prevStats => ({
                    ...prevStats,
                    money: Math.max(0, prevStats.money - 2),
                }));
                audio0.play()
                break;
            default:
                break;
        }
    };

    const handleRestart = () => {
        setStats({ health: 100, money: 100, fatigue: 0 });
        setCurrentPointIndex(0);
        setCurrentPosition(points[0].position);
        setGameOver(false);
        setTimeElapsed(0);
        setHealthAndMoneyDecreaseValue(2);
    };

    return (
        <>
            <PresentationControls
                global
                rotation={[0.01, 0.01, 0]}
                polar={[-0.4, 0.2]}
                azimuth={[-1, 0.75]}
                config={{ mass: 2, tension: 400 }}
                snap={{ mass: 4, tension: 400 }}
            >
                <StatsDisplay health={stats.health} money={stats.money} fatigue={stats.fatigue} timeElapsed={timeElapsed} />
                <Html position={[0, 0, -0.5]} style={{ opacity: 1, transition: 'opacity 0.3s' }}>
                    {gameOver ? (
                        <div className="game-over">
                            <h1>Game Over</h1>
                            <p>You lost!</p>
                            <p>Time survived: {timeElapsed}s</p>
                            <button onClick={handleRestart}>Restart the level</button>
                        </div>
                    ) : (
                        <div />
                    )}
                </Html>
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
                <primitive
                    object={clockModel.scene}
                    position={[-0.56, -0.75, 0.75]}
                    rotation={clockRotation}
                    rotation-y={Math.PI / 1.25}
                    scale={[0.5, 0.5, 0.5]}
                />
                <mesh ref={triangleRef} rotation={[Math.PI, 0, 0]} position={currentPosition}>
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
            </PresentationControls>
        </>
    );
};

export default TrianglePlayer;