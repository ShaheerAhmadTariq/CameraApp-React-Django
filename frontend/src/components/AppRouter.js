import Camera from './Camera.js';
import TestImage from './TestImage.js';

const router = [
  {path: '/testing', element: <Camera/>},
  {path: '/', element: <TestImage/>},
];

export default router;
