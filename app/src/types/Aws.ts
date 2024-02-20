import { fromIni as from_ini } from '@aws-sdk/credential-providers';

export type AwsParams = {
  region: string;
  credentials?: Awaited<ReturnType<typeof from_ini>>;
};
