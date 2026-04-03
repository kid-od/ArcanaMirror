/// <reference lib="webworker" />

import {
  FilesetResolver,
  HandLandmarker,
  HandLandmarkerResult,
} from '@mediapipe/tasks-vision';
import {
  GestureWorkerFrameMessage,
  GestureWorkerHand,
  GestureWorkerIncomingMessage,
  GestureWorkerOutgoingMessage,
} from './gesture-worker-protocol';

const scope = self as unknown as DedicatedWorkerGlobalScope;

let handLandmarker: HandLandmarker | null = null;

function postMessage(message: GestureWorkerOutgoingMessage) {
  scope.postMessage(message);
}

function toGestureWorkerHand(result: HandLandmarkerResult): GestureWorkerHand | null {
  if (result.landmarks.length === 0) {
    return null;
  }

  const landmarks = result.landmarks[0];
  const handedness = result.handedness[0]?.[0];

  return {
    landmarks: landmarks.map((landmark) => ({
      x: landmark.x,
      y: landmark.y,
      z: landmark.z,
    })),
    handedness: handedness?.categoryName ?? 'Unknown',
    score: handedness?.score ?? 0,
  };
}

async function initHandLandmarker(wasmPath: string, modelPath: string) {
  const vision = await FilesetResolver.forVisionTasks(wasmPath);

  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: modelPath,
    },
    runningMode: 'VIDEO',
    numHands: 1,
    minHandDetectionConfidence: 0.6,
    minHandPresenceConfidence: 0.6,
    minTrackingConfidence: 0.55,
  });
}

function handleFrameMessage(message: GestureWorkerFrameMessage) {
  const { bitmap, timestamp } = message;

  if (!handLandmarker) {
    bitmap.close();
    postMessage({
      type: 'error',
      message: 'Hand landmarker is not ready.',
      fatal: false,
    });
    return;
  }

  try {
    const result = handLandmarker.detectForVideo(bitmap, timestamp);

    bitmap.close();
    postMessage({
      type: 'result',
      timestamp,
      hand: toGestureWorkerHand(result),
    });
  } catch (error) {
    bitmap.close();
    postMessage({
      type: 'error',
      message:
        error instanceof Error
          ? error.message
          : 'Unable to process the latest gesture frame.',
      fatal: false,
    });
  }
}

scope.onmessage = async (event: MessageEvent<GestureWorkerIncomingMessage>) => {
  const message = event.data;

  if (message.type === 'dispose') {
    handLandmarker = null;
    return;
  }

  if (message.type === 'init') {
    try {
      await initHandLandmarker(message.wasmPath, message.modelPath);
      postMessage({ type: 'ready' });
    } catch (error) {
      postMessage({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Unable to initialize the hand gesture worker.',
        fatal: true,
      });
    }
    return;
  }

  handleFrameMessage(message);
};
