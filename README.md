# Interactive Water Surface

A React Three Fiber component for water surface, with additional interactive FX.

# Installation

1. Make sure you have all dependencies installed first:

```bash
npm i three @react-three/fiber @funtech-inc/use-shader-fx @types/three
```

2. Then copy/download the `/WaterSurface` directory to your project

```
WaterSurface
|_InteractiveFX
|_Water
|_...
```

# Usage

Import components from the directory just copied above. There are 2 type of components: WaterSurface & InteractiveFX. All of them are listed below:

-   WaterSurfaceSimple
-   WaterSurfaceComplex
-   RippleFX
-   FluidFX

WaterSurface type component will be the water shader plane that reflects your scene and apply distortion effects.

```tsx
<WaterSurfaceSimple />
```

IntertiveFX type component will be the additional effects apply on the WaterSurface type. This can be added as children component of the WaterSurface component

```tsx
<WaterSurfaceComplex>
	<FluidFX />
</WaterSurfaceComplex>
```

## WaterSurfaceSimple

## WaterSurfaceComplex

## RippleFX

## FluidFX
