import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

export function Boat(props) {
	const { nodes, materials } = useGLTF('/boat.glb');
	return (
		<group {...props} dispose={null}>
			<mesh
				castShadow
				receiveShadow
				geometry={nodes.Plane004_Boat_0_1.geometry}
				material={materials.Surface}
			/>
			<mesh
				castShadow
				receiveShadow
				geometry={nodes.Plane004_Boat_0_2.geometry}
				material={materials.cloth}
			/>
		</group>
	);
}

useGLTF.preload('/boat.glb');
