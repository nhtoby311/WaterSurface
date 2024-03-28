import { useMemo, useRef } from 'react';
import { WaterComplex } from './Water/WaterComplex';
import { WaterSimple } from './Water/WaterSimple';
import { PlaneGeometry, Vector2 } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { WaterContext } from './WaterContext';

type GeneralProps = {
	width?: number;
	length?: number;
	dimensions?: number;
	position?: [number, number, number];
	children?: React.ReactNode;
	fxDistortionFactor?: number;
	fxDisplayColorAlpha?: number;
};

type SimpleProps = {
	waterColor?: number;
	distortionScale?: number;
	fxMixColor?: number | string;
};

type ComplexProps = {
	color?: number | string;
	scale?: number;
	flowDirection?: Vector2 | [number, number];
	flowSpeed?: number;
	reflectivity?: number;
};

// prettier-ignore
type Props = GeneralProps & (({
    type: 'simple';
} & SimpleProps) | 
({
	type: 'complex';
} & ComplexProps));

const defaultSimple = {
	waterColor: 0x000000,
	distortionScale: 0.7,
	fxMixColor: 0x000000,
};

const defaultComplex = {
	scale: 11,
	flowDirection: new Vector2(1.0, 0.5),
	flowSpeed: 0.05,
	reflectivity: 1.2,
};

export default function WaterSurface(props: Props) {
	const {
		type,
		width = 190,
		length = 190,
		dimensions = 1024,
		position = [0, 0, 0],
		children,
		fxDistortionFactor = 0.2,
		fxDisplayColorAlpha = 0.0,

		//SimpleProps
		waterColor = defaultSimple.waterColor,
		distortionScale = defaultSimple.distortionScale,
		fxMixColor = defaultSimple.fxMixColor,
		//ComplexProps
		color,
		scale = defaultComplex.scale,
		flowDirection = defaultComplex.flowDirection,
		flowSpeed = defaultComplex.flowSpeed,
		reflectivity = defaultComplex.reflectivity,
	} = props as Props & SimpleProps & ComplexProps;

	const ref = useRef<any>();
	const refPointer = useRef(new Vector2(0, 0));

	const gl = useThree((state) => state.gl);

	// Need to import both like this because unknown bug changing type does not update the water normal correctly
	const waterNormals: any = useTexture(
		type === 'simple'
			? '/water/simple/waternormals.jpeg'
			: [
					'/water/complex/Water_1_M_Normal.jpg',
					'/water/complex/Water_2_M_Normal.jpg',
			  ]
	);

	const geom = useMemo(
		() => new PlaneGeometry(width, length),
		[length, width]
	);
	const config = useMemo(() => {
		return type === 'simple'
			? {
					textureWidth: dimensions,
					textureHeight: dimensions,
					waterNormals,

					waterColor: waterColor,
					distortionScale: distortionScale,
					fxDistortionFactor: fxDistortionFactor,
					fxDisplayColorAlpha: fxDisplayColorAlpha,
					fxMixColor: fxMixColor,
					fog: false,
					format: (gl as any).encoding,
			  }
			: {
					color: color,
					scale: scale,
					flowDirection: flowDirection as Vector2,
					flowSpeed: flowSpeed,
					textureWidth: dimensions,
					textureHeight: dimensions,
					normalMap0: waterNormals[0],
					normalMap1: waterNormals[1],
					reflectivity: reflectivity,
					encoding: (gl as any).encoding,
					fxDistortionFactor: fxDistortionFactor,
					fxDisplayColorAlpha: fxDisplayColorAlpha,
			  };
	}, [
		type,
		color,
		dimensions,
		distortionScale,
		flowDirection,
		flowSpeed,
		fxDisplayColorAlpha,
		fxDistortionFactor,
		fxMixColor,
		gl,
		reflectivity,
		scale,
		waterColor,
		waterNormals,
	]);

	const waterObj = useMemo(
		() =>
			type === 'simple'
				? new WaterSimple(geom, config)
				: new WaterComplex(geom, config),
		[geom, config, type]
	);

	const handlePointerMove = (e: any) => {
		refPointer.current = e.uv.multiplyScalar(2).subScalar(1);
	};

	useFrame((state, delta) => {
		if (ref.current && type === 'simple')
			ref.current.material.uniforms.time.value += delta / 2;
	});

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
