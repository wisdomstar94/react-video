"use client"
import { useVideo } from "@/components/video/video.hook";
import { useEffect } from "react";

export default function Page() {
  const video = useVideo({
    id: 'my-video',
    onTimeUpdate: (event, catchTimePeriod) => {
      console.log('catchTimePeriod', catchTimePeriod);
    },
  });

  useEffect(() => {
    video.setVideoSrc(`http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div>
        { video.component('video') }
      </div>
      <div>
        비디오 재생중 여부 : { video.isPlaying ? '재생중' : '재생중아님' }
      </div>
      <div>
        <button onClick={() => {
          console.log('@video.currentStatus', video.currentStatus);
        }}>재생률 확인</button>
      </div>
      <div>
        <button onClick={() => {
          video.setCurrentTime(3, { isIfPausedAutoStart: true });
        }}>
          currentTime 바꾸기
        </button>
        <button onClick={() => {
          console.log('z', video.getCurrentTime());
        }}>
          현재 currentTime 가져오기
        </button>
        <button onClick={() => {
          video.setVideoSrc(`http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4`, {
            isSetPause: true,
          });
        }}>
          영상 url 바꾸고 바로 멈추기
        </button>
      </div>
    </>
  );
}
