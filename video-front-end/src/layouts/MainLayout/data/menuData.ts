export const menuData = [
  {
    key: "home",
    label: "首页",
    path: "/",
  },
  {
    key: "workflow",
    label: "工作流",
    children: [
      { key: "ai-mix", label: "AI混剪", path: "/ai-render" },
      { key: "ai-digital", label: "AI数字人", path: "/workflow/ai-digital" },
    ],
  },
  {
    key: "toolbox",
    label: "工具箱",
    path: "/tools",
  },
  {
    key: "material",
    label: "AI素材中心",
    children: [],
  },
];
