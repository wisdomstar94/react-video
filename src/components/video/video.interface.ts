import { Dispatch, SetStateAction, SyntheticEvent } from "react";

export declare namespace IVideo {
  export interface VideoHookProps {
    id: string;
    onCanPlay?: (event: SyntheticEvent<HTMLVideoElement, Event>, id: string) => void;
    onStart?: (id: string) => void;
    onFirstQuartile?: (id: string) => void;
    onMidPoint?: (id: string) => void;
    onThirdQuartile?: (id: string) => void;
    onComplete?: (id: string) => void;
    onPause?: (id: string) => void;
    onResume?: (id: string) => void;
    onError?: (event: SyntheticEvent<HTMLVideoElement, Event>, id: string) => void;
    onLoadedData?: (event: SyntheticEvent<HTMLVideoElement, Event>, id: string) => void;
    onLoadedMetadata?: (event: SyntheticEvent<HTMLVideoElement, Event>, id: string) => void;
    onTimeUpdate?: (event: SyntheticEvent<HTMLVideoElement, Event>, catchTimePeriod: number, id: string) => void;
  }

  export interface SetVideoOptions {
    isIfPausedAutoStart?: boolean;
    isSetPause?: boolean;
  }

  export interface SetCurrentTimeOptions {
    isIfPausedAutoStart?: boolean;
    isSetPause?: boolean;
  }

  export type CrossOrigin = 'anonymous' | 'use-credentials';
  export type Preload = 'auto' | 'metadata' | 'none';

  export interface CurrentTimeObj {
    second: number;
  }

  export interface Props {
    id: string;
    className?: string;
    // videoRef?: RefObject<HTMLVideoElement>;
    autoPlay?: boolean;
    controls?: boolean;
    crossOrigin?: CrossOrigin;
    disablePictureInPicture?: boolean;
    disableRemotePlayback?: boolean;
    loop?: boolean;
    muted?: boolean;
    playsInline?: boolean;
    preload?: Preload;
    src?: string;
    poster?: string;

    currentTimeObj?: CurrentTimeObj;

    onPlay?: (event: SyntheticEvent<HTMLVideoElement, Event>, id: string) => void;
    onCanPlay?: (event: SyntheticEvent<HTMLVideoElement, Event>, id: string) => void;
    onStart?: (id: string) => void;
    onFirstQuartile?: (id: string) => void;
    onMidPoint?: (id: string) => void;
    onThirdQuartile?: (id: string) => void;
    onComplete?: (id: string) => void;
    onPause?: (id: string) => void;
    onResume?: (id: string) => void;
    onError?: (event: SyntheticEvent<HTMLVideoElement, Event>, id: string) => void;
    onLoadedData?: (event: SyntheticEvent<HTMLVideoElement, Event>, id: string) => void;
    onLoadedMetadata?: (event: SyntheticEvent<HTMLVideoElement, Event>, id: string) => void;
    onTimeUpdate?: (event: SyntheticEvent<HTMLVideoElement, Event>, catchTimePeriod: number, id: string) => void;
  }

  export interface VideoHook {
    // videoRef?: RefObject<HTMLVideoElement>;

    isReady: boolean;
    isReadyed: boolean;
    isStart: boolean;
    isFirstQuartile: boolean;
    isMidPoint: boolean;
    isThirdQuartile: boolean;
    isComplete: boolean;
    isPause: boolean;
    isResume: boolean;
    currentStatus: {
      isReady: boolean;
      isStart: boolean;
      isFirstQuartile: boolean;
      isMidPoint: boolean;
      isThirdQuartile: boolean;
      isComplete: boolean;
      isPause: boolean;
      isResume: boolean;
    };

    isPlaying: boolean;

    setAutoPlay: Dispatch<SetStateAction<boolean | undefined>>;
    setControls: Dispatch<SetStateAction<boolean | undefined>>;
    setPreload: Dispatch<SetStateAction<IVideo.Preload | undefined>>;
    setCrossOrigin: Dispatch<SetStateAction<IVideo.CrossOrigin | undefined>>;
    setDisablePictureInPicture: Dispatch<SetStateAction<boolean | undefined>>;
    setDisableRemotePlayback: Dispatch<SetStateAction<boolean | undefined>>;
    setLoop: Dispatch<SetStateAction<boolean | undefined>>;
    setMuted: Dispatch<SetStateAction<boolean | undefined>>;
    setPlaysInline: Dispatch<SetStateAction<boolean | undefined>>;
    setPoster: Dispatch<SetStateAction<string | undefined>>;

    src: string | undefined;
    poster: string | undefined;
    setVideoSrc: (src: string | undefined, options?: IVideo.SetVideoOptions) => void;
    setCurrentTime: (currentTime: number, options?: IVideo.SetCurrentTimeOptions) => void;
    getCurrentTime: () => number | undefined;
    getVideoElement: () => HTMLVideoElement | null;
    pause: () => void;
    play: () => void;
    component: (id: string) => JSX.Element;
  }
}