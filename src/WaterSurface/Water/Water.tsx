//ForwardRef function

import { useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { forwardRef, useMemo, useRef } from 'react';
import { PlaneGeometry, RepeatWrapping, Vector2, Vector3 } from 'three';

import { WaterSimple } from './WaterImpl/WaterSimple';
import { WaterComplex } from './WaterImpl/WaterComplex';

type Props = {
	refPointer: React.MutableRefObject<Vector2>;
};

const WaterSimpleType = forwardRef(function Water(props: Props, ref: any) {
	//const ref = useRef<any>();
	const gl = useThree((state) => state.gl);
	const waterNormals = useTexture('/water/simple/waternormals.jpeg');
	waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping;
	const geom = useMemo(() => new PlaneGeometry(190, 190), []);
	const config = useMemo(
		() => ({
			textureWidth: 1024,
			textureHeight: 1024,
			waterNormals,
			sunDirection: new Vector3(),
			sunColor: 0x000000,
			waterColor: 0x000000,
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
		props.refPointer.current = e.uv.multiplyScalar(2).subScalar(1);
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
		</>
	);
});

const WaterComplexType = forwardRef(function WaterComplexType(
	props: Props,
	ref: any
) {
	//const ref = useRef();
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
		props.refPointer.current = e.uv.multiplyScalar(2).subScalar(1);
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
		</>
	);
});

export { WaterSimpleType, WaterComplexType };
