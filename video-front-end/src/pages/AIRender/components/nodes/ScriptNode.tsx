import React from "react";
import { Handle, Position } from "reactflow";
import { Tooltip } from "antd";
import {
  CheckCircleFilled,
  LoadingOutlined,
  ExclamationCircleFilled,
  PlayCircleOutlined,
} from "@ant-design/icons";

interface ScriptNodeProps {
  data: {
    label: string;
    inputs: {
      context: string;
      goal: string;
      sample_script: string;
    };
    outputs: {
      script_content: string;
      script_dict: any;
      speech_text_list: string[];
      scenes: any[];
    };
    status: "idle" | "running" | "completed" | "error";
  };
  selected: boolean;
  outerRef?: React.Ref<HTMLDivElement>;
}

const ScriptNode: React.FC<ScriptNodeProps> = ({
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

      <div className="node-info">
        {/* <div>
          <strong>输入：</strong>
          {data.input.context ? "已设置" : "未设置"}
        </div>
        <div>
          <strong>输出：</strong>
          {data.output.script_content ? "已生成" : "未生成"}
        </div> */}
      </div>

      {data.outputs && (
        <div className="node-info">
          <div>
            <strong>脚本内容：</strong>
            {data.outputs.script_content ? 1 : 0}个
          </div>
          <div>
            <strong>场景台词：</strong>
            {Array.isArray(data.outputs.speech_text_list)
              ? data.outputs.speech_text_list.length
              : 0}
            个
          </div>
          <div>
            <strong>场景内容：</strong>
            {Array.isArray(data.outputs.scenes)
              ? data.outputs.scenes.length
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

export default ScriptNode;
