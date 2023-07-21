"use client"
import { Video } from "@/components/video/video.component";
import { IVideo } from "@/components/video/video.interface";
import { useState } from "react";

export default function Page() {
  const [currentTimeObj, setCurrentTimeObj] = useState<IVideo.CurrentTimeObj>();
  const [offset, setOffset] = useState<string>('0');

  return (
    <>
      <div className="w-full relative">
        <Video
          id="my-video"
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          autoPlay={true}
          currentTimeObj={currentTimeObj}
          isPreventBackCurrentTime={true}
          />
      </div>
      <div className="w-full relative">
        <input type="number" value={offset} onChange={e => setOffset(e.target.value)} />
        <button 
          onClick={() => {
            setCurrentTimeObj({
              second: Number(offset),
            });
          }}>offset 바꾸기</button>
      </div>
    </>
  );
}
