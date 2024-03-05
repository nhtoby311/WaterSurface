import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import { OrbitControls } from '@react-three/drei';

function App() {
	return (
		<>
			<div className='background-canvas'>
				<Canvas>
					<Scene />

					<OrbitControls />
				</Canvas>
			</div>
		</>
	);
}

export default App;
