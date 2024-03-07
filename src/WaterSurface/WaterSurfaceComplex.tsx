import { useMemo, useRef } from 'react';
import InteractiveFX from './InteractiveFX/InteractiveFX';
import { PlaneGeometry, Vector2 } from 'three';
import { useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { WaterComplex } from './Water/WaterComplex';

export default function WaterSurfaceComplex({ fxType = 'fluid' }: any) {
	const ref = useRef<any>();
	const refPointer = useRef(new Vector2(0, 0));

	const gl = useThree((state) => state.gl);
	const [waterNormals1, waterNormals2] = useTexture([
		'/water/complex/Water_1_M_Normal.jpg',
		'/water/complex/Water_2_M_Normal.jpg',
	]);
	//waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping;
	const geom = useMemo(() => new PlaneGeometry(190, 190), []);
	const config = useMemo(
		() => ({
			color: 0xffffff,
			scale: 11,
			flowDirection: new Vector2(1.0, 0.5),
			flowSpeed: 0.05,
			textureWidth: 1024,
			textureHeight: 1024,
			normalMap0: waterNormals1,
			normalMap1: waterNormals2,
			reflectivity: 1.2,
			encoding: (gl as any).encoding,
		}),
		[waterNormals1, waterNormals2]
	);

	//const refPointer = useRef(new Vector2(0, 0));

	const waterObj = useMemo(
		() => new WaterComplex(geom, config),
		[geom, config]
	);

	const handlePointerMove = (e: any) => {
		refPointer.current = e.uv.multiplyScalar(2).subScalar(1);
		//console.log(e.uv);
	};

	return (
		<>
			<primitive
				ref={ref}
				onPointerMove={handlePointerMove}
				object={waterObj}
				rotation-x={-Math.PI / 2}
				position={[0, -5, 0]}
			/>

			<InteractiveFX
				fxType={fxType}
				materialRef={ref}
				refPointer={refPointer}
				splatRadius={0.00001}
			/>
		</>
	);
}
