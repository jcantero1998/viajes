export interface PhotosFromAlbum {
  mediaItems: MediaItem[];
  nextPageToken: string | null;
}

export interface MediaItem {
  id: string;
  productUrl: string;
  baseUrl: string;
  mimeType: string;
  mediaMetadata: MediaMetadata;
  filename: string;
}

export interface MediaMetadata {
  creationTime: string;
  width: string;
  height: string;
  photo?: Photo;
  video?: Video;
}

export interface Video {
  cameraMake?: string;
  cameraModel?: string;
  fps: number;
  status: string;
}

export interface Photo {
  cameraMake?: string;
  cameraModel?: string;
  focalLength?: number;
  apertureFNumber?: number;
  isoEquivalent?: number;
  exposureTime?: string;
}
