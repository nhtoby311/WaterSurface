import { Perf } from 'r3f-perf';

import { Environment, Float, Sparkles, useTexture } from '@react-three/drei';
import WaterSurfaceSimple from './WaterSurface/WaterSurfaceSimple';
import WaterSurfaceComplex from './WaterSurface/WaterSurfaceComplex';
import { useControls, folder } from 'leva';
import FluidFX from './WaterSurface/InteractiveFX/FluidFX';
import RippleFX from './WaterSurface/InteractiveFX/RippleFX';

import { Boat } from './WaterSurface/Boat';
import { EffectComposer, N8AO, ToneMapping } from '@react-three/postprocessing';

export default function Scene() {
	const controls = useControls({
		perfMonitor: {
			value: false,
		},

		waterType: {
			value: 'simple',
			options: ['simple', 'complex'],
		},

		fxType: {
			value: 'ripple',
			options: ['ripple', 'fluid'],
		},

		planeSize: {
			value: { width: 190, length: 190 },
		},

		position: [0, -3, 0],

		simpleWater: folder(
			{
				waterColor: '#000000',
				distortionScale: 0.7,
				fxDistortionFactor: 0.05,
				fxDisplayColorAlpha: 0.0,
				fxMixColor: '#3f3f3f',
			},
			{ render: (get) => get('waterType') === 'simple' }
		),

		complexWater: folder(
			{
				fxDistortionFactor_complex: 0.05,
				fxDisplayColorAlpha_complex: 0.6,
				flowSpeed: 0.03,
				flowDirection: [1.0, 0.5],
				reflectivity: 1.2,
				scale_complex: 5,
			},
			{ render: (get) => get('waterType') === 'complex' }
		),

		rippleFX: folder(
			{
				alpha: 1.0,
				fadeout_speed: 0.94,
				frequency: 0.01,
				rotation: 0.02,
				scale: 0.06,
			},
			{ render: (get) => get('fxType') === 'ripple' }
		),

		fluidFX: folder(
			{
				densityDissipation: 0.977,
				velocityDissipation: 0.99,
				velocityAcceleration: 20.0,
				pressureDissipation: 0.5,
				splatRadius: 0.00002,
				curlStrength: 7.0,
				pressureIterations: 2,
			},
			{ render: (get) => get('fxType') === 'fluid' }
		),
	});

	const FX_RENDER = (
		<>
			{controls.fxType === 'ripple' && (
				<RippleFX
					alpha={controls.alpha}
					fadeout_speed={controls.fadeout_speed}
					frequency={controls.frequency}
					rotation={controls.rotation}
					scale={controls.scale}
				/>
			)}

			{controls.fxType === 'fluid' && (
				<FluidFX
					densityDissipation={controls.densityDissipation}
					velocityDissipation={controls.velocityDissipation}
					velocityAcceleration={controls.velocityAcceleration}
					pressureDissipation={controls.pressureDissipation}
					splatRadius={controls.splatRadius}
					curlStrength={controls.curlStrength}
					pressureIterations={controls.pressureIterations}
				/>
			)}
		</>
	);

	return (
		<>
			{controls.perfMonitor && <Perf position={'top-left'} />}

			<Environment
				//preset='studio'
				background
				files={[
					'cubemap/sunset/right.png',
					'cubemap/sunset/left.png',
					'cubemap/sunset/top.png',
					'cubemap/sunset/bot.png',
					'cubemap/sunset/front.png',
					'cubemap/sunset/back.png',
				]}
			/>

			{/* <Sparkles scale={100} size={20} speed={5} /> */}

			{/* <mesh position={[0, 0, 0]}>
				<sphereGeometry args={[150, 32, 32]} />
				<meshBasicMaterial side={BackSide} map={text} />
			</mesh> */}

			<ambientLight />

			{controls.waterType === 'simple' && (
				<WaterSurfaceSimple
					position={controls.position}
					width={controls.planeSize.width}
					length={controls.planeSize.length}
					fxDistortionFactor={controls.fxDistortionFactor}
					fxDisplayColorAlpha={controls.fxDisplayColorAlpha}
					fxMixColor={controls.fxMixColor}>
					{FX_RENDER}
				</WaterSurfaceSimple>
			)}
			{controls.waterType === 'complex' && (
				<WaterSurfaceComplex
					dimensions={2048}
					position={controls.position}
					width={controls.planeSize.width}
					length={controls.planeSize.length}
					fxDistortionFactor={controls.fxDistortionFactor_complex}
					fxDisplayColorAlpha={controls.fxDisplayColorAlpha_complex}
					flowSpeed={controls.flowSpeed}
					flowDirection={controls.flowDirection}
					reflectivity={controls.reflectivity}
					scale={controls.scale_complex}>
					{FX_RENDER}
				</WaterSurfaceComplex>
			)}

			<EffectComposer>
				<N8AO intensity={5} aoRadius={8} halfRes />
			</EffectComposer>

			<Float
				speed={2}
				floatingRange={[-0.2, -0.3]}
				floatIntensity={0.1}
				rotationIntensity={0.5}>
				<Boat rotation-y={Math.PI / 1.8} position={[0, -3.3, 0]} />
			</Float>
		</>
	);
}
