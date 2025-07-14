import React from "react";
import { Handle, Position } from "reactflow";
import { Tooltip } from "antd";
import {
  CheckCircleFilled,
  LoadingOutlined,
  ExclamationCircleFilled,
  PlayCircleOutlined,
} from "@ant-design/icons";

interface CloneNodeProps {
  data: {
    label: string;
    input: {
      text: string[];
      prompt_audio: string;
      instruct: string;
    };
    outputs: string[];
    status: "idle" | "running" | "completed" | "error";
  };
  selected: boolean;
  outerRef?: React.Ref<HTMLDivElement>;
}

const CloneNode: React.FC<CloneNodeProps> = ({ data, selected, outerRef }) => {
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

      {data.outputs && (
        <div className="node-info">
          <div>
            <strong>合成声音列表：</strong>
            {Array.isArray(data.outputs) ? data.outputs.length : 0}个
          </div>
        </div>
      )}

      {/* <div className="node-info">
        <div>
          <strong>克隆声音：</strong>
          {data.input.prompt_audio ? "已设置" : "未设置"}
        </div>
        <div>
          <strong>语气：</strong>
          {data.input.instruct || "未设置"}
        </div>
      </div> */}

      {/* {data.output && data.output.speech_list && (
        <div className="node-result">
          <div className="audio-list">
            {data.output.speech_list.slice(0, 3).map((url, index) => (
              <div key={index} className="audio-item">
                <AudioUploadCard
                  className="mini"
                  url={url}
                  value={null}
                  downloadMode={true}
                  placeholder={`克隆音频 ${index + 1}`}
                />
              </div>
            ))}
            {data.output.speech_list.length > 3 && (
              <span className="more-indicator">...</span>
            )}
          </div>
        </div>
      )} */}

      <Handle
        type="source"
        position={Position.Bottom}
        className="node-handle"
      />
    </div>
  );
};

export default CloneNode;
