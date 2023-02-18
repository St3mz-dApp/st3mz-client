import { useEffect, useRef, useState } from "react";
import {
  MdPauseCircle,
  MdPlayCircle,
  MdStopCircle,
  MdVolumeOff,
  MdVolumeUp,
} from "react-icons/md";
import WaveSurfer from "wavesurfer.js";

export const AudioTrack = ({
  url,
  onDurationRead,
  small,
}: {
  url: string;
  onDurationRead?: (duration: number) => void;
  small?: boolean;
}): JSX.Element => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer>();
  const [isPlaying, setIsPlaying] = useState<boolean>();
  const [isMuted, setIsMuted] = useState<boolean>();

  useEffect(() => {
    if (waveformRef.current && !wavesurfer) {
      const wavesurferInstance = WaveSurfer.create({
        container: waveformRef.current,
        cursorColor: "#ffffff00",
        backgroundColor: "#00000024",
        progressColor: "#e88605",
        waveColor: "#c7ad1c",
        height: small ? 50 : 70,
        responsive: true,
      });
      wavesurferInstance.load(url);
      setWavesurfer(wavesurferInstance);
      wavesurferInstance.on("finish", () => {
        wavesurferInstance.setCursorColor("#ffffff00");
        setIsPlaying(false);
      });
      if (!small) {
        wavesurferInstance.on("seek", () => {
          wavesurferInstance.setCursorColor("#ffffff");
        });
      }
      wavesurferInstance.on("ready", () => {
        if (onDurationRead)
          onDurationRead(Math.round(wavesurferInstance.getDuration()));
      });

      // Destroy the wavesurfer instance when the component unmounts
      return () => {
        wavesurferInstance.destroy();
      };
    }
  }, []);

  const play = () => {
    if (!wavesurfer) return;
    wavesurfer.playPause();
    setIsPlaying(true);
    if (!small) {
      wavesurfer.setCursorColor("#ffffff");
    }
  };

  const pause = () => {
    if (!wavesurfer) return;
    wavesurfer.playPause();
    setIsPlaying(false);
  };

  const stop = () => {
    if (!wavesurfer) return;
    wavesurfer.stop();
    setIsPlaying(false);
    wavesurfer.setCursorColor("#ffffff00");
  };

  const mute = () => {
    if (!wavesurfer) return;
    wavesurfer.setMute(true);
    setIsMuted(true);
  };

  const unmute = () => {
    if (!wavesurfer) return;
    wavesurfer.setMute(false);
    setIsMuted(false);
  };

  return (
    <div className="flex items-center">
      <div className="mr-2">
        {!isPlaying && (
          <MdPlayCircle
            className="h-8 w-8 cursor-pointer text-primary"
            onClick={play}
          />
        )}
        {isPlaying && (
          <MdPauseCircle
            className="h-8 w-8 cursor-pointer text-primary"
            onClick={pause}
          />
        )}
        {!small && (
          <MdStopCircle
            className="h-8 w-8 cursor-pointer text-primary"
            onClick={stop}
          />
        )}
      </div>
      <div
        ref={waveformRef}
        className="w-full overflow-hidden rounded-lg"
      ></div>
      {!small && (
        <div className="ml-2">
          {!isMuted && (
            <MdVolumeUp
              className="h-7 w-7 cursor-pointer text-primary"
              onClick={mute}
            />
          )}
          {isMuted && (
            <MdVolumeOff
              className="h-7 w-7 cursor-pointer text-primary"
              onClick={unmute}
            />
          )}
        </div>
      )}
    </div>
  );
};
