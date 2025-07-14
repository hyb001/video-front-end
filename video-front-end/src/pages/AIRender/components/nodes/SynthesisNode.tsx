import React from "react";
import { Handle, Position } from "reactflow";
import { Tooltip } from "antd";
import {
  CheckCircleFilled,
  LoadingOutlined,
  ExclamationCircleFilled,
  PlayCircleOutlined,
} from "@ant-design/icons";

interface SynthesisNodeProps {
  data: {
    label: string;
    inputs: {
      music_audio: string;
      speech_audio_list: string[];
      video_clips: {
        video_clips: string[];
      };
    };
    outputs: {
      out_video: string;
    };
    status: "idle" | "running" | "completed" | "error";
  };
  selected: boolean;
  outerRef?: React.Ref<HTMLDivElement>;
}

const SynthesisNode: React.FC<SynthesisNodeProps> = ({
  data,
  selected,
  outerRef,
}) => {
  const getStatusIcon = () => {
    switch (data.status) {
      case "running":
        return <LoadingOutlined className="node-status-icon running" />;
      case "completed":
        return <CheckCircleFilled className="node-status-icon completed" />;
      case "error":
        return <ExclamationCircleFilled className="node-status-icon error" />;
      default:
        return <PlayCircleOutlined className="node-status-icon idle" />;
    }
  };

  return (
    <div
      ref={outerRef}
      className={`workflow-node ${selected ? "selected" : ""}`}
    >
      <Handle type="target" position={Position.Top} className="node-handle" />

      <div className="node-header">
        <div className="node-title">{data.label}</div>
        <Tooltip
          title={
            data.status === "idle"
              ? "待执行"
              : data.status === "running"
              ? "执行中"
              : data.status === "completed"
              ? "已完成"
              : "执行出错"
          }
        >
          {getStatusIcon()}
        </Tooltip>
      </div>

      {/* <div className="node-info">
        <div>
          <strong>背景音乐：</strong>
          {data.input && data.input.music_audio ? "已设置" : "未设置"}
        </div>
        <div>
          <strong>语音素材：</strong>
          {data.input && data.input.speech_list
            ? data.input.speech_list.length
            : 0}{" "}
          个
        </div>
        <div>
          <strong>视频素材：</strong>
          {data.input && data.input.video_clips
            ? data.input.video_clips.length
            : 0}{" "}
          个
        </div>
      </div> */}
      <div className="node-info">
        {data.outputs && (
          <div className="node-info">
            <div>
              <strong>合成视频：</strong>
              {data.outputs.out_video ? 1 : 0}个
            </div>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="node-handle"
      />
    </div>
  );
};

export default SynthesisNode;
