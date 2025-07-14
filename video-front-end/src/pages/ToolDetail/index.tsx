import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Descriptions, Tabs, Spin, Empty, message } from 'antd';
import { ArrowLeftOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useToolStore } from '../../store/toolStore';
import styles from './index.module.css';

const { TabPane } = Tabs;

const ToolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tools, fetchTools } = useToolStore();
  const [loading, setLoading] = useState(true);
  const [tool, setTool] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 如果工具列表为空，则获取工具列表
        if (tools.length === 0) {
          await fetchTools();
        }
        
        // 查找指定ID的工具
        const foundTool = tools.find(t => t.id === id);
        
        if (foundTool) {
          setTool(foundTool);
        } else {
          message.error('工具不存在');
        }
      } catch (error) {
        console.error('获取工具详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, tools, fetchTools]);

  const handleBack = () => {
    navigate('/tools');
  };

  const handleUse = () => {
    // 创建一个包含此工具的新工作流
    navigate('/workflows/new');
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  if (!tool) {
    return <Empty description="工具不存在" />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          返回
        </Button>
        <Button type="primary" icon={<PlayCircleOutlined />} onClick={handleUse}>
          使用此工具
        </Button>
      </div>

      <Card className={styles.toolCard}>
        <div className={styles.toolHeader}>
          <img src={tool.icon} alt={tool.name} className={styles.toolIcon} />
          <div>
            <h2>{tool.name}</h2>
            <p className={styles.category}>{tool.category}</p>
          </div>
        </div>

        <p className={styles.description}>{tool.description}</p>

        <Tabs defaultActiveKey="1">
          <TabPane tab="基本信息" key="1">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="工具名称">{tool.name}</Descriptions.Item>
              <Descriptions.Item label="类别">{tool.category}</Descriptions.Item>
              <Descriptions.Item label="描述">{tool.description}</Descriptions.Item>
            </Descriptions>
          </TabPane>
          <TabPane tab="使用说明" key="2">
            <div className={styles.usage}>
              <h3>如何使用</h3>
              <p>1. 在工作流编辑器中添加此工具</p>
              <p>2. 配置工具参数</p>
              <p>3. 连接其他工具节点</p>
              <p>4. 执行工作流</p>
            </div>
          </TabPane>
          <TabPane tab="示例" key="3">
            <div className={styles.examples}>
              <h3>示例工作流</h3>
              <p>暂无示例</p>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ToolDetail;