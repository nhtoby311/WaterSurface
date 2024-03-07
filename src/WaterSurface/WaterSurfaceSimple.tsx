import { useRef } from 'react';
import { WaterComplexType, WaterSimpleType } from './Water/Water';
import InteractiveFX from './InteractiveFX/InteractiveFX';
import { Vector2 } from 'three';

export default function WaterSurfaceSimple({ fxType = 'ripple' }: any) {
	const ref = useRef<any>();
	const refPointer = useRef(new Vector2(0, 0));

	return (
		<>
			<WaterSimpleType ref={ref} refPointer={refPointer} />

			<InteractiveFX
				fxType={fxType}
				materialRef={ref}
				refPointer={refPointer}
				splatRadius={0.00001}
			/>
		</>
	);
}
