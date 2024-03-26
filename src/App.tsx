import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import { OrbitControls } from '@react-three/drei';
import { Leva } from 'leva';

function App() {
	return (
		<>
			<Leva collapsed />
			<div className='background-canvas'>
				<Canvas camera={{ position: [12, 1, 6] }}>
					<Scene />

					<OrbitControls
						minPolarAngle={0}
						maxPolarAngle={Math.PI / 2}
					/>
				</Canvas>
			</div>
		</>
	);
}

export default App;
