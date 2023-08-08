"use client"
import { Video } from "@/components/video/video.component";
import { useState } from "react";

export default function Page() {
  const [inputedSrc, setInputedSrc] = useState<string>('');
  const [src, setSrc] = useState<string>();

  return (
    <>
      <div>
        <input 
          className="border border-slate-700"
          type="text" 
          value={inputedSrc} 
          onChange={e => setInputedSrc(e.target.value)} 
          />
        <button 
          className="inline-flex px-4 py-1 border border-slate-700 text-xs cursor-pointer hover:bg-black/20"
          onClick={() => {
            setSrc(inputedSrc);
          }}
          >
          src 바꾸기
        </button>
      </div>
      <div className="w-full relative">
        <Video
          id="my-video"
          src={src}
          // className="w-full h-[400px]"
          controls={true}
          autoPlay={true}
          onStart={(id) => {
            console.log('@onStart', id);
          }}
          onFirstQuartile={(id) => {
            console.log('@onFirstQuartile', id);
          }}
          onMidPoint={(id) => {
            console.log('@onMidPoint', id);
          }}
          onThirdQuartile={(id) => {
            console.log('@onThirdQuartile', id);
          }}
          onComplete={(id) => {
            console.log('@onComplete', id);
          }}
          onLoadedMetadata={(event, id) => {
            console.log('@onLoadedMetadata', id);
          }}
          onLoadedData={(event, id) => {
            console.log('@onLoadedData', id);
          }}
          onNotLoadedData={(id) => {
            console.error('@onNotLoadedData', id);
          }}
          onInvalidComplete={(id) => {
            console.error('@onInvalidComplete', id);
          }}
          onUnusualVideoStoped={(id, latestItem) => {
            console.error('@onUnusualVideoStoped', id);
            console.error(`@onUnusualVideoStoped ${id}.latestItem`, latestItem);
          }}
          />
      </div>
    </>
  );
}
