import { SyntheticEvent, useCallback, useEffect, useMemo, useRef } from "react";
import { IVideo } from "./video.interface";

export function Video(props: IVideo.Props) {
  const {
    id,
    className,
    src,
    currentTimeObj,
    onPlay,
    onCanPlay,
    onCanPlayThrough,
    onReady,
    onStart,
    onFirstQuartile,
    onMidPoint,
    onThirdQuartile,
    onComplete,
    onEnded,
    onEndedAfter,
    onInvalidComplete,
    onError,
    onLoadedData,
    onLoadedMetadata,
    onPause,
    onResume,
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
  const autoPlay = props.autoPlay ?? true;
  const controls = props.controls ?? false;
  const disablePictureInPicture = props.disablePictureInPicture ?? true;
  const disableRemotePlayback = props.disableRemotePlayback ?? true;
  const loop = props.loop ?? false;
  const muted = props.muted ?? true;
  const playsInline = props.playsInline ?? true;
  const preload = props.preload ?? 'auto';
  const poster = props.poster;
  const isPreventBackCurrentTime = props.isPreventBackCurrentTime ?? false;
  const elementId = useMemo(() => `id_${id}`, [id]);
  const loadedInfo = useRef<IVideo.LoadedInfo>();
  const timeUpdateItems = useRef<IVideo.TimeUpdateItem[]>([]);
  const onUnusualVideoStoppedTimeout = useRef<NodeJS.Timeout>();
  const prevSrc = useRef<string>();

  const videoRef = useRef<HTMLVideoElement>(null);
  const timeUpdateItemsCheckInfo = useRef<IVideo.TimeUpdateItemsCheckInfo>({ callback: () => {} });
  timeUpdateItemsCheckInfo.current.callback = () => {
    const element = getVideoElement();
    if (element === null) return;
    if (element.paused === true || timeUpdateItems.current.find(x => x.duration !== x.currentTime) === undefined) {
      return;
    }
    if (timeUpdateItems.current.length === 0) return;
    const readyedTimeUpdateItems = timeUpdateItems.current.filter(x => x.isReadyed);
    if (readyedTimeUpdateItems.length === 0) return;
    
    const latestItem = (readyedTimeUpdateItems[readyedTimeUpdateItems.length - 1]);
    if (latestItem.isPaused === true) return;

    const duration = latestItem.duration;
    const latestCurrentTime = latestItem.currentTime;
    const latestCreatedAt = latestItem.createdAt;
    const remainTime = duration - latestCurrentTime;

    // if (Date.now() - latestCreatedAt > 8000) {
    //   return;
    // }

    // const isUnusualVideoStoped = () => {
    //   if (Date.now() - 3000 > latestCreatedAt + (remainTime * 1000)) {
    //     return true;
    //   }
    //   return false;
    // };
    const isUnusualVideoStoped = () => {
      if (Date.now() - latestCreatedAt > 3000) {
        return true;
      }
      return false;
    };

    clearTimeout(onUnusualVideoStoppedTimeout.current);

    if (isUnusualVideoStoped()) {
      // 비정삭적으로 영상이 멈춤..
      // console.error(`[${dateNow}] [${id}] 영상이 비정상적으로 멈췄습니다.`);
      clearInterval(timeUpdateItemsCheckInfo.current.interval);
      timeUpdateItemsCheckInfo.current.interval = undefined;

      if (element.ended === true) { // 영상이 끝까지 재생이 완료 되었는데 정지된 경우
        if (typeof onEndedAfter === 'function') {
          onEndedAfter(id);
        }
      } else { // 영상이 재생 되는 도중에 정지된 경우 (영상이 끝까지 재생되지 않은채로 정지된 경우)
        onUnusualVideoStoppedTimeout.current = setTimeout(() => {
          if (typeof onUnusualVideoStopped === 'function') {
            onUnusualVideoStopped(id, latestItem);
          }
        }, 3000);
      }
    }
  };

  if (prevSrc.current !== src || typeof src !== 'string') {
    const videoElement = videoRef.current;
    if (videoElement !== null) {
      clearTimeout(onUnusualVideoStoppedTimeout.current);
      clearInterval(timeUpdateItemsCheckInfo.current.interval);
      timeUpdateItemsCheckInfo.current.interval = undefined;
      timeUpdateItems.current = [];
      videoElement.removeAttribute('data-is-ready');
      videoElement.removeAttribute('data-is-start');
      videoElement.removeAttribute('data-start-at');
      videoElement.removeAttribute('data-is-first-quartile');
      videoElement.removeAttribute('data-is-midpoint');
      videoElement.removeAttribute('data-is-third-quartile');
      videoElement.removeAttribute('data-is-complete');
    }
  }

  const prevCurrentTimeCatchTime = useRef<number>(new Date().getTime());

  const getVideoElement = useCallback(() => {
    return document.getElementById(elementId) as HTMLVideoElement;
  }, [elementId]);

  const _onPlay = useCallback((event: SyntheticEvent<HTMLVideoElement, Event>) => {
    if (typeof onPlay === 'function') {
      onPlay(event, id);
    }

    const element = getVideoElement();
    if (element?.getAttribute('data-is-start') !== 'true') {
      element?.setAttribute('data-is-start', 'true');
      element?.setAttribute('data-start-at', Date.now().toString());

      if (typeof onStart === 'function') onStart(id);
    } else {
      if (typeof onResume === 'function') onResume(event, id);
    }
  }, [getVideoElement, id, onPlay, onResume, onStart]);

  function isValidTimeUpdateItems() {
    if (timeUpdateItems.current.length <= 1) return false;
    const target = timeUpdateItems.current.find(x => x.currentTime !== x.duration);
    if (target === undefined) return false;
    return true;
  }
  
  function _onTimeUpdate(event: SyntheticEvent<HTMLVideoElement, Event>) {
    const video = getVideoElement();
    if (video === null) return;

    const duration = video.duration;
    const currentTime = video.currentTime;
    timeUpdateItems.current.push({ 
      duration, 
      currentTime, 
      createdAt: new Date().getTime(), 
      isReadyed: video.getAttribute('data-is-start') === 'true',
    });

    if (timeUpdateItemsCheckInfo.current.interval === undefined && video.getAttribute('data-is-start') === 'true') {
      clearInterval(timeUpdateItemsCheckInfo.current.interval);
      timeUpdateItemsCheckInfo.current.interval = setInterval(() => {
        // console.log(`[${id}] callback called`);
        timeUpdateItemsCheckInfo.current.callback();
      }, 200);
    }

    const currentProcessRate = (currentTime * 100) / duration;

    const catchTimePeriod = new Date().getTime() - prevCurrentTimeCatchTime.current;

    if (typeof onTimeUpdate === 'function') {
      onTimeUpdate(event, catchTimePeriod, id);
    }

    if (currentProcessRate >= 25) {
      if (getVideoElement()?.getAttribute('data-is-first-quartile') !== 'true') {
        if (isValidTimeUpdateItems()) {
          getVideoElement()?.setAttribute('data-is-first-quartile', 'true');
          if (typeof onFirstQuartile === 'function') onFirstQuartile(id);
        }
      }
    }
    if (currentProcessRate >= 50) {
      if (getVideoElement()?.getAttribute('data-is-midpoint') !== 'true') {
        if (isValidTimeUpdateItems()) {
          getVideoElement()?.setAttribute('data-is-midpoint', 'true');
          if (typeof onMidPoint === 'function') onMidPoint(id);
        }
      }
    }
    if (currentProcessRate >= 75) {
      if (getVideoElement()?.getAttribute('data-is-third-quartile') !== 'true') {
        if (isValidTimeUpdateItems()) {
          getVideoElement()?.setAttribute('data-is-third-quartile', 'true');
          if (typeof onThirdQuartile === 'function') onThirdQuartile(id);
        }
      }
    }

    prevCurrentTimeCatchTime.current = new Date().getTime();
  }

  const _onEnded = useCallback((event: SyntheticEvent<HTMLVideoElement, Event>) => {
    if (typeof onEnded === 'function') onEnded(event, id);

    clearTimeout(onUnusualVideoStoppedTimeout.current);
    clearInterval(timeUpdateItemsCheckInfo.current.interval);
    timeUpdateItemsCheckInfo.current.interval = undefined;

    if (getVideoElement()?.getAttribute('data-is-complete') !== 'true') {
      if (isValidTimeUpdateItems()) {
        getVideoElement()?.setAttribute('data-is-complete', 'true');
        if (typeof onComplete === 'function') onComplete(event, id);
      } else {
        // console.log(`[${id}] @@timeUpdateItems.current`, timeUpdateItems.current);
        if (typeof onInvalidComplete === 'function') onInvalidComplete(id);
      }
    }
  }, [getVideoElement, id, onComplete, onEnded, onInvalidComplete]);

  useEffect(() => {
    if (currentTimeObj === undefined) return;
    if (videoRef.current === null) return;

    if (isPreventBackCurrentTime === true) {
      if (videoRef.current.currentTime > currentTimeObj.second) {
        return;
      }
    }
    
    videoRef.current.currentTime = currentTimeObj.second;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTimeObj]);

  useEffect(() => {
    const _timeUpdateItemsCheckInfo = timeUpdateItemsCheckInfo.current;
    const onUnusualVideoStoppedTimeoutCurrent = onUnusualVideoStoppedTimeout.current;

    return () => {
      clearTimeout(onUnusualVideoStoppedTimeoutCurrent);
      clearInterval(_timeUpdateItemsCheckInfo.interval);
      _timeUpdateItemsCheckInfo.interval = undefined;
    };
  }, []);

  useEffect(() => {
    prevSrc.current = src;
  }, [src]);

  return (
    <>
      <video
        ref={videoRef}
        id={elementId}
        className={className}
        autoPlay={autoPlay}
        controls={controls}
        disablePictureInPicture={disablePictureInPicture}
        disableRemotePlayback={disableRemotePlayback}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload={preload}
        poster={poster}
        src={src}
        onPause={(event) => {
          timeUpdateItems.current.push({
            createdAt: new Date().getTime(),
            currentTime: getVideoElement().currentTime ?? 0,
            duration: getVideoElement().duration ?? 0,
            isReadyed: getVideoElement().getAttribute('data-is-ready') === 'true',
            isPaused: true,
          });

          if (typeof onPause === 'function') onPause(event, id);
        }}
        onCanPlay={(event) => {
          if (typeof onCanPlay === 'function') onCanPlay(event, id);
        }}
        onCanPlayThrough={(event) => {
          if (typeof onCanPlayThrough === 'function') onCanPlayThrough(event, id);

          if (videoRef.current?.getAttribute('data-is-ready') !== 'true') {
            videoRef.current?.setAttribute('data-is-ready', 'true');
            if (typeof onReady === 'function') onReady(event, id);
          }
        }}
        onPlay={_onPlay}
        onTimeUpdate={_onTimeUpdate}
        onEnded={_onEnded}
        onError={(event) => {
          if (typeof onError === 'function') {
            onError(event, id);
          }
        }}
        onLoadedData={event => {
          if (loadedInfo.current !== undefined) {
            loadedInfo.current.loadedDataAt = Date.now();
          }
          if (typeof onLoadedData === 'function') {
            onLoadedData(event, id);
          }
        }}
        onLoadedMetadata={(event) => {
          if (loadedInfo.current?.loadedDataCheckTimeout !== undefined) {
            clearTimeout(loadedInfo.current?.loadedDataCheckTimeout);
          }
          loadedInfo.current = {
            loadedMetaDataAt: Date.now(),
            loadedDataAt: undefined,
            loadedDataCheckTimeout: setTimeout(() => {
              if (loadedInfo.current?.loadedDataAt === undefined) {
                if (typeof onNotLoadedData === 'function') onNotLoadedData(id);
              }
            }, 3000),
          };
          
          if (typeof onLoadedMetadata === 'function') {
            onLoadedMetadata(event, id);
          }
        }}
        onDurationChange={(event) => {
          if (typeof onDurationChange === 'function') {
            onDurationChange(event, id);
          }
        }}
        onEmptied={(event) => {
          if (typeof onEmptied === 'function') {
            onEmptied(event, id);
          }
        }}
        onLoadStart={(event) => {
          if (typeof onLoadStart === 'function') {
            onLoadStart(event, id);
          }
        }}
        onPlaying={(event) => {
          if (typeof onPlaying === 'function') {
            onPlaying(event, id);
          }
        }}
        onProgress={(event) => {
          if (typeof onProgress === 'function') {
            onProgress(event, id);
          }
        }}
        onRateChange={(event) => {
          if (typeof onRateChange === 'function') {
            onRateChange(event, id);
          }
        }}
        onSeeked={(event) => {
          if (typeof onSeeked === 'function') {
            onSeeked(event, id);
          }
        }}
        onSeeking={(event) => {
          if (typeof onSeeking === 'function') {
            onSeeking(event, id);
          }
        }}
        onStalled={(event) => {
          if (typeof onStalled === 'function') {
            onStalled(event, id);
          }
        }}
        onSuspend={(event) => {
          if (typeof onSuspend === 'function') {
            onSuspend(event, id);
          }
        }}
        onVolumeChange={(event) => {
          if (typeof onVolumeChange === 'function') {
            onVolumeChange(event, id);
          }
        }}
        onWaiting={(event) => {
          if (typeof onWaiting === 'function') {
            onWaiting(event, id);
          }
        }}
        />
    </>
  );
}