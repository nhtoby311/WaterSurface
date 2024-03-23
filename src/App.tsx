import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import { OrbitControls } from '@react-three/drei';

function App() {
	return (
		<>
			<div className='background-canvas'>
				<Canvas>
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
