"use client"
import { Video } from "@/components/video/video.component";
import { useEffect, useState } from "react";

export default function Page() {
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    setSrc(process.env.NEXT_PUBLIC_NOT_LOADED_DATA_VIDEO_URL ?? '');
  }, []);

  return (
    <>
      <div className="w-full relative">
        <Video
          id="my-video"
          src={src}
          autoPlay={true}
          onLoadedMetadata={(event, id) => {
            console.log('@onLoadedMetadata', id);
          }}
          onLoadedData={(event, id) => {
            console.log('@onLoadedData', id);
          }}
          onNotLoadedData={(id) => {
            console.log('@onNotLoadedData', id);
          }}
          />
      </div>
    </>
  );
}
