import { Perf } from 'r3f-perf';

import { Environment } from '@react-three/drei';
import WaterSurfaceSimple from './WaterSurface/WaterSurfaceSimple';
import WaterSurfaceComplex from './WaterSurface/WaterSurfaceComplex';

export default function Scene() {
	return (
		<>
			<Perf position={'top-left'} />

			<Environment preset='studio' background />

			<ambientLight />
			<mesh>
				<boxGeometry attach='geometry' args={[5, 5, 5]} />
				<meshStandardMaterial attach='material' color='hotpink' />
			</mesh>

			<WaterSurfaceSimple />

			{/* <WaterSurfaceComplex /> */}
		</>
	);
}
