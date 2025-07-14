import React, { useRef, useState, useEffect } from "react";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import playIcon from "@/assets/images/icons/play.png";
import stopIcon from "@/assets/images/icons/stop.png";
import deleteIcon from "@/assets/images/icons/delete.png";
import downloadIcon from "@/assets/images/icons/download.png";

interface AudioUploadCardProps {
  value?: File | null;
  url?: string;
  onChange?: (file: File | null, url: string) => void;
  accept?: string;
  placeholder?: string;
  downloadMode?: boolean;
  className?: string;
  audioType?: string; //用于标识音频类型
}

const AudioUploadCard: React.FC<AudioUploadCardProps> = ({
  value,
  url,
  onChange,
  accept = "audio/*",
  placeholder = "点击上传音频",
  downloadMode,
  className,
  audioType,
}) => {
  const [file, setFile] = useState<File | null>(value || null);
  const [audioUrl, setAudioUrl] = useState<string>(url || "");
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMusic, setIsMusic] = useState<boolean>(audioType === "music");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (value) setFile(value);
    if (url) setAudioUrl(url);
    setIsMusic(audioType === "music");
    console.log("audioType", isMusic); // Add this line to log the value of audioType
  }, [value, url, audioType]);

  const handleUpload = (info: any) => {
    const file = info.file as File;
    const url = URL.createObjectURL(file);
    setFile(file);
    setAudioUrl(url);
    setCurrentTime(0);
    setDuration(0);
    if (onChange) onChange(file, url);
  };

  const handleRemove = () => {
    setFile(null);
    setAudioUrl("");
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
    if (onChange) onChange(null, "");
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);
  const waveformData = [
    30, 50, 40, 60, 35, 55, 45, 65, 30, 50, 40, 60, 35, 55, 45, 65, 30, 50, 40,
    60, 35, 55, 45, 65, 30, 50, 40, 60, 35, 55, 45, 65, 30, 50, 40, 60, 35, 55,
    45, 65, 30, 50, 40, 60, 35, 55, 45, 65, 30, 50, 40, 60, 35, 55, 45,
  ];
  const [dynamicWaveform, setDynamicWaveform] =
    useState<number[]>(waveformData);
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isMusic && isPlaying) {
      timer = setInterval(() => {
        setDynamicWaveform((prev) =>
          prev.map((_, i) => {
            // 只对已播放部分做动态浮动
            const percent = (i + 1) / waveformData.length;
            const progress = duration ? currentTime / duration : 0;
            if (percent <= progress) {
              // 在原始高度基础上微调
              const base = waveformData[i];
              const fluctuation = Math.random() * 20 - 10; // -10~+10
              return Math.max(10, Math.min(100, base + fluctuation));
            }
            return waveformData[i];
          })
        );
      }, 100);
    } else {
      setDynamicWaveform(waveformData);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isMusic, isPlaying, currentTime, duration]);

  return (file && audioUrl) || downloadMode ? (
    <div
      className={`audio-upload-card${className ? " " + className : ""}${
        downloadMode ? " audio-download-mode" : ""
      }`}
    >
      <div className="audio-card-row1">
        <div className="audio-file-name">
        {file && file.name ? file.name : typeof audioUrl === 'string' ? audioUrl.split("/").pop() : '默认文件名'}
        </div>
        <div className="audio-card-right">
          {downloadMode ? (
            <a
              className="audio-download-btn"
              href={audioUrl}
              download
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={downloadIcon}
                alt="下载"
                style={{ width: 12, height: 12, display: "block" }}
              />
            </a>
          ) : (
            <span className="audio-remove-btn" onClick={handleRemove}>
              <img
                src={deleteIcon}
                alt="删除"
                style={{ width: 10, height: 10, display: "block" }}
              />
            </span>
          )}
        </div>
      </div>
      <div className="audio-card-row2">
        <button
          type="button"
          className="audio-play-btn"
          onClick={handlePlayPause}
          style={{
            width: 28,
            padding: 0,
            border: "none",
            background: "none",
            marginRight: 10,
            cursor: "pointer",
          }}
        >
          <img
            src={isPlaying ? stopIcon : playIcon}
            alt={isPlaying ? "stop" : "play"}
            style={{ width: 28, height: 28 }}
          />
        </button>
        <div className="audio-progress-bar">
          {isMusic ? (
            // 音乐文件使用波形图样式
            <div className="audio-progress-bg music-style">
              <div className="audio-waveform">
                {dynamicWaveform.map((value, index) => {
                  const percent = (index + 1) / waveformData.length;
                  const progress = duration ? currentTime / duration : 0;
                  return (
                    <div
                      key={index}
                      className={`audio-waveform-bar${
                        percent <= progress ? " active" : ""
                      }`}
                      style={{
                        height: `${value}%`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            // 语音文件使用现有的进度条样式
            <div className="audio-progress-bg">
              <div
                className="audio-progress-fg"
                style={{
                  width: duration ? `${(currentTime / duration) * 100}%` : "0%",
                }}
              />
            </div>
          )}
          <span className="audio-duration">{formatTime(duration)}</span>
        </div>
        <audio
          ref={audioRef}
          src={audioUrl}
          style={{ display: "none" }}
          onLoadedMetadata={(e) => {
            setDuration(e.currentTarget.duration);
            setCurrentTime(0);
          }}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        />
      </div>
    </div>
  ) : (
    <Upload
      className="custom-upload-card"
      showUploadList={false}
      accept={accept}
      beforeUpload={() => false}
      onChange={handleUpload}
    >
      <div className="custom-upload-card-inner">
        <div className="custom-upload-icon">
          <UploadOutlined />
          <span className="custom-upload-title">上传</span>
        </div>
        <div className="custom-upload-desc">{placeholder}</div>
      </div>
    </Upload>
  );
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `00:${m}:${s}`;
}

export default AudioUploadCard;
