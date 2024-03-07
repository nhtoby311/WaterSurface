import { Perf } from 'r3f-perf';

import { Environment } from '@react-three/drei';
import WaterSurfaceSimple from './WaterSurface/WaterSurfaceSimple';
import WaterSurfaceComplex from './WaterSurface/WaterSurfaceComplex';
import { useControls, folder } from 'leva';

export default function Scene() {
	const controls = useControls({
		waterType: {
			value: 'simple',
			options: ['simple', 'complex'],
		},

		planeSize: {
			value: 190,
		},
	});

	return (
		<>
			<Perf position={'top-left'} />

			<Environment preset='park' background />

			<ambientLight />
			<mesh>
				<boxGeometry attach='geometry' args={[5, 5, 5]} />
				<meshStandardMaterial attach='material' color='hotpink' />
			</mesh>

			{controls.waterType === 'simple' ? (
				<WaterSurfaceSimple />
			) : (
				<WaterSurfaceComplex />
			)}
		</>
	);
}
