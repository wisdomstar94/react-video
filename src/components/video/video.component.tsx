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
    onError,
    onLoadedData,
    onLoadedMetadata,
    onPause,
    onResume,
    onTimeUpdate,
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

  const videoRef = useRef<HTMLVideoElement>(null);

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
  
  function _onTimeUpdate(event: SyntheticEvent<HTMLVideoElement, Event>) {
    const video = getVideoElement();
    if (video === null) return;

    const duration = video.duration;
    const currentTime = video.currentTime;
    const currentProcessRate = (currentTime * 100) / duration;

    const catchTimePeriod = new Date().getTime() - prevCurrentTimeCatchTime.current;

    if (typeof onTimeUpdate === 'function') {
      onTimeUpdate(event, catchTimePeriod, id);
    }

    if (currentProcessRate >= 25) {
      if (getVideoElement()?.getAttribute('data-is-first-quartile') !== 'true') {
        getVideoElement()?.setAttribute('data-is-first-quartile', 'true');
        if (typeof onFirstQuartile === 'function') onFirstQuartile(id);
      }
    }
    if (currentProcessRate >= 50) {
      if (getVideoElement()?.getAttribute('data-is-midpoint') !== 'true') {
        getVideoElement()?.setAttribute('data-is-midpoint', 'true');
        if (typeof onMidPoint === 'function') onMidPoint(id);
      }
    }
    if (currentProcessRate >= 75) {
      if (getVideoElement()?.getAttribute('data-is-third-quartile') !== 'true') {
        getVideoElement()?.setAttribute('data-is-third-quartile', 'true');
        if (typeof onThirdQuartile === 'function') onThirdQuartile(id);
      }
    }

    prevCurrentTimeCatchTime.current = new Date().getTime();
  }

  const onEnded = useCallback((event: SyntheticEvent<HTMLVideoElement, Event>) => {
    if (getVideoElement()?.getAttribute('data-is-complete') !== 'true') {
      getVideoElement()?.setAttribute('data-is-complete', 'true');
      if (typeof onComplete === 'function') onComplete(id);
    }
  }, [getVideoElement, id, onComplete]);

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
          videoRef.current?.setAttribute('data-is-ready', 'true');
          if (typeof onLoadedData === 'function') {
            onLoadedData(event, id);
          }
        }}
        onLoadedMetadata={(event) => {
          if (typeof onLoadedMetadata === 'function') {
            onLoadedMetadata(event, id);
          }
        }}
        />
    </>
  );
}