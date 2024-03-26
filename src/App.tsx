import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import { OrbitControls } from '@react-three/drei';
import { Leva } from 'leva';
import './App.css';

function App() {
	return (
		<>
			<Leva collapsed />
			<div className='background-canvas'>
				<Canvas camera={{ position: [12, 1, 6] }}>
					<Scene />

					<OrbitControls
						minPolarAngle={0}
						maxPolarAngle={Math.PI / 2}
					/>
				</Canvas>
			</div>

			<div className='fixed-overlay'>
				<div></div>
				<div></div>
				<div className='row-cont'>
					<div className='text-cont'>
						<div className='title'>
							<h1>INTERACTIVE</h1>
							<h2>WATER SURFACE</h2>
						</div>

						<p>
							by{' '}
							<a target='blank' href='https://nhtoby.com'>
								nhtoby.com
							</a>
						</p>
					</div>

					<a
						target='blank'
						href='https://github.com/nhtoby311/WaterSurface'>
						<svg
							width='40'
							height='40'
							viewBox='0 0 40 40'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M25 34.9999V29.1666C25 27.4999 25.1667 26.8333 24.1667 25.8333C28.8334 25.3333 33.3334 23.4999 33.3334 15.8333C33.3313 13.8415 32.5543 11.9288 31.1667 10.4999C31.8175 8.76986 31.7576 6.85263 31 5.16658C31 5.16658 29.1667 4.66658 25.1667 7.33325C21.7788 6.4509 18.2213 6.4509 14.8334 7.33325C10.8334 4.66658 9.00002 5.16658 9.00002 5.16658C8.24249 6.85263 8.18258 8.76986 8.83335 10.4999C7.44578 11.9288 6.66872 13.8415 6.66669 15.8333C6.66669 23.4999 11.1667 25.3333 15.8334 25.8333C14.8334 26.8333 14.8334 27.8333 15 29.1666V34.9999H25Z'
								stroke='white'
								stroke-width='3'
								stroke-linecap='round'
								stroke-linejoin='round'
							/>
							<path
								d='M15 31.6665C7.83333 33.9998 7.83333 27.4998 5 26.6665'
								stroke='white'
								stroke-width='3.83333'
								stroke-linecap='round'
								stroke-linejoin='round'
							/>
						</svg>
					</a>
				</div>
			</div>
		</>
	);
}

export default App;
