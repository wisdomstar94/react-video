import { useCallback, useEffect, useMemo, useState } from "react";
import { Video } from "./video.component";
import { IVideo } from "./video.interface";

/**
 * @description 해당 훅은 단일 컴포넌트로 사용할 때만 사용하세요! 하나의 컴포넌트(페이지) 에서 본 훅의 Video 컴포넌트를 배열에 따라 여러개 사용해야 하는 경우에는 본 훅을 사용하는 것은 적합하지 않습니다.
 */
export function useVideo(props: IVideo.VideoHookProps): IVideo.VideoHook {
  const {
    id,
    onCanPlay,
    onCanPlayThrough,
    onReady,
    onLoadedData,
    onLoadedMetadata,
    onStart,
    onFirstQuartile,
    onMidPoint,
    onThirdQuartile,
    onComplete,
    onEnded,
    onEndedAfter,
    onInvalidComplete,
    onPause,
    onResume,
    onError,
    onTimeUpdate,
    onNotLoadedData,
    onUnusualVideoStopped,
    onDurationChange,
    onEmptied,
    onLoadStart,
    onPlaying,
    onProgress,
    onRateChange,
    onSeeked,
    onSeeking,
    onStalled,
    onSuspend,
    onVolumeChange,
    onWaiting,
  } = props;

  const [isReadyed, setIsReadyed] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isStart, setIsStart] = useState<boolean>(false);
  const [isFirstQuartile, setIsFirstQuartile] = useState<boolean>(false);
  const [isMidPoint, setIsMidPoint] = useState<boolean>(false);
  const [isThirdQuartile, setIsThirdQuartile] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isPause, setIsPause] = useState<boolean>(false);
  const [isResume, setIsResume] = useState<boolean>(false);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [autoPlay, setAutoPlay] = useState<boolean>();
  const [controls, setControls] = useState<boolean>();
  const [crossOrigin, setCrossOrigin] = useState<IVideo.CrossOrigin>();
  const [disablePictureInPicture, setDisablePictureInPicture] = useState<boolean>();
  const [disableRemotePlayback, setDisableRemotePlayback] = useState<boolean>();
  const [loop, setLoop] = useState<boolean>();
  const [muted, setMuted] = useState<boolean>();
  const [playsInline, setPlaysInline] = useState<boolean>();
  const [preload, setPreload] = useState<IVideo.Preload>();
  const [src, setSrc] = useState<string>();
  const [poster, setPoster] = useState<string>();

  const getVideoElement = useCallback(() => {
    // return videoRef.current;
    return document.querySelector<HTMLVideoElement>(`#id_${id}`);
  }, [id]);

  const setCurrentTime = useCallback((currentTime: number, options?: IVideo.SetCurrentTimeOptions) => {
    const videoElement = getVideoElement();

    if (videoElement === null) return;
    videoElement.currentTime = currentTime;
    if (options?.isIfPausedAutoStart === true) {
      videoElement.play();
    }
    if (options?.isSetPause === true) {
      videoElement?.pause();
      const _onplay = () => {
        videoElement?.pause();
        videoElement?.removeEventListener('play', _onplay);
      };
      videoElement.addEventListener('play', _onplay);
    }
  }, [getVideoElement]);

  const getCurrentTime = useCallback(() => {
    return getVideoElement()?.currentTime;
  }, [getVideoElement]);

  const clearState = useCallback(() => {
    setIsReady(false);
    setIsReadyed(false);
    setIsStart(false);
    setIsFirstQuartile(false);
    setIsMidPoint(false);
    setIsThirdQuartile(false);
    setIsComplete(false);
    setIsPause(false);
    setIsResume(false);
  }, []);

  const setVideoSrc = useCallback((src: string | undefined, options?: IVideo.SetVideoOptions) => {
    const videoElement = getVideoElement();
    if (videoElement === null) return;
    clearState();
    setSrc(src);
    if (options?.isIfPausedAutoStart === true) {
      if (videoElement.paused === true) {
        videoElement?.play();
      }
    }
    if (options?.isSetPause === true) {
      videoElement?.pause();
      const _onplay = () => {
        videoElement?.pause();
        videoElement?.removeEventListener('play', _onplay);
      };
      videoElement?.addEventListener('play', _onplay);
    }
  }, [clearState, getVideoElement]);

  const currentStatus = useMemo(() => {
    return {
      isReady,
      isStart,
      isFirstQuartile,
      isMidPoint,
      isThirdQuartile,
      isComplete,
      isPause,
      isResume,
    };
  }, [isComplete, isFirstQuartile, isMidPoint, isPause, isReady, isResume, isStart, isThirdQuartile]);

  const pause = useCallback(() => {
    getVideoElement()?.pause();
  }, [getVideoElement]);

  const play = useCallback(() => {
    getVideoElement()?.play();
  }, [getVideoElement]);

  useEffect(() => {
    getVideoElement()?.setAttribute('data-is-ready', isReady ? 'true' : 'false');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  useEffect(() => {
    if (isReadyed === true) {
      setIsReadyed(false);
    }
  }, [isReadyed]);

  useEffect(() => {
    getVideoElement()?.setAttribute('data-is-start', isStart ? 'true' : 'false');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStart]);

  useEffect(() => {
    getVideoElement()?.setAttribute('data-is-first-quartile', isFirstQuartile ? 'true' : 'false');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstQuartile]);

  useEffect(() => {
    getVideoElement()?.setAttribute('data-is-midpoint', isMidPoint ? 'true' : 'false');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMidPoint]);

  useEffect(() => {
    getVideoElement()?.setAttribute('data-is-third-quartile', isThirdQuartile ? 'true' : 'false');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isThirdQuartile]);

  useEffect(() => {
    getVideoElement()?.setAttribute('data-is-complete', isComplete ? 'true' : 'false');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  useEffect(() => {
    clearState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => {
    const videoElement = getVideoElement();

    const _onPlay = () => {
      if (videoElement === null) return;
      setIsPlaying(true);
      const duration = videoElement.duration;
      const currentTime = videoElement.currentTime;
      const currentProcessRate = (currentTime * 100) / duration;
      setIsFirstQuartile(currentProcessRate >= 25);
      setIsMidPoint(currentProcessRate >= 50);
      setIsThirdQuartile(currentProcessRate >= 75);
    };

    const _onPause = () => {
      setIsPlaying(false);
    };
    
    videoElement?.addEventListener('play', _onPlay);
    videoElement?.addEventListener('pause', _onPause);
    return () => {
      videoElement?.removeEventListener('play', _onPlay);
      videoElement?.removeEventListener('pause', _onPause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
    
  return {
    // videoRef,

    isReady,
    isReadyed,
    isPause,
    isResume,
    isStart,
    isFirstQuartile,
    isMidPoint,
    isThirdQuartile,
    isComplete,
    currentStatus,

    isPlaying,

    setAutoPlay,
    setControls,
    setPreload,
    setCrossOrigin,
    setDisablePictureInPicture,
    setDisableRemotePlayback,
    setLoop,
    setMuted,
    setPlaysInline,
    setPoster,

    src,
    setVideoSrc,
    setCurrentTime,
    getCurrentTime,
    getVideoElement,
    pause,
    play,
    poster,

    component: () => {
      return (
        <Video
          id={id}
          // videoRef={videoRef}
          autoPlay={autoPlay}
          controls={controls}
          preload={preload}
          crossOrigin={crossOrigin}
          disablePictureInPicture={disablePictureInPicture}
          disableRemotePlayback={disableRemotePlayback}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          src={src}
          poster={poster}
          onPause={(event, id) => {
            setIsPause(true);
            setIsResume(false);
            if (typeof onPause === 'function') {
              onPause(event, id);
            }
          }}
          onResume={(event, id) => {
            setIsResume(true);
            if (typeof onResume === 'function') {
              onResume(event, id);
            }
          }}
          onLoadedData={(event, id) => {
            setIsReady(true);
            setIsReadyed(true);
            if (typeof onLoadedData === 'function') {
              onLoadedData(event, id);
            }
          }}
          onLoadedMetadata={(event, id) => {
            if (typeof onLoadedMetadata === 'function') {
              onLoadedMetadata(event, id);
            }
          }}
          onCanPlay={(event, id) => {
            if (typeof onCanPlay === 'function') {
              onCanPlay(event, id);
            }
          }}
          onCanPlayThrough={(event, id) => {
            if (typeof onCanPlayThrough === 'function') {
              onCanPlayThrough(event, id);
            }
          }}
          onReady={(event, id) => {
            if (typeof onReady === 'function') {
              onReady(event, id);
            }
          }}
          onStart={(id) => {
            setIsStart(true);
            if (typeof onStart === 'function') {
              onStart(id);
            }
          }}
          onFirstQuartile={(id) => {
            setIsFirstQuartile(true);
            if (typeof onFirstQuartile === 'function') {
              onFirstQuartile(id);
            }
          }}
          onMidPoint={(id) => {
            setIsMidPoint(true);
            if (typeof onMidPoint === 'function') {
              onMidPoint(id);
            }
          }}
          onThirdQuartile={(id) => {
            setIsThirdQuartile(true);
            if (typeof onThirdQuartile === 'function') {
              onThirdQuartile(id);
            }
          }}
          onComplete={(event, id) => {
            setIsComplete(true);
            if (typeof onComplete === 'function') {
              onComplete(event, id);
            }
          }}
          onEnded={(event, id) => {
            if (typeof onEnded === 'function') {
              onEnded(event, id);
            }
          }}
          onEndedAfter={(id) => {
            setIsComplete(true);
            if (typeof onEndedAfter === 'function') {
              onEndedAfter(id);
            }
          }}
          onInvalidComplete={() => {
            if (typeof onInvalidComplete === 'function') {
              onInvalidComplete(id);
            }
          }}
          onError={(event, id) => {
            if (typeof onError === 'function') {
              onError(event, id);
            }
          }}
          onTimeUpdate={(event, diff, id) => {
            if (typeof onTimeUpdate === 'function') {
              onTimeUpdate(event, diff, id);
            }
          }}
          onNotLoadedData={(id) => {
            if (typeof onNotLoadedData === 'function') {
              onNotLoadedData(id);
            }
          }}
          onUnusualVideoStopped={(id, latestItem) => {
            if (typeof onUnusualVideoStopped === 'function') {
              onUnusualVideoStopped(id, latestItem);
            }
          }}
          onDurationChange={(event, id) => {
            if (typeof onDurationChange === 'function') {
              onDurationChange(event, id);
            }
          }}
          onEmptied={(event, id) => {
            if (typeof onEmptied === 'function') {
              onEmptied(event, id);
            }
          }}
          onLoadStart={(event, id) => {
            if (typeof onLoadStart === 'function') {
              onLoadStart(event, id);
            }
          }}
          onPlaying={(event, id) => {
            if (typeof onPlaying === 'function') {
              onPlaying(event, id);
            }
          }}
          onProgress={(event, id) => {
            if (typeof onProgress === 'function') {
              onProgress(event, id);
            }
          }}
          onRateChange={(event, id) => {
            if (typeof onRateChange === 'function') {
              onRateChange(event, id);
            }
          }}
          onSeeked={(event, id) => {
            if (typeof onSeeked === 'function') {
              onSeeked(event, id);
            }
          }}
          onSeeking={(event, id) => {
            if (typeof onSeeking === 'function') {
              onSeeking(event, id);
            }
          }}
          onStalled={(event, id) => {
            if (typeof onStalled === 'function') {
              onStalled(event, id);
            }
          }}
          onSuspend={(event, id) => {
            if (typeof onSuspend === 'function') {
              onSuspend(event, id);
            }
          }}
          onVolumeChange={(event, id) => {
            if (typeof onVolumeChange === 'function') {
              onVolumeChange(event, id);
            }
          }}
          onWaiting={(event, id) => {
            if (typeof onWaiting === 'function') {
              onWaiting(event, id);
            }
          }}
          />
      );
    },
  };
}