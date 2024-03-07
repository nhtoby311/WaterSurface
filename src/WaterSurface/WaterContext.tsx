import { createContext } from 'react';

export const WaterContext = createContext<{ ref: any; refPointer: any }>({
	ref: null,
	refPointer: null,
});
