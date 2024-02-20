import { AWS_CONFIGURATION } from '../constants/aws';
import { AwsParams } from '../types/Aws';

export const aws_config = ({ region, credentials }: AwsParams) => ({ region, credentials });

export const aws_params = () => AWS_CONFIGURATION;
