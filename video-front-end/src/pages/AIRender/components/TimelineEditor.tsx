import React, { useRef, useEffect, useState } from "react";
import { Modal } from "antd";
import AudioUploadCard from "@/components/AudioUploadCard";

// interface VideoClip {
//   id: string;
//   name: string;
//   startTime: number;
//   endTime: number;
//   duration: number;
//   position: number;
//   source: string;
//   thumbnail?: string;
// }

interface TimelineTrack {
  id: string;
  name: string;
  textColor: string;
  icon: string;
  color: string;
  clips: any; // 可以根据实际情况细化类型
}
interface TimelineEditorProps {
  tracks: TimelineTrack[];
  globalsWorkflowData: any;
}

const TIMELINE_DURATION = 72; // 总时长（秒）
const PIXELS_PER_SECOND = 30; // 每秒对应的像素宽度

const TimelineEditor: React.FC<TimelineEditorProps> = ({
  tracks,
  globalsWorkflowData,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null); // 新增：用于横向滚动
  const [cursorTime, setCursorTime] = useState(0);
  const [dragging, setDragging] = useState(false);

  const timelineContentWidth = TIMELINE_DURATION * PIXELS_PER_SECOND;
  const timelineTotalHeight = 40 + tracks.length * 40;

  const [modalVisible, setModalVisible] = useState(false);
  const [currentClipType, setCurrentClipType] = useState("");
  const [currentClip, setCurrentClip] = useState<any>(null);

  // 探头拖动逻辑
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging || !scrollRef.current) return;
      const rect = scrollRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left + scrollRef.current.scrollLeft;
      x = Math.max(0, Math.min(x, timelineContentWidth));
      const time = Math.round(x / PIXELS_PER_SECOND);
      setCursorTime(time);
    };
    const handleMouseUp = () => setDragging(false);

    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, timelineContentWidth]);

  // 探头自动滚动到可见区域
  useEffect(() => {
    if (scrollRef.current) {
      const cursorX = cursorTime * PIXELS_PER_SECOND;
      const scroll = scrollRef.current;
      const viewLeft = scroll.scrollLeft;
      const viewRight = scroll.scrollLeft + scroll.offsetWidth;
      // 如果探头在左侧不可见，则滚动到刚好可见
      if (cursorX < viewLeft) {
        scroll.scrollLeft = cursorX;
      }
      // 如果探头在右侧不可见，则滚动到刚好可见
      else if (cursorX > viewRight - 20) {
        scroll.scrollLeft = cursorX - scroll.offsetWidth + 20;
      }
      // 如果在可见区域内，不做处理
    }
  }, [cursorTime]);

  // 生成刻度
  const ticks = [];
  for (let i = 0; i <= TIMELINE_DURATION; i++) {
    ticks.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${i * PIXELS_PER_SECOND}px`,
          height: i % 5 === 0 ? 16 : 10,
          borderLeft: "2px solid RGB(51,51,51)",
          top: 0,
        }}
      >
        {i % 5 === 0 && (
          <span
            style={{
              position: "absolute",
              top: 18,
              left: i === 0 ? 0 : -10,
              fontSize: 12,
              color: "RGB(51,51,51)",
              minWidth: 32,
            }}
          >
            {/* {`00:${i.toString().padStart(2, "0")}`} */}
          </span>
        )}
      </div>
    );
  }
  return (
    <div
      className="timeline-editor"
      style={{
        overflow: "hidden",
        width: "100%",
        position: "relative",
        height: timelineTotalHeight,
        display: "flex", // 新增flex布局
        flexDirection: "row",
      }}
      ref={timelineRef}
      // onMouseDown={e => {
      //   const rect = timelineRef.current!.getBoundingClientRect();
      //   let x = e.clientX - rect.left;
      //   x = Math.max(0, Math.min(x, timelineContentWidth));
      //   const time = Math.round(x / PIXELS_PER_SECOND);
      //   setCursorTime(time);
      //   setDragging(true);
      // }}
    >
      {/* 左侧轨道头部 */}
      <div
        style={{
          width: 88,
          minWidth: 88,
          background: "#fff",
          zIndex: 2,
          position: "relative",
          height: timelineTotalHeight,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 30,
        }}
      >
        {tracks.map((track, _) => (
          <div
            key={track.id}
            className="track-header"
            style={{
              width: 80,
              minWidth: 80,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: track.textColor,
              fontWeight: 500,
              fontSize: 16,
              marginBottom: 0,
              userSelect: "none",
              height: 39,
            }}
          >
            <span style={{ fontSize: 12, marginBottom: 2 }}>{track.icon}</span>
            <span style={{ fontSize: 12 }}>{track.name}</span>
          </div>
        ))}
      </div>
      {/* 右侧内容区 */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          position: "relative",
          height: timelineTotalHeight,
          overflowX: "auto", // 关键：允许横向滚动
          overflowY: "hidden",
          background: "transparent",
        }}
        // onMouseDown={(e) => {
        //   const rect = scrollRef.current!.getBoundingClientRect();
        //   let x = e.clientX - rect.left + scrollRef.current!.scrollLeft;
        //   x = Math.max(0, Math.min(x, timelineContentWidth));
        //   const time = Math.round(x / PIXELS_PER_SECOND);
        //   setCursorTime(time);
        //   setDragging(true);
        // }}
      >
        {/* 贯穿所有内容的探头线 */}
        {/* <div
          style={{
            position: "absolute",
            left: `${cursorTime * PIXELS_PER_SECOND}px`,
            top: 0,
            height: timelineTotalHeight,
            width: 6,
            zIndex: 100,
            pointerEvents: "auto",
            cursor: dragging ? "grabbing" : "grab",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            userSelect: "none",
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setDragging(true);
          }}
        > */}
        {/* 探头头部SVG或样式 */}
        {/* <div style={{ width: 24, height: 32, marginBottom: -4 }}>
            <svg width="24" height="32">
              <rect
                x="6"
                y="0"
                width="12"
                height="16"
                rx="6"
                fill="#296cff"
                stroke="#296cff"
                strokeWidth="2"
              />
              <rect x="10" y="4" width="4" height="8" rx="2" fill="#fff" />
            </svg>
          </div> */}
        {/* 探头竖线  */}
        {/* <div
            style={{
              width: 4,
              flex: 1,
              background: "#296cff",
              borderRadius: 2,
              boxShadow: "0 0 2px #296cff",
            }}
          />
        </div> */}
        {/* 时间刻度条 */}
        <div
          className="timeline-ticks"
          style={{
            position: "absolute",
            left: 0, // 现在从0开始
            top: 10,
            height: 30,
            width: timelineContentWidth,
            //   width: '100%',
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          {ticks}
        </div>
        {/* 轨道内容 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 30,
            width: timelineContentWidth,
          }}
        >
          {tracks.map((track, _) => (
            <div
              className="timeline-track"
              key={track.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div
                className="track-content"
                style={{
                  flex: 1,
                  minHeight: 30,
                  background: "#f7f7f7",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  width: timelineContentWidth,
                  overflow: "hidden",
                }}
              >
                {track.clips && Array.isArray(track.clips) ? (
                  track.clips.map((clip, i) => (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: `${(i * 10 + i * 0.2) * PIXELS_PER_SECOND}px`,
                        width: `${10 * PIXELS_PER_SECOND}px`,
                        background: track.color || "#ccc",
                        color: "#000000E0",
                        borderRadius: 4,
                        padding: "2px 8px",
                        fontSize: 12,
                        cursor: "pointer",
                        zIndex: 1,
                        height: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                      onClick={() => {
                        const left = (i * 10 + i * 0.2) * PIXELS_PER_SECOND;
                        setCursorTime(Math.round(left / PIXELS_PER_SECOND));
                        setCurrentClip(clip);
                        setCurrentClipType(track.id);
                        setModalVisible(true);
                      }}
                    >
                      {track.id === "scenes-track" && (
                        <span>
                          {clip.scene}: {clip.scene_title}{" "}
                        </span>
                      )}
                      {track.id === "speech-text-track" && <span>{clip}</span>}
                      {track.id === "speech-audio-track" && (
                        <span>{clip.split("/").pop()}</span>
                      )}
                      {track.id === "video-track" && (
                        <span>{clip.split("/").pop()}</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      left: `${0 * PIXELS_PER_SECOND}px`,
                      width: `${71 * PIXELS_PER_SECOND}px`,
                      background: track.color || "#ccc",
                      color: "#000000E0",
                      borderRadius: 4,
                      padding: "2px 8px",
                      fontSize: 12,
                      cursor: "pointer",
                      zIndex: 1,
                      height: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                    onClick={() => {
                      const left = 0 * PIXELS_PER_SECOND;
                      setCursorTime(Math.round(left / PIXELS_PER_SECOND));
                      setCurrentClip(track.clips);
                      setCurrentClipType(track.id);
                      setModalVisible(true);
                    }}
                  >
                    {track.id === "bgm-track" && (
                      <span>{track.clips.split("/").pop()}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        style={{ zIndex: 10000 }}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <div
          style={{
            minHeight: "80px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {currentClipType === "bgm-track" && (
            <AudioUploadCard
              audioType="music"
              value={globalsWorkflowData?.music_audio_file}
              url={
                "https://ttt0001234.oss-cn-shenzhen.aliyuncs.com/common/audios/music.mp3"
              }
            />
          )}
          {currentClipType === "scenes-track" && (
            <div>
              <div
                style={{
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#333333",
                  }}
                >
                  {currentClip.scene}
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    color: "#666666",
                    marginLeft: "8px",
                  }}
                >
                  : {currentClip.scene_title} ({currentClip.scene_time})
                </span>
              </div>
              <div>
                <div
                  style={{
                    padding: "10px",
                    fontSize: "14px",
                    borderRadius: "5px",
                    whiteSpace: "pre-wrap",
                    overflowY: "auto",
                    maxHeight: "200px",
                  }}
                >
                  {currentClip.scene_content}
                </div>
              </div>
            </div>
          )}
          {currentClipType === "speech-text-track" && (
            <span>{currentClip}</span>
          )}
          {currentClipType === "speech-audio-track" && (
            <AudioUploadCard value={currentClip} url={currentClip} />
          )}
          {currentClipType === "video-track" && (
            <div style={{ width: "100%" }}>
              <div style={{ position: "relative", width: "100%" }}>
                <video
                  src={currentClip}
                  controls
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    background: "#000",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default TimelineEditor;
