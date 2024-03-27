# Interactive Water Surface

A React Three Fiber component for water surface, with additional interactive FX.

![image](https://github.com/nhtoby311/WaterSurface/assets/52330522/b65069fc-242d-4e2d-845d-83ede4d04a37)


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

3. Copy/Download assets files to your `/public`, namely

```
/public
|_water
|_fx
```

# Usage

Import components from the directory just copied above. There are 2 type of components: WaterSurface & InteractiveFX. All of them are listed below:

<table>
  <tr>
    <td valign="top">
      <ul>
        <li><a href="#watersurface">WaterSurface</a></li>
        <ul>
          <li><a href="#watersurfacesimple">WaterSurfaceSimple</a></li>
          <li><a href="#watersurfacecomplex">WaterSurfaceComplex</a></li>
        </ul>
        <li><a href="#InteractiveFX">InteractiveFX</a></li>
        <ul>
          <li><a href="#ripplefx">RippleFX</a></li>
          <li><a href="#fluidfx">FluidFX</a></li>
        </ul>
      </ul>
    </td>
  </tr>
</table>

## WaterSurface

WaterSurface type component will be the water shader plane that reflects your scene and apply distortion effects.

```jsx
<WaterSurfaceSimple />
```

### WaterSurfaceSimple

Simple water surface using 1 normal map distortion. This is the three.js [Water](https://github.com/mrdoob/three.js/blob/66f7aa81379d0d3b31b7e58c9ecc42e08a16d724/examples/jsm/objects/Water.js) implementation. 

```tsx
type Props = {
  width?: number;
  length?: number;
  dimensions?: number;
  waterColor?: number;
  position?: [number, number, number];
  distortionScale?: number;
  fxDistortionFactor?: number;
  fxDisplayColorAlpha?: number;
  fxMixColor?: number | string;
  children?: React.ReactNode;
};
```

### WaterSurfaceComplex

Complex Water Surface using 2 normal map distortion. This is the three.js [Water2](https://github.com/mrdoob/three.js/blob/66f7aa81379d0d3b31b7e58c9ecc42e08a16d724/examples/jsm/objects/Water2.js) implementation.

```tsx
type Props = {
  children?: React.ReactNode;
  position?: [number, number, number];
  width?: number;
  length?: number;
  color?: number | string;
  scale?: number;
  flowDirection?: Vector2 | [number, number];
  flowSpeed?: number;
  dimensions?: number;
  reflectivity?: number;
  fxDistortionFactor?: number;
  fxDisplayColorAlpha?: number;
};
```

## InteractiveFX

IntertiveFX type component will be the additional effects apply on the WaterSurface type. This can be added as children component of the WaterSurface component. 

```jsx
<WaterSurfaceComplex>
  <FluidFX />
</WaterSurfaceComplex>
```

### RippleFX

An implementation of @funtech-inc/use-shader-fx [useRipple](https://use-shader-fx-stories.vercel.app/?path=/docs/interactions-useripple--docs) hook.

```tsx
type Props = {
	frequency?: number;
	rotation?: number;
	fadeout_speed?: number;
	scale?: number;
	alpha?: number;
};

```

### FluidFX

An implementation of @funtech-inc/use-shader-fx [useFluid](https://use-shader-fx-stories.vercel.app/?path=/docs/interactions-usefluid--docs) hook.

```tsx
type Props = {
	densityDissipation?: number;
	velocityDissipation?: number;
	velocityAcceleration?: number;
	pressureDissipation?: number;
	splatRadius?: number;
	curlStrength?: number;
	pressureIterations?: number;
	fluidColor?: (velocity: Vector2) => Vector3;
};

```
