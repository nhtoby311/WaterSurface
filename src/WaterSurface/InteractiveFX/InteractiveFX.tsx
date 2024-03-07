import { useBlending, useFluid, usePointer } from '@funtech-inc/use-shader-fx';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { Vector2, Vector3 } from 'three';
import FluidFX from './FluidFX';
import RippleFX from './RippleFX';

const fluidColorFn = (velocity: Vector2) => {
	const rCol = 0.005;
	const gCol = Math.max(0.1, Math.abs(velocity.x) * 90);
	const bCol = Math.max(0.3, Math.abs(velocity.y) * 100);
	return new Vector3(rCol * 8.0, gCol * 8.0, bCol * 8.0);
};

export default function InteractiveFX({
	materialRef,
	refPointer,
	fxType = 'fluid',

	densityDissipation = 0.977,
	velocityDissipation = 0.99,
	velocityAcceleration = 20.0,
	pressureDissipation = 0.5,
	splatRadius = 0.0002,
	curlStrength = 7.0,
	pressureIterations = 2,
	fluidColor = fluidColorFn,
}: any) {
	return (
		<>
			{fxType === 'fluid' ? (
				<FluidFX materialRef={materialRef} refPointer={refPointer} />
			) : (
				<RippleFX materialRef={materialRef} refPointer={refPointer} />
			)}
		</>
	);
}
