import {
	useBlending,
	useFluid,
	usePointer,
	useRipple,
} from '@funtech-inc/use-shader-fx';
import { useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { Vector2, Vector3 } from 'three';

export default function RippleFX({
	materialRef,
	refPointer,

	frequency = 0.01,
	rotation = 0.05,
	fadeout_speed = 0.9,
	scale = 0.3,
	alpha = 0.6,
}: any) {
	//CUSTOM: For applying use-shader-fx on top of the MeshReflectorMaterial.
	const { size, dpr } = useThree((state) => {
		return { size: state.size, dpr: state.viewport.dpr };
	});

	const ripple = useTexture('/fx/smoke.png');

	// const [updateFluid, setFluid] = use({
	// 	size,
	// 	dpr,
	// });

	const [updateRipple, setRipple] = useRipple({
		size,
		texture: ripple,
		dpr,
	});
	const [updateBlending, setBlending] = useBlending({ size, dpr });

	setRipple({
		//alpha: 0.9,
		frequency,
		rotation,
		fadeout_speed,
		scale,
		alpha,
	});

	const updatePointer = usePointer();

	useFrame((props) => {
		//console.log('pointerValues', pointerValues);

		const ripple = updateRipple(props, {
			pointerValues: updatePointer(refPointer.current),
		});
		const fx = updateBlending(props, {
			//texture: bgTexture,
			map: ripple,
			alphaMap: false,
		});
		//console.log(materialRef.current!.material.uniforms.u_fx);
		materialRef.current!.material.uniforms.u_fx.value = fx;
		materialRef.current!.material.uniforms.fxDisplayColor.value = false;
		materialRef.current!.material.uniforms.fxDistortionFactor.value = 0.5;
	});

	return null;
}
