import { Perf } from 'r3f-perf';

export default function Scene() {
	return (
		<>
			<Perf position={'top-left'} />
			<ambientLight />
			<mesh>
				<boxGeometry attach='geometry' args={[1, 1, 1]} />
				<meshStandardMaterial attach='material' color='hotpink' />
			</mesh>
		</>
	);
}
