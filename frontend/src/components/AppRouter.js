import Camera from './Camera.js';
import TestImage from './TestImage.js';

const router = [
  {path: '/', element: <Camera/>},
  {path: '/testing', element: <TestImage/>},
];

export default router;
