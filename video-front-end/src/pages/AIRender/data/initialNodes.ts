import { Node, Edge, MarkerType } from "reactflow";
export const initialNodes: Node[] = [
  {
    id: "start",
    type: "startNode",
    data: {
      label: "混剪工作流开始",
      inputs: null,
      outputs: null,
      status: "idle",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "script",
    type: "scriptNode",
    data: {
      label: "脚本生成",
      inputs: null,
      outputs: null,
      status: "idle",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "clone",
    type: "cloneNode",
    data: {
      label: "语音克隆",
      inputs: null,
      outputs: null,
      status: "idle",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "search",
    type: "searchNode",
    data: {
      label: "素材搜索",
      inputs: null,
      outputs: null,
      status: "idle",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "synthesis",
    type: "synthesisNode",
    data: {
      label: "自动合成",
      inputs: null,
      outputs: null,
      status: "idle",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "eval",
    type: "evalNode",
    data: {
      label: "视频评估",
      inputs: null,
      outputs: null,
      status: "idle",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "end",
    type: "endNode",
    data: {
      label: "结束",
      inputs: null,
      outputs: null,
      status: "idle",
    },
    position: { x: 0, y: 0 },
  },
];

export const initialEdges: Edge[] = [
  {
    id: "e0-1",
    source: "start",
    target: "script",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    animated: true,
  },
  {
    id: "e1-2",
    source: "script",
    target: "clone",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    animated: true,
  },
  {
    id: "e2-3",
    source: "clone",
    target: "search",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    animated: true,
  },
  {
    id: "e3-4",
    source: "search",
    target: "synthesis",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    animated: true,
  },
  {
    id: "e4-5",
    source: "synthesis",
    target: "eval",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    animated: true,
  },
  {
    id: "e5-6",
    source: "eval",
    target: "end",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    animated: true,
  },
];
