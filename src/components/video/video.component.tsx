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
    onStart,
    onFirstQuartile,
    onMidPoint,
    onThirdQuartile,
    onComplete,
    onInvalidComplete,
    onError,
    onLoadedData,
    onLoadedMetadata,
    onPause,
    onResume,
    onTimeUpdate,
    onNotLoadedData,
    onUnusualVideoStoped,
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

  const videoRef = useRef<HTMLVideoElement>(null);
  const timeUpdateItemsCheckInfo = useRef<IVideo.TimeUpdateItemsCheckInfo>({ callback: () => {} });
  timeUpdateItemsCheckInfo.current = {
    callback: () => {
      const element = getVideoElement();
      if (element === null) return;
      if (element.paused === true || timeUpdateItems.current.find(x => x.duration !== x.currentTime) === undefined) {
        clearInterval(timeUpdateItemsCheckInfo.current.interval);
        // timeUpdateItems.current = [];
        timeUpdateItemsCheckInfo.current.interval = undefined;
        return;
      }
      if (timeUpdateItems.current.length === 0) return;
      const dateNow = new Date().getTime();
      const readyedTimeUpdateItems = timeUpdateItems.current.filter(x => x.isReadyed);
      if (readyedTimeUpdateItems.length === 0) return;
      const latestCreatedAt = (readyedTimeUpdateItems[readyedTimeUpdateItems.length - 1]).createdAt;

      if (element.paused === false && dateNow > latestCreatedAt) {
        if (dateNow - latestCreatedAt > 3000) {
          // 비정삭적으로 영상이 멈춤..
          console.error(`[${dateNow}] [${id}] 영상이 비정상적으로 멈췄습니다.`);
          clearInterval(timeUpdateItemsCheckInfo.current.interval);
          if (typeof onUnusualVideoStoped === 'function') {
            onUnusualVideoStoped(id);
          }
        }
      }
    },
  };

  const prevCurrentTimeCatchTime = useRef<number>(new Date().getTime());

  const getVideoElement = useCallback(() => {
    return document.getElementById(elementId) as HTMLVideoElement;
  }, [elementId]);

  const _onPlay = useCallback((event: SyntheticEvent<HTMLVideoElement, Event>) => {
    if (typeof onPlay === 'function') {
      onPlay(event, id);
    }

    if (getVideoElement()?.getAttribute('data-is-start') !== 'true') {
      getVideoElement()?.setAttribute('data-is-start', 'true');
      if (typeof onStart === 'function') onStart(id);
    } else {
      if (typeof onResume === 'function') onResume(id);
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

    if (timeUpdateItemsCheckInfo.current.interval === undefined) {
      timeUpdateItemsCheckInfo.current.interval = setInterval(() => {
        timeUpdateItemsCheckInfo.current.callback();
      }, 1000);
    }

    const duration = video.duration;
    const currentTime = video.currentTime;
    timeUpdateItems.current.push({ 
      duration, 
      currentTime, 
      createdAt: new Date().getTime(), 
      isReadyed: video.getAttribute('data-is-start') === 'true',
    });

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

  const onEnded = useCallback((event: SyntheticEvent<HTMLVideoElement, Event>) => {
    clearInterval(timeUpdateItemsCheckInfo.current.interval);

    if (getVideoElement()?.getAttribute('data-is-complete') !== 'true') {
      if (isValidTimeUpdateItems()) {
        getVideoElement()?.setAttribute('data-is-complete', 'true');
        if (typeof onComplete === 'function') onComplete(id);
      } else {
        console.log(`[${id}] @@timeUpdateItems.current`, timeUpdateItems.current);
        if (typeof onInvalidComplete === 'function') onInvalidComplete(id);
      }
    }
  }, [getVideoElement, id, onComplete, onInvalidComplete]);

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
    return () => {
      clearInterval(timeUpdateItemsCheckInfo.current.interval);
    };
  }, []);

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
        onPause={() => {
          if (typeof onPause === 'function') onPause(id)
        }}
        onCanPlay={(event) => {
          if (typeof onCanPlay === 'function') onCanPlay(event, id);
        }}
        onPlay={_onPlay}
        onTimeUpdate={_onTimeUpdate}
        onEnded={onEnded}
        onError={(event) => {
          if (typeof onError === 'function') {
            onError(event, id);
          }
        }}
        onLoadedData={event => {
          if (loadedInfo.current !== undefined) {
            loadedInfo.current.loadedDataAt = Date.now();
          }
          videoRef.current?.setAttribute('data-is-ready', 'true');
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
        />
    </>
  );
}