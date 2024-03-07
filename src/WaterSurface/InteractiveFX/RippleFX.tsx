import { useBlending, usePointer, useRipple } from '@funtech-inc/use-shader-fx';
import { useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useContext } from 'react';
import { WaterContext } from '../WaterContext';

export type FXRippleProps = {
	frequency?: number;
	rotation?: number;
	fadeout_speed?: number;
	scale?: number;
	alpha?: number;
};

export default function RippleFX({
	frequency = 0.01,
	rotation = 0.05,
	fadeout_speed = 0.9,
	scale = 0.2,
	alpha = 1.0,
}: FXRippleProps) {
	const { ref: materialRef, refPointer } = useContext(WaterContext);

	const { size, dpr } = useThree((state) => {
		return { size: state.size, dpr: state.viewport.dpr };
	});

	const ripple = useTexture('/fx/smoke.png');

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
	});

	return null;
}
