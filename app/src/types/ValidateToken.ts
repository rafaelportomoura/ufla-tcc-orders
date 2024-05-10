export type DecodedToken = {
  sub: string;
  iss: string;
  client_id: string;
  origin_jti: string;
  event_id: string;
  token_use: string;
  scope: string;
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  username: string;
};

export type ValidateToken = {
  decoded_token: DecodedToken;
  group: string;
};
