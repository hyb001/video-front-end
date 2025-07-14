import { createHashRouter, redirect } from "react-router-dom";
import { Navigate } from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Spin } from "antd";
import Login from "@/pages/Login";
import MainLayout from "@/layouts/MainLayout";
import { useUserStore } from "@/store/userStore";

// 懒加载页面组件
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Tools = lazy(() => import("@/pages/Tools"));
const ToolDetail = lazy(() => import("@/pages/ToolDetail"));
const AIRender = lazy(() => import("@/pages/AIRender"));
// const Workflows = lazy(() => import("@/pages/Workflows"));
// const WorkflowEditor = lazy(() => import("@/pages/WorkflowEditor"));
// const Profile = lazy(() => import("@/pages/Profile"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// 加载中组件
const LoadingComponent = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <Spin size="large" />
  </div>
);

// 路由守卫逻辑
const authLoader = async ({ request }: LoaderFunctionArgs) => {
  const token = useUserStore.getState().token;
  if (!token) {
    // 记录用户想访问的路径（兼容 hash 路由）
    const url = new URL(request.url);
    const hashPath = url.hash
      ? url.hash.replace(/^#/, "")
      : url.pathname + url.search;
    localStorage.setItem("redirectPath", hashPath);
    return redirect("/login");
  }
  return null;
};

const router = createHashRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <MainLayout />,
    loader: authLoader,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "tools",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingComponent />}>
                <Tools />
              </Suspense>
            ),
          },
          {
            path: ":id",
            element: (
              <Suspense fallback={<LoadingComponent />}>
                <ToolDetail />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "ai-render",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <AIRender />
          </Suspense>
        ),
      },
      //   {
      //     path: "workflows",
      //     children: [
      //       {
      //         index: true,
      //         element: (
      //           <Suspense fallback={<LoadingComponent />}>
      //             <Workflows />
      //           </Suspense>
      //         ),
      //       },
      //       {
      //         path: "new",
      //         element: (
      //           <Suspense fallback={<LoadingComponent />}>
      //             <WorkflowEditor />
      //           </Suspense>
      //         ),
      //       },
      //       {
      //         path: ":id",
      //         element: (
      //           <Suspense fallback={<LoadingComponent />}>
      //             <WorkflowEditor />
      //           </Suspense>
      //         ),
      //       },
      //       {
      //         path: ":id/edit",
      //         element: (
      //           <Suspense fallback={<LoadingComponent />}>
      //             <WorkflowEditor />
      //           </Suspense>
      //         ),
      //       },
      //     ],
      //   },
      //   {
      //     path: "profile",
      //     element: (
      //       <Suspense fallback={<LoadingComponent />}>
      //         <Profile />
      //       </Suspense>
      //     ),
      //   },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export default router;
