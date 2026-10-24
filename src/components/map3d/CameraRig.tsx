import { forwardRef, useImperativeHandle, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CAMERA_LIMITS } from '../../lib/mapConstants';

export interface CameraRigHandle {
  reset: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

export const CameraRig = forwardRef<CameraRigHandle>((_, ref) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (controlsRef.current) {
        camera.position.set(0, 18, 18);
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    },
    zoomIn: () => {
      if (controlsRef.current) {
        const currentDistance = camera.position.length();
        const newDistance = Math.max(CAMERA_LIMITS.minDistance, currentDistance * 0.8);
        const direction = camera.position.clone().normalize();
        camera.position.copy(direction.multiplyScalar(newDistance));
        controlsRef.current.update();
      }
    },
    zoomOut: () => {
      if (controlsRef.current) {
        const currentDistance = camera.position.length();
        const newDistance = Math.min(CAMERA_LIMITS.maxDistance, currentDistance * 1.2);
        const direction = camera.position.clone().normalize();
        camera.position.copy(direction.multiplyScalar(newDistance));
        controlsRef.current.update();
      }
    },
  }));

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={CAMERA_LIMITS.minDistance}
      maxDistance={CAMERA_LIMITS.maxDistance}
      minPolarAngle={CAMERA_LIMITS.minTilt}
      maxPolarAngle={CAMERA_LIMITS.maxTilt}
      minAzimuthAngle={CAMERA_LIMITS.minOrbit}
      maxAzimuthAngle={CAMERA_LIMITS.maxOrbit}
      enableDamping={true}
      dampingFactor={0.08}
      onChange={() => {
        if (controlsRef.current) {
          const target = controlsRef.current.target;
          target.x = Math.max(-CAMERA_LIMITS.panRadius, Math.min(CAMERA_LIMITS.panRadius, target.x));
          target.z = Math.max(-CAMERA_LIMITS.panRadius, Math.min(CAMERA_LIMITS.panRadius, target.z));
        }
      }}
    />
  );
});

CameraRig.displayName = 'CameraRig';
