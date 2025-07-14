import React from "react";
import { Handle, Position } from "reactflow";
import { Button, Tooltip } from "antd";
import {
  CheckCircleFilled,
  LoadingOutlined,
  ExclamationCircleFilled,
  PlayCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

interface EndNodeProps {
  data: {
    label: string;
    input: any;
    output: {
      out_video: string;
      eval_result: string;
    };
    status: "idle" | "running" | "completed" | "error";
  };
  selected: boolean;
  outerRef?: React.Ref<HTMLDivElement>;
}

const EndNode: React.FC<EndNodeProps> = ({ data, selected, outerRef }) => {
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
          <strong>最终视频：</strong>
          {data.output && data.output.out_video ? "已生成" : "未生成"}
        </div>
        <div>
          <strong>评估报告：</strong>
          {data.output && data.output.eval_result ? "已生成" : "未生成"}
        </div>
      </div> */}

      {data.output && data.output.out_video && (
        <div className="node-result">
          <span>工作流已完成</span>
          <Tooltip title="下载结果">
            <Button
              type="text"
              size="small"
              icon={<DownloadOutlined />}
              className="node-action-btn"
            />
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default EndNode;
