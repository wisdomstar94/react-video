"use client"
import { useVideo } from "@/components/video/video.hook";
import { useEffect } from "react";

export default function Page() {
  const video = useVideo({
    id: 'my-video',
    onCanPlay(event) {
      console.log('@onCanPlay', Date.now());
    },
    onLoadedMetadata(event) {
      console.log('@onLoadedMetadata', Date.now());
    },
    onLoadedData(event) {
      console.log('@onLoadedData', Date.now());
    },
  });

  useEffect(() => {
    video.setAutoPlay(false);
    video.setPreload('metadata');
    video.setVideoSrc(`http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4`);
    video.setPoster('none');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div>
        { video.component('video') }
      </div>
      <div>
        <button onClick={() => {
          video.setCurrentTime(3, { isIfPausedAutoStart: true });
        }}>
          currentTime 바꾸기
        </button>
        <button onClick={() => {
          video.setVideoSrc(undefined);
        }}>
          영상 url undefined 로 할당하기
        </button>
        <button onClick={() => {
          video.setVideoSrc(`http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4`);
        }}>
          다른 영상 url 할당하기
        </button>
        <button onClick={() => {
          video.play();
        }}>
          플레이 시작하기
        </button>
      </div>
    </>
  );
}
