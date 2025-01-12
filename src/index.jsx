import './style.css';
import ReactDOM from 'react-dom/client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import Experience from './Experience.jsx';

const root = ReactDOM.createRoot(document.querySelector('#root'));

function StatsControls() {
    const { health, money, fatigue } = useControls('Stats', {
        health: { value: 100, min: 0, max: 100, step: 1 },
        money: { value: 500, min: 0, max: 10000, step: 10 },
        fatigue: { value: 0, min: 0, max: 100, step: 1 },
    });

    return (
        <div style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '10px',
            borderRadius: '5px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px'
        }}>
            <div>Health: {health}</div>
            <div>Money: {money}</div>
            <div>Fatigue: {fatigue}</div>
        </div>
    );
}

root.render(
    <>
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
        <StatsControls />
    </>
);