import ReactFlow, { Controls } from "reactflow";
import { Button, Select } from "antd";

const WorkflowPanel = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  nodeTypes,
  executeWorkflow,
}: any) => (
  <div className="workflow-panel">
    <div className="workflow-header">
      <div className="workflow-header-title">工作流</div>
      <div className="workflow-header-actions">
        <Select
          className="workflow-header-history-select"
          defaultValue="运行历史数据 0"
          bordered={false}
          options={[{ value: "运行历史数据 0", label: "运行历史数据 0" }]}
          suffixIcon={
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M3 4L5 6L7 4"
                stroke="#333333"
                strokeOpacity="0.4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <Button
          type="primary"
          className="workflow-header-run-btn"
          onClick={executeWorkflow}
          icon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <g clipPath="url(#clip0_1736_2287)">
                <circle cx="7" cy="7" r="7" fill="#1433FE" />
                <path
                  d="M5 9.27682V4.72318C5 3.95536 5.82948 3.47399 6.49614 3.85494L10.4806 6.13176C11.1524 6.51565 11.1524 7.48435 10.4806 7.86824L6.49614 10.1451C5.82948 10.526 5 10.0446 5 9.27682Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_1736_2287">
                  <rect width="14" height="14" fill="white" />
                </clipPath>
              </defs>
            </svg>
          }
        >
          <span>运行</span>
        </Button>
      </div>
    </div>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      fitView
    >
      <Controls />
    </ReactFlow>
  </div>
);

export default WorkflowPanel;