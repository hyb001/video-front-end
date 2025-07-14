import React from "react";
import { Handle, Position } from "reactflow";

interface StartNodeProps {
  data: {
    label: string;
    output: {
      background_music: string;
      clone_speech_source: string;
      generate_num: number;
    };
  };
  outerRef?: React.Ref<HTMLDivElement>;
}

const StartNode: React.FC<StartNodeProps> = ({ data, outerRef }) => {
  return (
    <div ref={outerRef} className="workflow-node start-node">
      <div className="node-header">
        {" "}
        <div className="node-title">{data.label}</div>
      </div>
      <div className="node-content">
        <div className="node-output">
          <span className="text1">
            AI自动生成脚本，并根据脚本的场景设计去素材库和互联网搜索相关素材，并自动剪辑成片。
          </span>
          {/* <div className="output-item">
            <span className="output-label">背景音乐:</span>
            <span className="output-value">{data.output.background_music || '未设置'}</span>
          </div>
          <div className="output-item">
            <span className="output-label">语音克隆源:</span>
            <span className="output-value">{data.output.clone_speech_source || '未设置'}</span>
          </div>
          <div className="output-item">
            <span className="output-label">生成数量:</span>
            <span className="output-value">{data.output.generate_num}</span>
          </div> */}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
};

export default StartNode;
