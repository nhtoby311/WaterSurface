import { useMemo, useRef } from 'react';
import { PlaneGeometry, Vector2 } from 'three';
import { useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { WaterComplex } from './Water/WaterComplex';
import { WaterContext } from './WaterContext';

type Props = {
	children?: React.ReactNode;
	position?: [number, number, number];
	width?: number;
	length?: number;
	color?: number | string;
	scale?: number;
	flowDirection?: Vector2 | [number, number];
	flowSpeed?: number;
	dimensions?: number;
	reflectivity?: number;
	fxDistortionFactor?: number;
	fxDisplayColorAlpha?: number;
};

export default function WaterSurfaceComplex({
	children,
	position,
	width = 190,
	length = 190,
	color,
	scale = 11,
	flowDirection = new Vector2(1.0, 0.5),
	flowSpeed = 0.05,
	dimensions = 1024,
	reflectivity = 1.2,
	fxDistortionFactor = 0.2,
	fxDisplayColorAlpha = 0.0,
}: Props) {
	const ref = useRef<any>();
	const refPointer = useRef(new Vector2(0, 0));

	const gl = useThree((state) => state.gl);
	const [waterNormals1, waterNormals2] = useTexture([
		'/water/complex/Water_1_M_Normal.jpg',
		'/water/complex/Water_2_M_Normal.jpg',
	]);
	//waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping;
	const geom = useMemo(
		() => new PlaneGeometry(width, length),
		[length, width]
	);
	const config = useMemo(
		() => ({
			color: color,
			scale: scale,
			flowDirection: flowDirection as Vector2,
			flowSpeed: flowSpeed,
			textureWidth: dimensions,
			textureHeight: dimensions,
			normalMap0: waterNormals1,
			normalMap1: waterNormals2,
			reflectivity: reflectivity,
			encoding: (gl as any).encoding,
			fxDistortionFactor: fxDistortionFactor,
			fxDisplayColorAlpha: fxDisplayColorAlpha,
		}),
		[
			color,
			dimensions,
			flowDirection,
			flowSpeed,
			fxDisplayColorAlpha,
			fxDistortionFactor,
			gl,
			reflectivity,
			scale,
			waterNormals1,
			waterNormals2,
		]
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
		<WaterContext.Provider value={{ ref, refPointer }}>
			<primitive
				ref={ref}
				onPointerMove={handlePointerMove}
				object={waterObj}
				rotation-x={-Math.PI / 2}
				position={position}
			/>

			{children}
		</WaterContext.Provider>
	);
}
