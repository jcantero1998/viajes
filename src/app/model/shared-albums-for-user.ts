export interface SharedAlbumsForUser {
  sharedAlbums: SharedAlbum[];
}

export interface SharedAlbum {
  id: string;
  title?: string;
  productUrl: string;
  mediaItemsCount: string;
  coverPhotoBaseUrl?: string;
  coverPhotoMediaItemId?: string;
}
