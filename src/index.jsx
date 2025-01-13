import './style.css';
import React, { useState, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';

const Experience = React.lazy(() => import('./Experience.jsx'));

const root = ReactDOM.createRoot(document.querySelector('#root'));

const App = () => {
    const [showExperience, setShowExperience] = useState(false);

    return (
        <>
            {!showExperience ? (
                <div className="start-screen">
                    <div className="game-description">
                        <h1 className="custom-font1">Survival Game</h1>
                        <p className="custom-font">
                            Your mission is to survive for as long as you can! You have three key parameters to monitor: Life, Health, and Fatigue. Keep these levels above the minimum to stay alive and thriving.
                        </p>
                        <p className="custom-font">
                            Be smart with your resources and make strategic choices to maximize your survival time. Every decision counts—stay alert and adapt to the challenges ahead!
                        </p>
                        <button className="start-button" onClick={() => setShowExperience(true)}>
                            Start
                        </button>
                    </div>

                </div>
            ) : (
                <Suspense fallback={
                    <div className="loading-screen">
                        <div className="loading-text">Loading</div>
                        <div className="loading-circle">
                            <div className="loading-circle-dot"></div>
                            <div className="loading-circle-dot"></div>
                            <div className="loading-circle-dot"></div>
                        </div>
                    </div>
                }>
                    <Canvas
                        className="r3f"
                        camera={{
                            fov: 45,
                            near: 0.1,
                            far: 2000,
                            position: [-4, -0.4, 0],
                            rotation: [0, -1.4, 0],
                        }}
                    >
                        <Experience />
                    </Canvas>
                </Suspense>
            )}
        </>
    );
};

root.render(<App />);