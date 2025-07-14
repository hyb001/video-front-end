import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

// 初始化FFmpeg
export const ffmpeg = createFFmpeg({
  log: true,
  corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
});

// 加载FFmpeg
export const loadFFmpeg = async () => {
  if (!ffmpeg.isLoaded()) {
    try {
      await ffmpeg.load();
      console.log('FFmpeg 加载成功');
      return true;
    } catch (error) {
      console.error('FFmpeg 加载失败:', error);
      return false;
    }
  }
  return true;
};

// 剪切视频片段
export const cutVideoClip = async (
  videoFile: File,
  startTime: number,
  endTime: number,
  outputName: string = 'output.mp4'
) => {
  try {
    // 将视频文件写入FFmpeg文件系统
    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));
    
    // 剪切片段
    await ffmpeg.run(
      '-i', 'input.mp4',
      '-ss', startTime.toString(),
      '-to', endTime.toString(),
      '-c', 'copy',
      outputName
    );
    
    // 读取输出文件
    const data = ffmpeg.FS('readFile', outputName);
    
    // 创建视频URL
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: 'video/mp4' })
    );
    
    // 清理临时文件
    ffmpeg.FS('unlink', 'input.mp4');
    ffmpeg.FS('unlink', outputName);
    
    return url;
  } catch (error) {
    console.error('视频剪切失败:', error);
    throw error;
  }
};

// 合并多个视频片段
export const mergeVideoClips = async (
  videoFiles: { file: File, startTime: number, endTime: number }[],
  outputName: string = 'output.mp4'
) => {
  try {
    // 处理每个片段
    const clipFiles: string[] = [];
    const clipCommands: string[] = [];
    
    for (let i = 0; i < videoFiles.length; i++) {
      const { file, startTime, endTime } = videoFiles[i];
      const inputName = `input_${i}.mp4`;
      const clipName = `clip_${i}.mp4`;
      
      // 写入输入文件
      ffmpeg.FS('writeFile', inputName, await fetchFile(file));
      
      // 剪切片段
      await ffmpeg.run(
        '-i', inputName,
        '-ss', startTime.toString(),
        '-to', endTime.toString(),
        '-c', 'copy',
        clipName
      );
      
      clipFiles.push(clipName);
      clipCommands.push(`file '${clipName}'`);
      
      // 清理输入文件
      ffmpeg.FS('unlink', inputName);
    }
    
    // 创建文件列表
    ffmpeg.FS('writeFile', 'clips.txt', new TextEncoder().encode(clipCommands.join('\n')));
    
    // 合并所有片段
    await ffmpeg.run(
      '-f', 'concat',
      '-safe', '0',
      '-i', 'clips.txt',
      '-c', 'copy',
      outputName
    );
    
    // 读取输出文件
    const data = ffmpeg.FS('readFile', outputName);
    
    // 创建视频URL
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: 'video/mp4' })
    );
    
    // 清理临时文件
    ffmpeg.FS('unlink', 'clips.txt');
    clipFiles.forEach(file => {
      ffmpeg.FS('unlink', file);
    });
    ffmpeg.FS('unlink', outputName);
    
    return url;
  } catch (error) {
    console.error('视频合并失败:', error);
    throw error;
  }
};

// 添加音频到视频
export const addAudioToVideo = async (
  videoFile: File,
  audioFile: File,
  outputName: string = 'output.mp4'
) => {
  try {
    // 写入文件
    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));
    ffmpeg.FS('writeFile', 'audio.mp3', await fetchFile(audioFile));
    
    // 添加音频
    await ffmpeg.run(
      '-i', 'input.mp4',
      '-i', 'audio.mp3',
      '-map', '0:v',
      '-map', '1:a',
      '-c:v', 'copy',
      '-shortest',
      outputName
    );
    
    // 读取输出文件
    const data = ffmpeg.FS('readFile', outputName);
    
    // 创建视频URL
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: 'video/mp4' })
    );
    
    // 清理临时文件
    ffmpeg.FS('unlink', 'input.mp4');
    ffmpeg.FS('unlink', 'audio.mp3');
    ffmpeg.FS('unlink', outputName);
    
    return url;
  } catch (error) {
    console.error('添加音频失败:', error);
    throw error;
  }
};

// 提取视频帧作为缩略图
export const extractVideoFrame = async (
  videoFile: File,
  timeInSeconds: number,
  outputName: string = 'thumbnail.jpg'
) => {
  try {
    // 写入文件
    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));
    
    // 提取帧
    await ffmpeg.run(
      '-i', 'input.mp4',
      '-ss', timeInSeconds.toString(),
      '-frames:v', '1',
      outputName
    );
    
    // 读取输出文件
    const data = ffmpeg.FS('readFile', outputName);
    
    // 创建图片URL
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: 'image/jpeg' })
    );
    
    // 清理临时文件
    ffmpeg.FS('unlink', 'input.mp4');
    ffmpeg.FS('unlink', outputName);
    
    return url;
  } catch (error) {
    console.error('提取视频帧失败:', error);
    throw error;
  }
};