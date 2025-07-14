import React from "react";
import { Dropdown, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { menuData } from "@/layouts/MainLayout/data/menuData";

const HeaderBar: React.FC = () => {
  const navigate = useNavigate();

  const getMenuItems = (data: any[]) => {
    return data.map((item) => {
      if (item.children) {
        return {
          key: item.key,
          label: (
            <span
              style={{
                fontWeight: item.key === "workflow" ? 600 : 400,
                color: item.key === "workflow" ? "#1433FE" : "#222",
              }}
            >
              {item.label}
            </span>
          ),
          children: item.children.map((child: any) => ({
            key: child.key,
            label: (
              <span
                style={{ color: child.key === "ai-mix" ? "#1433FE" : "#222" }}
              >
                {child.label}
              </span>
            ),
            onClick: () => {
              if (child.path) navigate(child.path);
            },
          })),
        };
      } else {
        return {
          key: item.key,
          label: item.label,
          onClick: () => {
            if (item.path) navigate(item.path);
          },
        };
      }
    });
  };

  return (
    <div
      className="ai-render-header"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0px 24px 8px 18px",
        minHeight: 50,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 18,
          color: "#111",
          marginRight: 24,
          letterSpacing: 1,
        }}
      >
        <span style={{ fontWeight: 700 }}>SenseClip</span>
      </div>
      <Dropdown
        menu={{ items: getMenuItems(menuData) }}
        trigger={["click"]}
        placement="bottomLeft"
        arrow
      >
        <div
          style={{
            height: 36,
            background: "#fff",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            cursor: "pointer",
            marginRight: 24,
            boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
            border: "1px solid #f0f0f0",
          }}
        >
          工作流 - AI混剪
          <svg
            style={{ marginLeft: 8 }}
            width="12"
            height="12"
            viewBox="0 0 12 12"
          >
            <path
              d="M4 5l2 2 2-2"
              stroke="#999"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </Dropdown>
      <Input
        placeholder="请输入AI混剪文件名"
        style={{ width: 240, background: "#fff" }}
        bordered={false}
      />
    </div>
  );
};

export default HeaderBar;
