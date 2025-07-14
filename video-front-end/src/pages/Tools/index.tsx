import React, { useState, useEffect } from 'react';
import { Tabs, Card, Typography, Spin } from 'antd';
import toolImage from '../../assets/images/tools/tool_1.jpg';
import styles from './index.module.css';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

// 工具类型定义
interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
}

// 工具分类
const categories = [
  { key: 'all', label: '全部' },
  { key: 'hot', label: '热门' },
  { key: 'audio', label: '音频' },
  { key: 'script', label: '脚本' },
  { key: 'video', label: '视频' },
  { key: 'video-review', label: '视频评估' },
  { key: 'clip-ui-agent', label: 'Clip UI Agent' },
];

// 模拟工具数据
const mockTools: Tool[] = [
  { id: '1', name: '特效字幕', description: '我想介绍文案我想介绍文案我想介绍文案', category: 'hot', image: toolImage },
  { id: '2', name: '语音克隆', description: '我想介绍文案我想介绍文案我想介绍文案', category: 'hot', image: toolImage },
  { id: '3', name: '转场动画', description: '我想介绍文案我想介绍文案我想介绍文案', category: 'hot', image: toolImage },
  { id: '4', name: '视频语音提取', description: '我想介绍文案我想介绍文案我想介绍文案', category: 'audio', image: toolImage },
  { id: '5', name: '音乐节奏', description: '我想介绍文案我想介绍文案我想介绍文案', category: 'audio', image: toolImage },
  { id: '6', name: '语音克隆', description: '我想介绍文案我想介绍文案我想介绍文案', category: 'audio', image: toolImage },
  { id: '7', name: '音乐卡点', description: '我想介绍文案我想介绍文案我想介绍文案', category: 'audio', image: toolImage },
  { id: '8', name: '脚本反推', description: '我想介绍文案我想介绍文案我想介绍文案', category: 'script', image: toolImage },
  { id: '9', name: '脚本生成', description: '我想介绍文案我想介绍文案我想介绍文案', category: 'script', image: toolImage },
];

const Tools: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [tools, setTools] = useState<Tool[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    // 模拟API请求
    const fetchTools = async () => {
      setLoading(true);
      try {
        // 这里可以替换为实际的API请求
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTools(mockTools);
      } catch (error) {
        console.error('获取工具列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  // 根据分类筛选工具
  const getToolsByCategory = (category: string) => {
    if (category === 'all') {
      return tools;
    }
    return tools.filter(tool => tool.category === category);
  };

  // 处理标签页切换
  const handleTabChange = (key: string) => {
    setActiveCategory(key);
  };

  // 渲染工具卡片
  const renderToolCards = (categoryTools: Tool[]) => {
    return (
      <div className={styles.toolsGrid}>
        {categoryTools.map(tool => (
          <Card key={tool.id} className={styles.toolCard} hoverable>
            <div className={styles.toolImageContainer}>
              <img src={tool.image} alt={tool.name} className={styles.toolImage} />
            </div>
            <div className={styles.toolInfo}>
              <Title level={5} className={styles.toolTitle}>{tool.name}</Title>
              <Paragraph className={styles.toolDescription}>{tool.description}</Paragraph>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  // 渲染分类标题
  const renderCategoryTitle = (category: string) => {
    const categoryObj = categories.find(cat => cat.key === category);
    return categoryObj ? <div className={styles.categoryTitle}>{categoryObj.label}</div> : null;
  };

  // 渲染全部工具（按类别分组）
  const renderAllTools = () => {
    // 获取除"all"之外的所有分类
    const displayCategories = categories.filter(cat => cat.key !== 'all');
    
    return (
      <>
        {displayCategories.map(category => {
          const categoryTools = tools.filter(tool => tool.category === category.key);
          
          // 如果该分类没有工具，则不显示
          if (categoryTools.length === 0) return null;
          
          return (
            <div key={category.key} className={styles.categorySection}>
              <div className={styles.categoryTitle}>{category.label}</div>
              {renderToolCards(categoryTools)}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.pageTitle}>工具箱</Title>
      
      <Tabs 
        activeKey={activeCategory} 
        onChange={handleTabChange}
        className={styles.tabs}
      >
        {categories.map(category => (
          <TabPane tab={category.label} key={category.key}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <Spin size="large" />
              </div>
            ) : (
              <>
                {category.key === 'all' ? (
                  renderAllTools()
                ) : (
                  <>
                    {renderCategoryTitle(category.key)}
                    {renderToolCards(getToolsByCategory(category.key))}
                  </>
                )}
              </>
            )}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default Tools;