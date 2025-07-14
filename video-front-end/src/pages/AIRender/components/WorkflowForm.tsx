import React, { useEffect } from "react";
import { Row, Col, Form, Input, Space, Radio } from "antd";
import { Node } from "reactflow";
import AudioUploadCard from "@/components/AudioUploadCard";

interface WorkflowFormProps {
  node: Node;
  nodes: Node[];
  onSubmit: (values: any) => void;
  globalsWorkflowData: any;
}

type ScriptScene = {
  id?: number;
  scene_script?: string;
  speech_text?: string;
};

const WorkflowForm: React.FC<WorkflowFormProps> = ({
  node,
  nodes,
  onSubmit,
  globalsWorkflowData,
}) => {
  const [form] = Form.useForm();

  // 直接使用node.data.output，不再使用useState
  const outputData = node.data.outputs || {};

  // 当节点变化时重置表单
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(node.data.inputs || {});
  }, [node, form]);

  // 查找脚本节点的输出
  const findScriptNodeOutput = () => {
    // 从全局 nodes 查找脚本节点
    const scriptNode = nodes.find((n: any) => n.type === "scriptNode");
    if (!scriptNode || !scriptNode.data || !scriptNode.data.outputs) {
      return [];
    }

    // 优先返回已解析的场景数据
    if (scriptNode.data.outputs.script_dict?.scenes) {
      return scriptNode.data.outputs.script_dict.scenes;
    }

    // 如果没有解析好的场景，尝试从 script_content 解析
    const scriptContent = scriptNode.data.outputs.script_content;
    if (scriptContent) {
      const scenes = [];
      // 支持 "# 场景X" 或 "场景X:" 这两种格式
      const sceneRegex =
        /[#\s]*场景\s*(\d+)[\s:：]*([\s\S]*?)(?=(?:[#\s]*场景\s*\d+[\s:：])|$)/g;
      let match;
      while ((match = sceneRegex.exec(scriptContent)) !== null) {
        scenes.push({
          id: parseInt(match[1]),
          content: match[2].trim(),
        });
      }
      // 如果没有找到场景，则将整个脚本作为一个场景
      if (scenes.length === 0 && scriptContent.trim()) {
        scenes.push({
          id: 1,
          content: scriptContent.trim(),
        });
      }
      return scenes;
    }

    return [];
  };

  const renderMaterialSearchOutput = (materialList: string[]) => {
    return (
      <div className="material-video-grid">
        {materialList && materialList.length > 0 ? (
          materialList.map((url: string, idx: number) => (
            <div key={idx} className="material-video-item">
              <video src={url} controls />
              <div className="material-video-title">{`视频${idx + 1}`}</div>
            </div>
          ))
        ) : (
          <div className="no-material-message">暂无素材</div>
        )}
      </div>
    );
  };

  const renderVideoSynthesisInput = () => {
    const nodeInput = node.data.inputs || {};

    // 获取素材列表
    const materialList = nodeInput?.video_clips?.video_clips || [];
    // 获取语音列表
    const speechList = nodeInput?.speech_audio_list || [];

    return (
      <div className="video-synthesis-input">
        {/* 背景音乐部分 */}
        <div className="input-section">
          <div className="subtitle">背景音乐</div>
          <Form.Item
            name="music_audio"
            initialValue={globalsWorkflowData?.music_audio_file}
          >
            <AudioUploadCard
              audioType="music"
              value={globalsWorkflowData?.music_audio_file}
              url={globalsWorkflowData?.music_audio}
              placeholder="点击上传一段音频"
            />
          </Form.Item>
        </div>

        {/* 语音列表部分 */}
        <div className="input-section">
          <div className="subtitle">语音列表</div>
          <div className="speech-list-container">
            {speechList && speechList.length > 0 ? (
              <div className="output-item">
                <div className="output-value">
                  <div className="audio-list">
                    {speechList.map((url: string, index: number) => (
                      <div key={index} className="audio-item">
                        <AudioUploadCard
                          url={url}
                          value={null}
                          downloadMode={true}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-clone-result">暂无克隆结果</div>
            )}
          </div>
        </div>

        {/* 视频素材列表 */}
        <div>
          <div className="subtitle">视频列表</div>
          <div className="video-list-container">
            {renderMaterialSearchOutput(materialList)}
          </div>
        </div>
      </div>
    );
  };

  const renderVideoEvaluationForm = () => {
    const videoUrl = node.data.inputs ? node.data.inputs.final_video : null;

    return (
      <Row gutter={24}>
        {/* 左侧：视频合成 */}
        <Col span={12}>
          <div className="section-title">视频合成</div>
          <div className="video-container">
            {videoUrl ? (
              <div className="video-wrapper">
                <div className="video-content">
                  <video src={videoUrl} controls />
                </div>
              </div>
            ) : (
              <div className="no-video-message">暂无视频</div>
            )}
          </div>
        </Col>

        {/* 右侧：视频评估 */}
        <Col span={12}>
          <div className="section-title">视频评估</div>
          <div className="evaluation-container">
            {outputData.eval_result ? (
              <div>
                <div className="eval-result">
                  <div className="eval-title">评估结果</div>
                  <div className="eval-content">{outputData.eval_result}</div>
                </div>
              </div>
            ) : (
              <div className="no-eval-message">
                暂无评估结果，请点击执行按钮进行评估
              </div>
            )}
          </div>
        </Col>
      </Row>
    );
  };

  const renderFormItems = () => {
    const nodeType = node.type;
    const nodeInput = node.data.inputs || {};

    if (node.type === "scriptNode") {
      return (
        <Row gutter={24}>
          <Col span={12}>
            <div className="section-title">脚本生成输入</div>
          </Col>
          <Col span={12}>
            <div className="section-title text-left">脚本生成输出</div>
          </Col>
          <Col span={12}>
            <Form
              form={form}
              layout="vertical"
              initialValues={nodeInput}
              onFinish={onSubmit}
            >
              <Form.Item label="背景上下文" name="context">
                <Input.TextArea
                  autoSize={{ minRows: 5, maxRows: 8 }}
                  placeholder="请输入"
                />
              </Form.Item>
              <Form.Item label="制作的目标" name="goal">
                <Input.TextArea
                  autoSize={{ minRows: 5, maxRows: 8 }}
                  placeholder="请输入"
                />
              </Form.Item>
              <Form.Item label="参考示例" name="example">
                <Input.TextArea
                  autoSize={{ minRows: 5, maxRows: 8 }}
                  placeholder="请输入"
                />
              </Form.Item>
            </Form>
          </Col>
          <Col span={12}>
            <div className="script-output-area">
              {/* 脚本内容 */}
              <div className="script-block">
                <span>脚本内容</span>
                <pre className="script-content">
                  {outputData.script_content || "请填写左侧内容并生成脚本"}
                </pre>
              </div>
              {/* 场景台词 */}
              <div className="script-block">
                <span>场景台词</span>
                <div className="script-lines">
                  {outputData.speech_text_list &&
                  outputData.speech_text_list.length > 0
                    ? outputData.speech_text_list.map(
                        (text: string, idx: number) => (
                          <div key={idx} className="script-line-item">
                            {text}
                          </div>
                        )
                      )
                    : "暂无台词"}
                </div>
              </div>
              {/* 场景内容 */}
              <div className="script-block">
                <span>场景内容</span>
                <div className="script-scenes">
                  {outputData.scenes && outputData.scenes.length > 0
                    ? outputData.scenes.map(
                        (
                          scene: {
                            scene: string;
                            scene_title: string;
                            scene_time: string;
                            scene_content: string;
                          },
                          idx: number
                        ) => (
                          <div key={idx} className="script-scene-item">
                            <div className="scene-title">
                              {scene.scene}：{scene.scene_title}（
                              {scene.scene_time}）
                            </div>
                            <div className="scene-content">
                              {scene.scene_content}
                            </div>
                          </div>
                        )
                      )
                    : "暂无场景内容"}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      );
    } else if (nodeType === "synthesisNode") {
      return (
        <Row gutter={24}>
          {/* 左侧：视频合成输入 */}
          <Col span={16}>
            <div className="section-title">视频合成输入</div>
            {renderVideoSynthesisInput()}
          </Col>

          {/* 右侧：视频合成输出 */}
          <Col span={8}>
            <div className="section-title">视频合成输出</div>
            <div className="video-container taller">
              {outputData.out_video ? (
                <div className="video-wrapper with-padding">
                  <div className="video-content">
                    <video
                      src={outputData.out_video}
                      controls
                      className="full-height"
                    />
                  </div>
                </div>
              ) : (
                <div className="no-video-message">暂无合成视频</div>
              )}
            </div>
          </Col>
        </Row>
      );
    } else if (nodeType === "cloneNode") {
      useEffect(() => {
        if (nodeType === "cloneNode") {
          if (!nodeInput.text_list || nodeInput.text_list.length === 0) {
            const scenes = findScriptNodeOutput() as ScriptScene[];
            if (scenes.length > 0) {
              const initialTexts = scenes.map(
                (scene) => scene.speech_text || ""
              );
              form.setFieldsValue({ text_list: initialTexts });
            } else {
              form.setFieldsValue({ text_list: [""] });
            }
          }
        }
      }, [nodeType, form, nodeInput.text_list]);

      return (
        <Row gutter={24}>
          {/* 左侧：输入与脚本内容 */}
          <Col span={12}>
            <div className="section-title">语音克隆输入</div>
            <Form.Item
              label="语音克隆"
              name="prompt_audio"
              initialValue={globalsWorkflowData?.prompt_audio_file}
            >
              <AudioUploadCard
                value={globalsWorkflowData?.prompt_audio_file}
                url={globalsWorkflowData?.prompt_audio}
                placeholder="点击上传一段音频"
              />
            </Form.Item>
            <Form.Item
              label="语音风格"
              name="instruct"
              initialValue={nodeInput.instruct}
            >
              <Radio.Group>
                <Radio value="孤独">孤独</Radio>
                <Radio value="优雅">优雅</Radio>
                <Radio value="好奇">好奇</Radio>
                <Radio value="模仿机器人声音">模仿机器人声音</Radio>
                <Radio value="惊讶">惊讶</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="合成声音的文本"
              name="text_list"
              initialValue={nodeInput.text || [""]}
              extra="您可以编辑从脚本中提取的文本内容"
            >
              <Form.List name="text">
                {(fields) => (
                  <>
                    {fields.map((field) => (
                      <Space
                        key={field.key}
                        className="text-field-container"
                        align="baseline"
                      >
                        <Form.Item {...field} noStyle>
                          <Input.TextArea
                            rows={2}
                            placeholder="请输入文本内容"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Space>
                    ))}
                  </>
                )}
              </Form.List>
            </Form.Item>
          </Col>
          {/* 右侧：语音克隆结果 */}
          <Col span={11}>
            <div className="section-title text-left">语音克隆输出</div>
            <div className="clone-output-container">
              {outputData && outputData.length > 0 ? (
                <div className="output-item">
                  <div className="output-value">
                    <div className="audio-list">
                      {outputData.map((url: string, index: number) => (
                        <div key={index} className="audio-item">
                          <AudioUploadCard
                            url={url}
                            value={null}
                            downloadMode={true}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-clone-message">暂无克隆结果</div>
              )}
            </div>
          </Col>
        </Row>
      );
    } else if (nodeType === "searchNode") {
      // 素材搜索节点
      const nodeInput = node.data.inputs || {};
      return (
        <Row gutter={24}>
          {/* 左侧：语音脚本输入输出 */}
          <Col span={12}>
            <div className="section-title">素材搜索输入</div>
            {/* 渲染 script_contents 列表 */}
            <div className="script-content-list">
              <Form.List name="script_contents">
                {(fields) =>
                  fields && fields.length > 0 ? (
                    <div className="script-scenes">
                      {fields.map((field, idx) => (
                        <Form.Item
                          key={field.key}
                          label={
                            nodeInput.script_contents &&
                            nodeInput.script_contents[idx]
                              ? `${nodeInput.script_contents[idx].scene}：${nodeInput.script_contents[idx].scene_title}（${nodeInput.script_contents[idx].scene_time}）`
                              : `场景${idx + 1}`
                          }
                          name={[field.name, "scene_content"]}
                          className="script-scene-item"
                        >
                          <Input.TextArea
                            placeholder="场景内容"
                            autoSize={{ minRows: 2, maxRows: 6 }}
                          />
                        </Form.Item>
                      ))}
                    </div>
                  ) : (
                    <div className="no-script-message">暂无脚本内容</div>
                  )
                }
              </Form.List>
            </div>
            <Form.Item
              name="script_contents"
              initialValue={nodeInput.script_contents}
              style={{ marginBottom: 8 }}
            >
              {/* 这里可以放一个隐藏域或其他表单控件，如果需要提交 */}
            </Form.Item>
          </Col>
          {/* 右侧：素材搜索输出 */}
          <Col span={12}>
            <div className="section-title">素材搜索输出</div>
            {renderMaterialSearchOutput(outputData.video_clips)}
          </Col>
        </Row>
      );
    } else if (nodeType === "evalNode") {
      return renderVideoEvaluationForm();
    }

    return null;
  };

  const renderNodeOutput = () => {
    const nodeStatus = node.data.status;

    if (nodeStatus === "completed" || nodeStatus === "running") {
      if (
        node.type === "ttsNode" &&
        outputData.speech_audio_urls &&
        outputData.speech_audio_urls.length > 0
      ) {
        return (
          <div className="audio-output-item">
            <div className="output-label">语音合成结果:</div>
            <div className="output-value">
              <div className="audio-list">
                {outputData.speech_audio_urls.map(
                  (url: string, index: number) => (
                    <div key={index} className="audio-item">
                      <AudioUploadCard
                        url={url}
                        value={null}
                        downloadMode={true}
                        placeholder={`音频 ${index + 1}`}
                      />
                      <div className="audio-name">音频 {index + 1}</div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        );
      } else if (
        node.type === "cloneNode" &&
        outputData.speech_list &&
        outputData.speech_list.length > 0
      ) {
      }
    }
    return null;
  };

  const handleSubmit = (values: any) => {
    // 如果是语音克隆节点且使用脚本内容
    if (node.type === "cloneNode") {
      // 过滤掉空文本
      values.text_list = (values.text_list || []).filter(
        (text: string) => text && text.trim() !== ""
      );

      // 如果文本列表为空，尝试从脚本中获取
      if (values.text_list.length === 0) {
        const scriptScenes = findScriptNodeOutput();
        if (scriptScenes.length > 0) {
          values.text_list = scriptScenes.map((scene: any) => scene.content);
        }
      }
    }

    onSubmit(values);
  };

  return (
    <div className="workflow-form">
      {renderNodeOutput()}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={node.data.inputs || {}}
      >
        {renderFormItems()}
      </Form>
    </div>
  );
};

export default WorkflowForm;
