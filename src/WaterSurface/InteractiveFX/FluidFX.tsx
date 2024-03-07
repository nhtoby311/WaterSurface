import { useBlending, useFluid, usePointer } from '@funtech-inc/use-shader-fx';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { Vector2, Vector3 } from 'three';

const fluidColorFn = (velocity: Vector2) => {
	const rCol = 0.005;
	const gCol = Math.max(0.1, Math.abs(velocity.x) * 90);
	const bCol = Math.max(0.3, Math.abs(velocity.y) * 100);
	return new Vector3(rCol * 8.0, gCol * 8.0, bCol * 8.0);
};

export default function FluidFX({
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
	//CUSTOM: For applying use-shader-fx on top of the MeshReflectorMaterial.
	const { size, dpr } = useThree((state) => {
		return { size: state.size, dpr: state.viewport.dpr };
	});

	const [updateFluid, setFluid] = useFluid({
		size,
		dpr,
	});
	const [updateBlending, setBlending] = useBlending({ size, dpr });

	const colorVec = useMemo(() => new Vector3(), []);

	setFluid({
		density_dissipation: densityDissipation,
		velocity_dissipation: velocityDissipation,
		velocity_acceleration: velocityAcceleration,
		pressure_dissipation: pressureDissipation,
		splat_radius: splatRadius,
		curl_strength: curlStrength,
		pressure_iterations: pressureIterations,
		fluid_color: fluidColor,
	});

	const updatePointer = usePointer();

	useFrame((props) => {
		//console.log('pointerValues', pointerValues);

		const fluid = updateFluid(props, {
			pointerValues: updatePointer(refPointer.current),
		});
		const fx = updateBlending(props, {
			//texture: bgTexture,
			map: fluid,
			alphaMap: false,
		});
		//console.log(materialRef.current!.material.uniforms.u_fx);
		materialRef.current!.material.uniforms.u_fx.value = fx;
		//materialRef.current!.material.uniforms.fxDisplayColor.value = false;
		materialRef.current!.material.uniforms.fxDistortionFactor.value = 0.08;
	});

	return null;
}
