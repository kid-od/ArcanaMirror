export type GestureWorkerLandmark = {
  x: number;
  y: number;
  z: number;
};

export type GestureWorkerHand = {
  landmarks: GestureWorkerLandmark[];
  handedness: string;
  score: number;
};

export type GestureWorkerInitMessage = {
  type: 'init';
  wasmPath: string;
  modelPath: string;
};

export type GestureWorkerFrameMessage = {
  type: 'frame';
  bitmap: ImageBitmap;
  timestamp: number;
};

export type GestureWorkerDisposeMessage = {
  type: 'dispose';
};

export type GestureWorkerIncomingMessage =
  | GestureWorkerInitMessage
  | GestureWorkerFrameMessage
  | GestureWorkerDisposeMessage;

export type GestureWorkerReadyMessage = {
  type: 'ready';
};

export type GestureWorkerResultMessage = {
  type: 'result';
  timestamp: number;
  hand: GestureWorkerHand | null;
};

export type GestureWorkerErrorMessage = {
  type: 'error';
  message: string;
  fatal: boolean;
};

export type GestureWorkerOutgoingMessage =
  | GestureWorkerReadyMessage
  | GestureWorkerResultMessage
  | GestureWorkerErrorMessage;
