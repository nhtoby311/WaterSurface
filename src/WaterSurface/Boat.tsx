import * as THREE from 'three';
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
	nodes: {
		Plane004_Boat_0_1: THREE.Mesh;
		Plane004_Boat_0_2: THREE.Mesh;
	};
	materials: {
		Surface: THREE.MeshStandardMaterial;
		cloth: THREE.MeshStandardMaterial;
	};
};

export function Boat(props: JSX.IntrinsicElements['group']) {
	const { nodes, materials } = useGLTF('/boat.glb') as GLTFResult;
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
