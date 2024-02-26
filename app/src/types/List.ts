export type ListType<K extends string = string, T = unknown> = Record<K, Array<T>>;

export type ListInfo = {
  page: number;
  pages: number;
  count: number;
};

export type ListResponse<T extends ListType> = T & ListInfo;
