// Utility type
declare type Override<T, R> = Omit<T, keyof R> & R;

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
  titleIv: string;
  contentCipher: string;
  contentIv: string;
  user: string;
}

declare interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

declare interface UserPrefs {
  wrappedDek: string;
  iv: string;
  kdfSalt: string;
  kdfIterations: number;
}
