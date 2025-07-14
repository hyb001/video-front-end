import React from "react";
import { Handle, Position } from "reactflow";
import { Tooltip } from "antd";
import {
  CheckCircleFilled,
  LoadingOutlined,
  ExclamationCircleFilled,
  PlayCircleOutlined,
} from "@ant-design/icons";

interface SearchNodeProps {
  data: {
    label: string;
    inputs: {
      script_content: string[];
    };
    outputs: {
      video_clips: string[];
    };
    status: "idle" | "running" | "completed" | "error";
  };
  selected: boolean;
  outerRef?: React.Ref<HTMLDivElement>;
}

const SearchNode: React.FC<SearchNodeProps> = ({
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
          <strong>脚本内容：</strong>
          {data.input.script_content ? "已设置" : "未设置"}
        </div>
        <div>
          <strong>素材数量：</strong>
          {data.output.video_clips ? data.output.video_clips.length : 0}
        </div>
      </div> */}

      {data.outputs && (
        <div className="node-info">
          <div>
            <strong>场景视频：</strong>
            {Array.isArray(data.outputs.video_clips)
              ? data.outputs.video_clips.length
              : 0}
            个
          </div>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="node-handle"
      />
    </div>
  );
};

export default SearchNode;
