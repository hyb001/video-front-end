import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import { message } from "antd";

import "./index.less";
import TimelineEditor from "./components/TimelineEditor";

// 导入节点组件
import StartNode from "./components/nodes/StartNode";
import ScriptNode from "./components/nodes/ScriptNode";
import CloneNode from "./components/nodes/CloneNode";
import SearchNode from "./components/nodes/SearchNode";
import SynthesisNode from "./components/nodes/SynthesisNode";
import EvalNode from "./components/nodes/EvalNode";
import EndNode from "./components/nodes/EndNode";

import HeaderBar from "./components/HeaderBar";
import WorkflowPanel from "./components/WorkflowPanel";
import ConfigTabs from "./components/ConfigTabs";

import dagre from "dagre"; // 管理节点布局

import { responses } from "./data/responses"; // 导入响应数据
import { initialNodes, initialEdges } from "./data/initialNodes"; //初始节点
import { tracksData } from "./data/tracks"; // 初始轨道

import { Form } from "antd";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 300; // 节点宽度
const nodeHeight = 120; // 节点高度

const AIRender: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  // 用于触发布局的版本号
  const [layoutVersion, setLayoutVersion] = useState(0);
  // 用于存储每个节点的高度
  const [nodeHeights, setNodeHeights] = useState<{ [id: string]: number }>({});
  // 渲染每个节点时，给节点包一层 div，ref 回调收集高度
  const nodeRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});
  // 节点类型映射，使用 useMemo 缓存，避免每次渲染都新建对象
  const nodeTypes = React.useMemo(
    () => ({
      startNode: (props: NodeProps) => (
        <StartNode
          {...props}
          outerRef={(el) => {
            nodeRefs.current[props.id] = el;
          }}
        />
      ),
      scriptNode: (props: NodeProps) => (
        <ScriptNode
          {...props}
          outerRef={(el) => {
            nodeRefs.current[props.id] = el;
          }}
        />
      ),
      cloneNode: (props: NodeProps) => (
        <CloneNode
          {...props}
          outerRef={(el) => {
            nodeRefs.current[props.id] = el;
          }}
        />
      ),
      searchNode: (props: NodeProps) => (
        <SearchNode
          {...props}
          outerRef={(el) => {
            nodeRefs.current[props.id] = el;
          }}
        />
      ),
      synthesisNode: (props: NodeProps) => (
        <SynthesisNode
          {...props}
          outerRef={(el) => {
            nodeRefs.current[props.id] = el;
          }}
        />
      ),
      evalNode: (props: NodeProps) => (
        <EvalNode
          {...props}
          outerRef={(el) => {
            nodeRefs.current[props.id] = el;
          }}
        />
      ),
      endNode: (props: NodeProps) => (
        <EndNode
          {...props}
          outerRef={(el) => {
            nodeRefs.current[props.id] = el;
          }}
        />
      ),
    }),
    []
  );

  // 工作流设置表单
  interface GlobalsWorkflowData {
    music_audio: string;
    prompt_audio: string;
    library_id: string;
    context: string;
    goal: string;
    sample_script: string;
    music_audio_file: File | null;
    prompt_audio_file: File | null;
  }

  const [globalsWorkflowData, setGlobalsWorkflowData] =
    useState<GlobalsWorkflowData>({
      music_audio: "",
      prompt_audio: "",
      library_id: "默认素材库",
      context:
        "这些是三星Galaxy Buds 3 Pro，并且我这里有25个提示和小技巧可以让你变成一个真正的Pro，从一些手势开始。 所以耳塞的这个部分叫做手柄，基本上每个手柄上都有一个小按钮，你可以用它来做手势",
      goal: "为三星三星Galaxy Buds 3 Pro 蓝牙耳机制作一个推广短视频，目标是年轻女性群体",
      sample_script: "",
      music_audio_file: null,
      prompt_audio_file: null,
    });

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [activeTab, setActiveTab] = useState("settings");
  const [form] = Form.useForm();

  // 视频编辑相关状态
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [tracks, setTracks] = useState(tracksData);
  const [outputVideo] = useState(
    "https://ttt0001234.oss-cn-shenzhen.aliyuncs.com/common/videos/out.mp4"
  );

  // 背景音乐
  const [bgmFile, setBgmFile] = useState<File | null>(null);
  const [bgmUrl, setBgmUrl] = useState<string>("");

  useEffect(() => {
    if (globalsWorkflowData.music_audio_file !== null) {
      setTracks((prevTracks) => {
        const newTracks = prevTracks.slice();

        if (newTracks[0]) {
          newTracks[0] = {
            ...newTracks[0],
            color: "rgb(242,215,254)",
            clips:
              "https://ttt0001234.oss-cn-shenzhen.aliyuncs.com/common/audios/music.mp3",
          };
        }
        return newTracks;
      });
    }
  }, [globalsWorkflowData]);

  // 克隆人声
  const [cloneFile, setCloneFile] = useState<File | null>(null);
  const [cloneUrl, setCloneUrl] = useState<string>("");

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };
  function getLayoutedNodes(
    nodes: Node[],
    edges: Edge[],
    heights: { [id: string]: number }
  ) {
    dagreGraph.setGraph({ rankdir: "TB" });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, {
        width: nodeWidth,
        height: heights[node.id] || nodeHeight,
      });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - (heights[node.id] || nodeHeight) / 2,
        },
      };
    });
  }
  useEffect(() => {
    const heights: { [id: string]: number } = {};
    Object.keys(nodeRefs.current).forEach((id) => {
      const el = nodeRefs.current[id];
      if (el) {
        heights[id] = el.offsetHeight;
      }
    });
    const isChanged =
      Object.keys(heights).length !== Object.keys(nodeHeights).length ||
      Object.keys(heights).some((id) => heights[id] !== nodeHeights[id]);
    if (isChanged) {
      setNodeHeights(heights);
    }
  }, [nodes, nodeHeights]);

  // 在自动布局时传入 nodeHeights
  useEffect(() => {
    const layouted = getLayoutedNodes(nodes, edges, nodeHeights);
    setNodes(layouted);
  }, [layoutVersion, nodeHeights]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `00:${m}:${s}`;
  };

  // 处理节点点击
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);

    // 如果是视频合成节点且有输出，切到视频tab，否则切到该节点tab
    if (node.type === "synthesisNode" && node.data.output?.out_video) {
      // setVideoUrl(node.data.output.out_video);
      setActiveTab("editor");
    } else {
      setActiveTab(node.id);
    }
  }, []);

  // 处理连线
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  // 只要节点数据变化（比如output变化），就递增layoutVersion
  const updateNodeData = useCallback(
    (nodeId: string, data: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            // 如果data包含inputs/outputs，自动映射到input/output
            const newData = {
              ...node.data,
              ...data,
              ...(data.inputs !== undefined ? { inputs: data.inputs } : {}),
              ...(data.outputs !== undefined ? { outputs: data.outputs } : {}),
            };
            return {
              ...node,
              data: newData,
            };
          }
          return node;
        })
      );
      setLayoutVersion((v) => v + 1);
    },
    [setNodes]
  );

  // 执行节点
  const executeNode = useCallback(
    (nodeId: string) => {
      updateNodeData(nodeId, { status: "running" });

      setTimeout(() => {
        if (nodeId === "script") {
        } else if (nodeId === "clone") {
          // 语音克隆节点
          updateNodeData(nodeId, {
            output: {
              speech_list: [
                "http://xx.com/234.wav",
                "http://xx.com/235.wav",
                "http://xx.com/236.wav",
              ],
            },
            status: "completed",
          });
        } else if (nodeId === "search") {
          // 素材搜索节点
          updateNodeData(nodeId, {
            output: {
              video_clips: [
                "http://xx.com/234.mp4",
                "http://xx.com/235.mp4",
                "http://xx.com/236.mp4",
              ],
            },
            status: "completed",
          });
        } else if (nodeId === "synthesis") {
          // 视频合成节点
          updateNodeData(nodeId, {
            output: {
              out_video: "http://134234.com/2234.mp4",
            },
            status: "completed",
          });
          // setVideoUrl("http://134234.com/2234.mp4");
        } else if (nodeId === "eval") {
          // 视频评估节点
          updateNodeData(nodeId, {
            output: {
              eval_result: "视频评估结果：画面清晰，内容丰富，节奏流畅。",
            },
            status: "completed",
          });
        } else if (nodeId === "end") {
          // 结束节点
          updateNodeData(nodeId, {
            output: {
              out_video: "http://134234.com/2234.mp4",
              eval_result: "视频评估结果：画面清晰，内容丰富，节奏流畅。",
            },
            status: "completed",
          });
        }
      }, 2000);
    },
    [updateNodeData]
  );

  // 处理全局设置表单提交
  const handleGlobalSettingsSubmit = (values: any) => {
    console.log("表单提交成功:", values);
    // setMusicAudio(values.music_audio);
    // setCloneAudio(values.clone_audio);
    // setLibraryId(values.library_id);

    // // 更新全局参数到所有相关节点
    // updateNodeData("script", {
    //   input: {
    //     ...nodes.find((n) => n.id === "script")?.data.input,
    //     context: values.library_id,
    //   },
    // });
    // updateNodeData("clone", {
    //   input: {
    //     ...nodes.find((n) => n.id === "clone")?.data.input,
    //     prompt_audio: values.clone_audio,
    //   },
    // });
    // updateNodeData("synthesis", {
    //   input: {
    //     ...nodes.find((n) => n.id === "synthesis")?.data.input,
    //     music_audio: values.music_audio,
    //   },
    // });

    // message.success("全局设置已保存");
  };

  // 处理工作流表单提交
  const handleWorkflowFormSubmit = (values: any) => {
    if (selectedNode) {
      // 更新节点输入数据，确保创建新的引用
      updateNodeData(selectedNode.id, {
        input: { ...values },
      });
      executeNode(selectedNode.id);
    }
  };

  // 执行整个工作流
  const executeWorkflow = () => {
    form
      .validateFields()
      .then(() => {
        const nodeIds = [
          "script",
          "clone",
          "search",
          "synthesis",
          "eval",
          "end",
        ];
        let currentIndex = 0;

        const runNextNode = () => {
          if (currentIndex < nodeIds.length) {
            const nodeId = nodeIds[currentIndex];
            // 先置为 running
            updateNodeData(nodeId, { status: "running" });

            // 随机20秒
            const delay = 20000;

            setTimeout(() => {
              // 取对应 response
              const resp = responses[currentIndex + 2]; // response是初始，response2对应第一个节点
              // console.log(`Executing ${nodeId} with response:`, resp);
              if (resp) {
                // 获取节点对应的key
                const nodeKeyMap: Record<string, string> = {
                  script: "generate_script",
                  clone: "tts",
                  search: "video_rag",
                  synthesis: "auto_clip",
                  eval: "eval_video",
                  end: "eval_video", //
                };
                const nodeKey = nodeKeyMap[nodeId];
                const nodeRaw =
                  (resp.nodes as Record<string, any>)[nodeKey] || {};
                const nodeContent = {
                  inputs: nodeRaw.inputs ?? null,
                  outputs: nodeRaw.outputs ?? null,
                  status: "completed",
                };
                // 只传递该节点内容
                updateNodeData(nodeId, nodeContent);
                if (nodeKey === "generate_script") {
                  console.log("resp.globals.scenes:", resp.globals.scenes);
                  // 生成场景内容
                  setTracks((prevTracks) => {
                    const newTracks = prevTracks.slice();

                    if (newTracks[1]) {
                      newTracks[1] = {
                        ...newTracks[1],
                        color: "rgb(214,214,214)",
                        clips: resp.globals.scenes,
                      };
                    }

                    if (newTracks[2]) {
                      newTracks[2] = {
                        ...newTracks[2],
                        color: "rgb(208,214,255)",
                        clips: resp.globals.speech_text_list,
                      };
                    }

                    return newTracks;
                  });
                } else if (nodeKey === "tts") {
                  // 生成语音文案
                  setTracks((prevTracks) => {
                    const newTracks = prevTracks.slice();

                    if (newTracks[3]) {
                      newTracks[3] = {
                        ...newTracks[3],
                        color: "rgb(207,247,236)",
                        clips: resp.globals.speech_audio_list,
                      };
                    }

                    return newTracks;
                  });
                } else if (nodeKey === "video_rag") {
                  // 生成语音文案
                  setTracks((prevTracks) => {
                    const newTracks = prevTracks.slice();

                    if (newTracks[4]) {
                      newTracks[4] = {
                        ...newTracks[4],
                        color: "rgb(254,248,244)",
                        clips: resp.globals.video_clips.video_clips,
                      };
                    }

                    return newTracks;
                  });
                }

                // 继续下一个节点
                currentIndex++;
                runNextNode();
              } else if (nodeId === "end") {
                // 没有response时，end节点也要设置为completed
                updateNodeData(nodeId, { status: "completed" });
              }
            }, delay);
          }
        };
        runNextNode();
      })
      .catch((errorInfo) => {
        // 校验失败，处理错误
        message.error("表单校验未通过，请检查必填项");
        console.error("表单校验失败:", errorInfo);
      });
  };

  return (
    <div className="ai-render-container">
      <HeaderBar />
      <div className="main-content">
        <div className="left-panel">
          <WorkflowPanel
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            executeWorkflow={executeWorkflow}
          />
        </div>

        <div className="right-panel">
          <ConfigTabs
            form={form}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedNode={selectedNode}
            nodes={nodes}
            globalsWorkflowData={globalsWorkflowData}
            setGlobalsWorkflowData={setGlobalsWorkflowData}
            handleGlobalSettingsSubmit={handleGlobalSettingsSubmit}
            handleWorkflowFormSubmit={handleWorkflowFormSubmit}
            bgmFile={bgmFile}
            setBgmFile={setBgmFile}
            bgmUrl={bgmUrl}
            setBgmUrl={setBgmUrl}
            cloneFile={cloneFile}
            setCloneFile={setCloneFile}
            cloneUrl={cloneUrl}
            setCloneUrl={setCloneUrl}
            outputVideo={outputVideo}
            videoRef={videoRef}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            duration={duration}
            setDuration={setDuration}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            formatTime={formatTime}
            togglePlay={togglePlay}
            toggleFullScreen={toggleFullScreen}
            handleTimeUpdate={handleTimeUpdate}
            handleLoadedMetadata={handleLoadedMetadata}
          />
        </div>
      </div>

      <div className="timeline-panel">
        <TimelineEditor
          tracks={tracks}
          globalsWorkflowData={globalsWorkflowData}
        />
      </div>
    </div>
  );
};

export default AIRender;
