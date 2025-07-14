import React from 'react';
import { Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

const { Title } = Typography;

// 功能卡片数据
const featureCards = [
  {
    id: 'ai-render',
    title: 'AI 混剪',
    icon: 'src/assets/images/home_page/ai_1.png',
    path: '/ai-render',
    description: '智能视频剪辑与合成'
  },
  {
    id: 'ai-digital-human',
    title: 'AI 数字人',
    icon: 'src/assets/images/home_page/ai_2.png',
    path: '/ai-digital-human',
    description: '生成逼真的数字人物'
  }
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.recommendSection}>
        <Title level={4} className={styles.sectionTitle}>你可能想试：</Title>
        
        <div className={styles.cardContainer}>
          {featureCards.map(card => (
            <Card 
              key={card.id}
              className={styles.featureCard}
              onClick={() => navigate(card.path)}
              hoverable
              bodyStyle={{ padding: 0 }}
              bordered={false}
            >
              <div className={styles.featureContent}>
                <div className={styles.featureLeft}>
                  <div>
                    <Title level={5} className={styles.featureTitle}>{card.title}</Title>
                    {card.description && (
                      <p className={styles.featureDesc}>{card.description}</p>
                    )}
                  </div>
                </div>
                <div className={styles.featureRight}>
                  <img 
                    src={card.icon} 
                    className={styles.featureIcon} 
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;