import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from './axiosInstance';
import * as FileSystem from 'expo-file-system';

interface UploadResponse {
  video: {
    id: string;
    title: string;
    description: string;
    views: number;
    url: string | null;
    thumbnail: string;
  };
  preSignedUrl: string;
}

interface UploadStatus {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
}

export const useVideoUpload = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ status: 'idle', progress: 0 });
  const [processingVideos, setProcessingVideos] = useState<string[]>([]);

  const uploadMutation = useMutation({
    mutationKey: ['uploadVideo'],
    mutationFn: async (data: { formData: FormData; videoUri: string }) => {
      const response = await axiosInstance.post<{ data: UploadResponse }>('/video/', data.formData);
      return { ...response.data.data, videoUri: data.videoUri };
    },
    onSuccess: (data) => {
      handleUploadToS3(data);
    },
    onError: (error) => {
      console.error('Video upload error:', error);
      setUploadStatus({ status: 'error', progress: 0 });
    },
  });

  const handleUploadToS3 = async (response: UploadResponse & { videoUri: string }) => {
    const { preSignedUrl, video, videoUri } = response;
    
    try {
      setUploadStatus({ status: 'uploading', progress: 0 });

      const uploadResult = await FileSystem.uploadAsync(preSignedUrl, videoUri, {
        httpMethod: 'PUT',
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      });

      if (uploadResult.status !== 200) {
        throw new Error(`Upload failed with status ${uploadResult.status}`);
      }

      setUploadStatus({ status: 'processing', progress: 100 });
      setProcessingVideos(prev => [...prev, video.id]);
      await pollVideoStatus(video.id);

    } catch (err) {
      console.error('Failed to upload video to S3:', err);
      setUploadStatus({ status: 'error', progress: 0 });
    }
  };

  const pollVideoStatus = async (videoId: string) => {
    const maxAttempts = 50;
    const interval = 5000; // 5 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await axiosInstance.get(`/video/${videoId}`);
        if (response.data?.data?.video?.url) {
          setUploadStatus({ status: 'completed', progress: 100 });
          setProcessingVideos(prev => prev.filter(id => id !== videoId));
          return;
        }
      } catch (error) {
        console.error('Error polling video status:', error);
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    setUploadStatus({ status: 'error', progress: 0 });
    setProcessingVideos(prev => prev.filter(id => id !== videoId));
  };

  return {
    uploadVideo: uploadMutation.mutate,
    uploadStatus,
    isUploading: uploadMutation.isPending || uploadStatus.status === 'processing',
    processingVideos,
  };
};