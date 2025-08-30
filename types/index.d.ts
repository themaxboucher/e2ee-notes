declare interface NoteDB {
  titleCipher: string;
  titleIv?: string;
  contentCipher: string;
  contentIv?: string;
  user: string;
}

declare interface NoteCipher {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  titleCipher: string;
  titleIv?: string;
  contentCipher: string;
  contentIv?: string;
  user: string;
}

declare interface Note {
  id?: string;
  title: string;
  content: string;
  updatedAt?: number;
}
