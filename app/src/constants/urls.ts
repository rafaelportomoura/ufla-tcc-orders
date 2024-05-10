import { CONFIGURATION } from './configuration';

export const URLS = ({ TENANT, STAGE }: typeof CONFIGURATION) =>
  ({
    OAUTH: `http://oauth.${STAGE}-${TENANT}.local`,
    PRODUCTS: `http://products.${STAGE}-${TENANT}.local`,
    STOCKS: `http://stocks.${STAGE}-${TENANT}.local`
  }) as const;
