import { useMemo, useRef } from 'react';
import InteractiveFX from './InteractiveFX/InteractiveFX';
import { PlaneGeometry, RepeatWrapping, Vector2, Vector3 } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { WaterSimple } from './Water/WaterSimple';

type Props = {
	fxType?: string;
	width?: number;
	length?: number;
	dimensions?: number;
	waterColor?: number;
};

export default function WaterSurfaceSimple({
	fxType = 'ripple',
	width = 190,
	length = 190,
	dimensions = 1024,
	waterColor = 0x000000,
}: Props) {
	const ref = useRef<any>();
	const refPointer = useRef(new Vector2(0, 0));

	const gl = useThree((state) => state.gl);
	const waterNormals = useTexture('/water/simple/waternormals.jpeg');
	waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping;
	const geom = useMemo(() => new PlaneGeometry(width, length), []);
	const config = useMemo(
		() => ({
			textureWidth: dimensions,
			textureHeight: dimensions,
			waterNormals,
			sunDirection: new Vector3(),
			sunColor: 0x000000,
			waterColor: waterColor,
			distortionScale: 0.7,
			fog: false,
			format: (gl as any).encoding,
		}),
		[waterNormals]
	);
	useFrame(
		(state, delta) =>
			(ref.current.material.uniforms.time.value += delta / 2)
	);

	//const refPointer = useRef(new Vector2(0, 0));

	const waterObj = useMemo(
		() => new WaterSimple(geom, config),
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
