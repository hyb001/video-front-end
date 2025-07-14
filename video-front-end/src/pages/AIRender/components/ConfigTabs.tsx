import { Tabs, Form, Input, Select } from "antd";
import WorkflowForm from "./WorkflowForm";
import AudioUploadCard from "@/components/AudioUploadCard";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import fullscreen from "@/assets/images/icons/fullscreen.png";

const { TabPane } = Tabs;

const ConfigTabs = ({
  form,
  activeTab,
  setActiveTab,
  selectedNode,
  nodes,
  globalsWorkflowData,
  setGlobalsWorkflowData,
  handleGlobalSettingsSubmit,
  handleWorkflowFormSubmit,
  bgmFile,
  setBgmFile,
  bgmUrl,
  setBgmUrl,
  cloneFile,
  setCloneFile,
  cloneUrl,
  setCloneUrl,
  outputVideo,
  videoRef,
  currentTime,
  setCurrentTime,
  duration,
  setDuration,
  isPlaying,
  setIsPlaying,
  formatTime,
  togglePlay,
  toggleFullScreen,
  handleTimeUpdate,
  handleLoadedMetadata,
}: any) => (
  <div className="config-panel">
    <Tabs activeKey={activeTab} onChange={setActiveTab}>
      <TabPane tab="工作流设置" key="settings">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleGlobalSettingsSubmit}
          initialValues={globalsWorkflowData}
          onValuesChange={(_, allValues) => setGlobalsWorkflowData(allValues)}
          className="settings-form"
        >
          <div className="audio-upload-row">
            <Form.Item
              label="背景音乐"
              name="music_audio"
              tooltip="用于视频的背景音乐，在合成视频节点使用"
              rules={[{ required: true, message: "请上传背景音乐" }]}
            >
              <AudioUploadCard
                audioType="music"
                value={bgmFile}
                url={bgmUrl}
                onChange={(file: any, url: string) => {
                  setBgmFile(file);
                  setBgmUrl(url);
                  setGlobalsWorkflowData((prev: any) => ({
                    ...prev,
                    music_audio: url,
                    music_audio_file: file,
                  }));
                }}
                placeholder="点击上传背景音乐"
              />
            </Form.Item>
            <Form.Item
              label="语音克隆"
              name="prompt_audio"
              tooltip="用于克隆语音的输入对象语音文件，在语音合成节点使用"
              rules={[{ required: true, message: "请上传语音克隆音频" }]}
            >
              <AudioUploadCard
                value={cloneFile}
                url={cloneUrl}
                onChange={(file: any, url: string) => {
                  setCloneFile(file);
                  setCloneUrl(url);
                  setGlobalsWorkflowData((prev: any) => ({
                    ...prev,
                    prompt_audio: url,
                    prompt_audio_file: file,
                  }));
                }}
                placeholder="点击上传一段音频"
              />
            </Form.Item>
          </div>
          <div className="form-item-container">
            <Form.Item
              label="素材库"
              name="library_id"
              rules={[{ required: true, message: "请输入素材关键词" }]}
            >
              <Select
                options={[{ value: "default", label: "默认素材库" }]}
                placeholder="请选择素材库"
                defaultValue="default"
                style={{ width: "100%", background: "#F5F5F5" }}
              />
            </Form.Item>
            <Form.Item
              label="脚本上下文"
              name="context"
              tooltip="用于脚本生成时，为大模型提供背景知识和资料"
              rules={[{ required: true, message: "请输入脚本上下文" }]}
            >
              <Input.TextArea
                autoSize={{ minRows: 5, maxRows: 5 }}
                placeholder="请输入"
              />
            </Form.Item>
            <Form.Item
              label="制作的目标"
              name="goal"
              tooltip="用于脚本生成时，设定视频制作目标"
              rules={[{ required: true, message: "请输入制作的目标" }]}
            >
              <Input.TextArea
                autoSize={{ minRows: 2, maxRows: 2 }}
                placeholder="请输入"
              />
            </Form.Item>
            <Form.Item
              label="参考脚本"
              name="sample_script"
              tooltip="用于脚本生成时，给大模型提供的参考脚本示例"
            >
              <Input.TextArea
                placeholder="请输入"
                autoSize={{ minRows: 5, maxRows: 5 }}
                showCount
                maxLength={2000}
              />
            </Form.Item>
          </div>
        </Form>
      </TabPane>
      {selectedNode &&
        selectedNode.type !== "startNode" &&
        selectedNode.type !== "endNode" && (
          <TabPane tab={selectedNode.data.label} key={selectedNode.id}>
            <WorkflowForm
              node={selectedNode}
              nodes={nodes}
              globalsWorkflowData={globalsWorkflowData}
              onSubmit={handleWorkflowFormSubmit}
              key={`form-${selectedNode.id}-${JSON.stringify(
                selectedNode.data
              )}`}
            />
          </TabPane>
        )}
      {nodes.find(
        (n: any) => n.id === "synthesis" && n.data?.status === "completed"
      ) && (
        <TabPane tab="视频" key="output">
          {outputVideo ? (
            <div className="output-video">
              <div
                style={{
                  width: "100%",
                  flex: 1,
                  background: "#fff",
                  borderRadius: 8,
                  overflow: "hidden",
                  boxSizing: "border-box",
                  justifyItems: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "85%",
                    background: "#000",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <video
                    ref={videoRef}
                    src={outputVideo}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                    }}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                  />
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  boxSizing: "border-box",
                  height: 48,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: "#333",
                    marginTop: "10px",
                    minWidth: 80,
                    flex: 1,
                  }}
                >
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <button
                    style={{
                      border: "none",
                      background: "none",
                      fontSize: 28,
                      cursor: "pointer",
                    }}
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <PauseCircleOutlined />
                    ) : (
                      <PlayCircleOutlined />
                    )}
                  </button>
                </div>
                <div style={{ flex: 1, textAlign: "right" }}>
                  <button
                    style={{
                      border: "none",
                      background: "none",
                      fontSize: 20,
                      cursor: "pointer",
                    }}
                    onClick={toggleFullScreen}
                  >
                    <img
                      src={fullscreen}
                      alt="fullscreen"
                      style={{
                        width: 24,
                        height: 24,
                        display: "inline-block",
                        verticalAlign: "middle",
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-output">
              <p>请先在时间线中添加视频片段并生成视频</p>
            </div>
          )}
        </TabPane>
      )}
    </Tabs>
  </div>
);

export default ConfigTabs;
