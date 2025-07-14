import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  return (
    <div className="video-player">
      <video 
        controls 
        src={videoUrl} 
        style={{ width: '100%', height: 'auto', maxHeight: '500px' }}
      />
    </div>
  );
};

export default VideoPlayer;