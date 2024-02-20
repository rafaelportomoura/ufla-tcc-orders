export type DocumentSecret = {
  username: string;

  password: string;
};

export type DocumentParams = {
  host: string;

  database: string;

  protocol: string;

  options?: Record<string, string>;
};
