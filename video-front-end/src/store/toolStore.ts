import { create } from 'zustand';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  type: string;
}

interface ToolState {
  tools: Tool[];
  categories: string[];
  loading: boolean;
  fetchTools: () => Promise<void>;
}

// 模拟工具数据
const mockTools: Tool[] = [
  { 
    id: '1', 
    name: '脚本生成', 
    description: '基于提示词生成视频脚本', 
    category: '脚本',
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    type: 'scriptGenerator'
  },
  { 
    id: '2', 
    name: '语音合成', 
    description: '将文本转换为自然语音', 
    category: '音频',
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    type: 'speechSynthesis'
  },
  { 
    id: '3', 
    name: '视频剪辑', 
    description: '自动剪辑和编辑视频内容', 
    category: '视频',
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    type: 'videoEditor'
  },
  { 
    id: '4', 
    name: '数字人生成', 
    description: '创建数字人形象并生成视频', 
    category: '视频',
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    type: 'digitalHuman'
  },
  { 
    id: '5', 
    name: '字幕生成', 
    description: '自动为视频生成字幕', 
    category: '字幕',
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    type: 'subtitleGenerator'
  },
];

export const useToolStore = create<ToolState>()((set) => ({
  tools: [],
  categories: [],
  loading: false,
  
  fetchTools: async () => {
    try {
      set({ loading: true });
      
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 提取所有类别
      const categories = Array.from(new Set(mockTools.map(tool => tool.category)));
      
      set({ 
        tools: mockTools,
        categories,
        loading: false 
      });
    } catch (error) {
      console.error('获取工具列表失败:', error);
      set({ loading: false });
    }
  },
}));