import { useState, useEffect } from 'react';
import { Text, Html, ContactShadows, PresentationControls, Float, Environment, useGLTF } from '@react-three/drei';
import { FaGithub } from "react-icons/fa";
import SnowParticles from './SnowParticles';
import PointsWithText from './PointsWithText';

export default function GameExperience() {
    const gameComputerModel = useGLTF('/static/scene.glb');

    const [showPointsHints, setShowPointsHints] = useState(true);
    const [isGameLoading, setIsGameLoading] = useState(true);
    const [clockRotation, setClockRotation] = useState([0, 0, 0]);

    useEffect(() => {
        const handleGameLoading = () => {
            const timeout = setTimeout(() => {
                setIsGameLoading(false);
            }, 3000);

            return () => clearTimeout(timeout);
        };

        handleGameLoading();
    }, []);

    return (
        <>
            {(<>
                <color args={['#241a1a']} attach="background" />
                <Environment preset="city" />
                <PresentationControls
                    global
                    rotation={[0.13, 0.1, 0]}
                    polar={[-0.4, 0.2]}
                    azimuth={[-1, 0.75]}
                    config={{ mass: 2, tension: 400 }}
                    snap={{ mass: 4, tension: 400 }}
                >
                    <rectAreaLight
                        width={2.5}
                        height={1.65}
                        intensity={65}
                        color={'#ff6900'}
                        rotation={[-0.1, Math.PI, 0]}
                        position={[0, 0.55, -1.15]}
                    />

                    <primitive
                        object={gameComputerModel.scene}
                        position-y={-1.2}
                        rotation-x={-0.14}
                    >
                        <Html
                            transform
                            wrapperClass="gitIcon"
                            distanceFactor={1.17}
                            position={[-0.9, 1.7, -2.3]}
                            rotation-x={-0.256}
                        >
                            <a
                                href="https://github.com/Spoon221"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                                    <FaGithub size={50} color="#ffffff" /> { }
                                    <p style={{ margin: 0, color: '#ffffff', fontSize: '14px' }}>GitHub</p>
                                </div>
                            </a>
                        </Html>
                    </primitive>

                    <GameTitle
                        font="./bangers-v20-latin-regular.woff"
                        fontSize={1}
                        position={[2, 0.75, 0.75]}
                        rotation-y={-1.25}
                        maxWidth={2}
                    >
                        Evgenii Simakov
                    </GameTitle>
                    <Text
                        font="./bangers-v20-latin-regular.woff"
                        fontSize={0.1} position={[-1.05, -1.2, -0.65]}
                        rotation-y={-1.5}
                        maxWidth={4} >
                        Made on React & THREE JS
                    </Text>
                    <SnowParticles count={1000} radius={2} position={[2, 0.75, 0.75]} />
                </PresentationControls>
                <PointsWithText showHints={showPointsHints} />
            </>
            )}
        </>
    );
}

function GameTitle(props) {
    return <Text {...props} />;
}