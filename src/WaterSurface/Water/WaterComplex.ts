import {
	Clock,
	Color,
	Matrix4,
	Mesh,
	RepeatWrapping,
	ShaderMaterial,
	Side,
	Texture,
	UniformsLib,
	UniformsUtils,
	Vector2,
	Vector3,
	Vector4,
} from 'three';
import { Reflector, Refractor } from 'three-stdlib';

type WaterOptions = {
	color?: Color | string | number;
	textureWidth?: number;
	textureHeight?: number;
	clipBias?: number;
	flowDirection?: Vector2;
	flowSpeed?: number;
	reflectivity?: number;
	scale?: number;
	shader?: object;
	flowMap?: Texture;
	normalMap0?: Texture;
	normalMap1?: Texture;
	encoding?: 3000 | 3001 | any;
	fxDisplayColorAlpha?: number;
	fxDistortionFactor?: number;
};

class WaterComplex extends Mesh {
	static WaterShader = {
		uniforms: {
			color: {
				value: null,
			},

			reflectivity: {
				value: 0,
			},

			tReflectionMap: {
				value: null,
			},

			tRefractionMap: {
				value: null,
			},

			tNormalMap0: {
				value: null,
			},

			tNormalMap1: {
				value: null,
			},

			textureMatrix: {
				value: null,
			},

			config: {
				value: new Vector4(),
			},

			u_fx: { value: 0.0 },
			fxDistortionFactor: { value: 0.0 },
			fxDisplayColorAlpha: { value: 1.0 },
		},

		vertexShader: /* glsl */ `
  
            #include <common>
            #include <fog_pars_vertex>
            #include <logdepthbuf_pars_vertex>
    
            uniform mat4 textureMatrix;
    
            varying vec4 vCoord;
            varying vec2 vUv;
            varying vec3 vToEye;

            
    
            void main() {
    
                vUv = uv;
                vCoord = textureMatrix * vec4( position, 1.0 );
    
                vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
                vToEye = cameraPosition - worldPosition.xyz;
    
                vec4 mvPosition =  viewMatrix * worldPosition; // used in fog_vertex
                gl_Position = projectionMatrix * mvPosition;
    
                #include <logdepthbuf_vertex>
                #include <fog_vertex>
  
        }`,

		fragmentShader: /* glsl */ `
  
            #include <common>
            #include <fog_pars_fragment>
            #include <logdepthbuf_pars_fragment>
    
            uniform sampler2D tReflectionMap;
            uniform sampler2D tRefractionMap;
            uniform sampler2D tNormalMap0;
            uniform sampler2D tNormalMap1;
    
            #ifdef USE_FLOWMAP
                uniform sampler2D tFlowMap;
            #else
                uniform vec2 flowDirection;
            #endif
    
            uniform vec3 color;
            uniform float reflectivity;
            uniform vec4 config;

            uniform sampler2D u_fx;
            uniform float fxDistortionFactor;
            uniform float fxDisplayColorAlpha;
    
            varying vec4 vCoord;
            varying vec2 vUv;
            varying vec3 vToEye;
    
            void main() {
    
                #include <logdepthbuf_fragment>
    
                float flowMapOffset0 = config.x;
                float flowMapOffset1 = config.y;
                float halfCycle = config.z;
                float scale = config.w;
    
                vec3 toEye = normalize( vToEye );
    
                // determine flow direction
                vec2 flow;
                #ifdef USE_FLOWMAP
                    flow = texture2D( tFlowMap, vUv ).rg * 2.0 - 1.0;
                #else
                    flow = flowDirection;
                #endif
                flow.x *= - 1.0;
    
                // sample normal maps (distort uvs with flowdata)
                vec4 normalColor0 = texture2D( tNormalMap0, ( vUv * scale ) + flow * flowMapOffset0 );
                vec4 normalColor1 = texture2D( tNormalMap1, ( vUv * scale ) + flow * flowMapOffset1 );
    
                // linear interpolate to get the final normal color
                float flowLerp = abs( halfCycle - flowMapOffset0 ) / halfCycle;
                vec4 normalColor = mix( normalColor0, normalColor1, flowLerp );
    
                // calculate normal vector
                vec3 normal = normalize( vec3( normalColor.r * 2.0 - 1.0, normalColor.b,  normalColor.g * 2.0 - 1.0 ) );
    
                // calculate the fresnel term to blend reflection and refraction maps
                float theta = max( dot( toEye, normal ), 0.0 );
                float reflectance = reflectivity + ( 1.0 - reflectivity ) * pow( ( 1.0 - theta ), 5.0 );
    
                // calculate final uv coords
                vec3 coord = vCoord.xyz / vCoord.w;
                vec2 uv = coord.xy + coord.z * normal.xz * 0.05;

                vec4 fx = texture2D(u_fx, vUv);
                float avgDistortion = (fx.r + fx.g + fx.b) / 3.0 * fxDistortionFactor;
    
                vec4 reflectColor = texture2D( tReflectionMap, vec2( 1.0 - uv.x, uv.y ) + avgDistortion );
                vec4 refractColor = texture2D( tRefractionMap, uv );

                
    
                // multiply water color with the mix of both textures
                float luminance = dot(fx.rgb * fxDisplayColorAlpha, vec3(0.299, 0.587, 0.114));
                vec3 mixedColor = mix(color * reflectColor.rgb  , fx.rgb * fxDisplayColorAlpha, luminance * fxDisplayColorAlpha);

                gl_FragColor = vec4(mixedColor, 1.0);

                //gl_FragColor = vec4( color, 1.0 ) * mix( refractColor, reflectColor, reflectance );
    
                #include <tonemapping_fragment>
                #include <colorspace_fragment>
                #include <fog_fragment>
    
            }`,
	};

	constructor(geometry: any, options: WaterOptions = {}) {
		super(geometry);

		//this.isWater = true;

		//this.type = 'Water';

		const scope = this;

		const color =
			options.color !== undefined
				? new Color(options.color)
				: new Color(0xffffff);
		const textureWidth = options.textureWidth || 512;
		const textureHeight = options.textureHeight || 512;
		const clipBias = options.clipBias || 0;
		const flowDirection = options.flowDirection || new Vector2(1, 0);
		const flowSpeed = options.flowSpeed || 0.03;
		const reflectivity = options.reflectivity || 0.02;
		const scale = options.scale || 1;
		const shader: any = options.shader || WaterComplex.WaterShader;
		const encoding =
			options.encoding !== undefined ? options.encoding : 3000;

		const flowMap = options.flowMap || undefined;
		const normalMap0 = options.normalMap0;
		const normalMap1 = options.normalMap1;

		const fxDistortionFactor = options.fxDistortionFactor;
		const fxDisplayColorAlpha = options.fxDisplayColorAlpha;

		const cycle = 0.15; // a cycle of a flow map phase
		const halfCycle = cycle * 0.5;
		const textureMatrix = new Matrix4();
		const clock = new Clock();

		// internal components

		if (Reflector === undefined) {
			console.error(
				'THREE.Water: Required component Reflector not found.'
			);
			return;
		}

		if (Refractor === undefined) {
			console.error(
				'THREE.Water: Required component Refractor not found.'
			);
			return;
		}

		const reflector = new Reflector(geometry, {
			textureWidth: textureWidth,
			textureHeight: textureHeight,
			clipBias: clipBias,
			encoding: encoding,
		});

		const refractor = new Refractor(geometry, {
			textureWidth: textureWidth,
			textureHeight: textureHeight,
			clipBias: clipBias,
			encoding: encoding,
		});

		reflector.matrixAutoUpdate = false;
		refractor.matrixAutoUpdate = false;

		// material

		this.material = new ShaderMaterial({
			uniforms: UniformsUtils.merge([
				UniformsLib['fog'],
				shader.uniforms,
			]),
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader,
			//transparent: true,
			transparent: false,
			fog: true,
		});

		if (flowMap !== undefined) {
			if (this.material.defines !== undefined) {
				this.material.defines.USE_FLOWMAP = '';
			}
			(this.material as any).uniforms['tFlowMap'] = {
				type: 't',
				value: flowMap,
			};
		} else {
			(this.material as any).uniforms['flowDirection'] = {
				type: 'v2',
				value: flowDirection,
			};
		}

		// maps
		if (normalMap0) normalMap0.wrapS = normalMap0.wrapT = RepeatWrapping;
		if (normalMap1) normalMap1.wrapS = normalMap1.wrapT = RepeatWrapping;

		(this.material as any).uniforms['tReflectionMap'].value =
			reflector.getRenderTarget().texture;
		(this.material as any).uniforms['tRefractionMap'].value =
			refractor.getRenderTarget().texture;
		(this.material as any).uniforms['tNormalMap0'].value = normalMap0;
		(this.material as any).uniforms['tNormalMap1'].value = normalMap1;

		// water

		(this.material as any).uniforms['color'].value = color;
		(this.material as any).uniforms['reflectivity'].value = reflectivity;
		(this.material as any).uniforms['textureMatrix'].value = textureMatrix;

		// fx
		(this.material as any).uniforms['u_fx'].value = null;
		(this.material as any).uniforms['fxDistortionFactor'].value =
			fxDistortionFactor;
		(this.material as any).uniforms['fxDisplayColorAlpha'].value =
			fxDisplayColorAlpha;

		// inital values

		(this.material as any).uniforms['config'].value.x = 0; // flowMapOffset0
		(this.material as any).uniforms['config'].value.y = halfCycle; // flowMapOffset1
		(this.material as any).uniforms['config'].value.z = halfCycle; // halfCycle
		(this.material as any).uniforms['config'].value.w = scale; // scale

		// functions

		function updateTextureMatrix(camera: any) {
			textureMatrix.set(
				0.5,
				0.0,
				0.0,
				0.5,
				0.0,
				0.5,
				0.0,
				0.5,
				0.0,
				0.0,
				0.5,
				0.5,
				0.0,
				0.0,
				0.0,
				1.0
			);

			textureMatrix.multiply(camera.projectionMatrix);
			textureMatrix.multiply(camera.matrixWorldInverse);
			textureMatrix.multiply(scope.matrixWorld);
		}

		function updateFlow() {
			const delta = clock.getDelta();
			const config = (scope.material as any).uniforms['config'];

			config.value.x += flowSpeed * delta; // flowMapOffset0
			config.value.y = config.value.x + halfCycle; // flowMapOffset1

			// Important: The distance between offsets should be always the value of "halfCycle".
			// Moreover, both offsets should be in the range of [ 0, cycle ].
			// This approach ensures a smooth water flow and avoids "reset" effects.

			if (config.value.x >= cycle) {
				config.value.x = 0;
				config.value.y = halfCycle;
			} else if (config.value.y >= cycle) {
				config.value.y = config.value.y - cycle;
			}
		}

		//

		this.onBeforeRender = function (renderer, scene, camera) {
			updateTextureMatrix(camera);
			updateFlow();

			scope.visible = false;

			reflector.matrixWorld.copy(scope.matrixWorld);
			refractor.matrixWorld.copy(scope.matrixWorld);

			(reflector as any).onBeforeRender(renderer, scene, camera);
			(refractor as any).onBeforeRender(renderer, scene, camera);

			scope.visible = true;
		};
	}
}

export { WaterComplex };
