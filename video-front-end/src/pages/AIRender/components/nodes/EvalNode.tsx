import React from "react";
import { Handle, Position } from "reactflow";
import { Tooltip } from "antd";
import {
  CheckCircleFilled,
  LoadingOutlined,
  ExclamationCircleFilled,
  PlayCircleOutlined,
} from "@ant-design/icons";

interface EvalNodeProps {
  data: {
    label: string;
    inputs: {
      final_video: string;
    };
    outputs: {
      eval_result: string;
    };
    status: "idle" | "running" | "completed" | "error";
  };
  selected: boolean;
  outerRef?: React.Ref<HTMLDivElement>;
}

const EvalNode: React.FC<EvalNodeProps> = ({ data, selected, outerRef }) => {
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
            <strong>评估结果：</strong>
            {data.outputs?.eval_result ? 1 : 0}个
          </div>
        </div>
      )}

      {/* <div className="node-info">
        <div>
          <strong>评估视频：</strong>
          {data.input && data.input.video ? "已设置" : "未设置"}
        </div>
        <div>
          <strong>评估结果：</strong>
          {data.output && data.output.eval_result ? "已生成" : "未生成"}
        </div>
      </div>

      {data.output && data.output.eval_result && (
        <div className="node-result">
          <span>评估报告已生成</span>
          <Tooltip title="查看评估报告">
            <Button
              type="text"
              size="small"
              icon={<FileTextOutlined />}
              className="node-action-btn"
            />
          </Tooltip>
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

export default EvalNode;
