import './style.css';
import ReactDOM from 'react-dom/client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import Experience from './Experience.jsx';

const root = ReactDOM.createRoot(document.querySelector('#root'));

function CameraControls() {
    const { camera } = useThree();

    const { positionX, positionY, positionZ, rotationX, rotationY, rotationZ } = useControls('Camera', {
        positionX: { value: -3, min: -10, max: 10, step: 0.1 },
        positionY: { value: 1.5, min: -10, max: 10, step: 0.1 },
        positionZ: { value: 4, min: -10, max: 10, step: 0.1 },
        rotationX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
        rotationY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
        rotationZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    });

    useFrame(() => {
        camera.position.set(positionX, positionY, positionZ);
        camera.rotation.set(rotationX, rotationY, rotationZ);
    });

    return null; 
}

root.render(
    <Canvas
        className="r3f"
        camera={{
            fov: 45,
            near: 0.1,
            far: 2000,
            position: [-4, -0.4, 0], // Устанавливаем позицию камеры
            rotation: [0, -1.4, 0], // Устанавливаем вращение камеры
        }}
    >
        <Experience />
    </Canvas>
);