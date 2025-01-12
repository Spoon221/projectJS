import './style.css';
import ReactDOM from 'react-dom/client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import Experience from './Experience.jsx';

const root = ReactDOM.createRoot(document.querySelector('#root'));

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
    </>
);