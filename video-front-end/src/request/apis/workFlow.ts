import axiosInstance from "..";

// 发送验证码
export async function getWorkflow(space_id: number) {
  const result = await axiosInstance.post(`workflow/get_workflow`, {
    params: {
      space_id,
    },
  });
  return result.data;
}
