import React, { useRef, useEffect, useCallback } from "react";
import SliderCaptcha from "rc-slider-captcha";
import { sleep } from "ut2";
import createPuzzle from "create-puzzle";
import {
  MehOutlined,
  SmileOutlined,
  RedoOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import styles from "./slider.module.css";
import pic1 from "@/assets/images/login/captcha-bg1.jpg";
import pic2 from "@/assets/images/login/captcha-bg2.jpg";
import pic3 from "@/assets/images/login/captcha-bg3.jpg";

interface ImageSize {
  width: number;
  height: number;
}

interface Props {
  onSuccess?: (time?: number) => void;
  onFail?: (time?: number) => void;
}

const SolidCaptcha: React.FC<Props> = ({
  onSuccess = () => {},
  onFail = () => {},
}) => {
  const offsetXRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const bgSizeRef = useRef<ImageSize | null>(null);
  const startTimeRef = useRef<number>(0);

  // 背景图片数组
  const backgroundImages = [pic1, pic2, pic3];

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const verifyCaptcha = useCallback(
    async (data: { x: number }) => {
      await sleep(500); // 模拟网络延迟

      const realWidth = bgSizeRef.current?.width || 0;
      // const displayWidth = Math.min(realWidth, 150);
      const displayWidth = 350;
      const scale = realWidth / displayWidth;

      const realX = data.x * scale;
      const isVerified = Math.abs(realX - offsetXRef.current) <= 50; // 验证误差范围
      console.log(
        `验证位置: 用户拖动${realX}px, 正确位置${
          offsetXRef.current
        }px, 误差${Math.abs(realX - offsetXRef.current)}px, 验证${
          isVerified ? "成功" : "失败"
        }`
      );

      const verifyTime = Date.now() - startTimeRef.current;

      return new Promise<void>((resolve, reject) => {
        if (isVerified) {
          timerRef.current = setTimeout(() => {
            if (typeof onSuccess === "function") {
              onSuccess(verifyTime);
            }
            resolve();
          }, 1000);
        } else {
          onFail(verifyTime);
          reject(new Error("验证失败"));
        }
      });
    },
    [onSuccess, onFail]
  );

  const generatePuzzle = useCallback(() => {
    startTimeRef.current = Date.now();

    // 更新图片索引
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);

    // 获取当前要使用的图片
    const currentPic = backgroundImages[randomIndex];

    const getImageSize = (url: string): Promise<ImageSize> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        };
        img.src = url;
      });
    };

    return getImageSize(currentPic)
      .then((bgSize) => {
        // 这里的显示宽度与SliderCaptcha组件中设置的bgSize.width一致
        const displayWidth = 350;
        const scale = bgSize.width / displayWidth;
        const desiredDisplayPuzzleSize = 50;
        const originalPuzzleSize = desiredDisplayPuzzleSize * scale;

        return createPuzzle(currentPic, {
          format: "blob",
          width: originalPuzzleSize,
          height: originalPuzzleSize,
        }).then(async (res) => {
          offsetXRef.current = res.x;
          bgSizeRef.current = bgSize;

          // 添加一个唯一标识符，帮助区分不同的调用
          //   const callId = Date.now().toString().slice(-4);
          //   console.log(
          //     `[${callId}] 使用背景图片: ${randomIndex + 1}, 正确位置: ${
          //       res.x
          //     }px, 图片尺寸: ${bgSize.width}x${bgSize.height}`
          //   );

          return {
            bgUrl: res.bgUrl,
            puzzleUrl: res.puzzleUrl,
            originalX: res.x,
            bgSize: bgSize,
          };
        });
      })
      .catch((error) => {
        console.error("拼图生成失败:", error);
        return Promise.reject(error);
      });
  }, [backgroundImages]);

  return (
    <div className={styles.captchaContainer}>
      <SliderCaptcha
        request={generatePuzzle}
        onVerify={verifyCaptcha}
        bgSize={{
          width: 350,
          height: 200,
        }}
        tipIcon={{
          loading: <LoadingOutlined className={styles.loadingIcon} />,
          success: <SmileOutlined className={styles.successIcon} />,
          error: <MehOutlined className={styles.errorIcon} />,
          refresh: <RedoOutlined className={styles.refreshIcon} />,
        }}
        tipText={{
          default: "向右拖动完成拼图 👉",
          loading: "正在加载...",
          moving: "继续向右拖动 →",
          verifying: "正在验证...",
          error: "验证失败，请重试",
          success: "验证成功！",
        }}
      />
    </div>
  );
};

export default SolidCaptcha;
