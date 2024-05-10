/* eslint-disable @typescript-eslint/no-explicit-any */
export class GenerateAuthResponse {
  static success(decoded_token: any, arn: string): unknown {
    const policy_document = this.generatePolicyDocument('Allow', arn);

    return {
      context: { headers: JSON.stringify({ username: decoded_token.username }) },
      principalId: decoded_token.sub,
      policyDocument: policy_document
    };
  }

  static error(cognito_id: string, arn: string): unknown {
    const policy_document = this.generatePolicyDocument('Deny', arn);

    return { principalId: cognito_id, policyDocument: policy_document };
  }

  static generatePolicyDocument(effect: string, arn: string) {
    const [api_arn, stage, method] = arn.split('/');
    const wild_card_arn = [api_arn, stage, method, '*'].join('/');
    const policy_document = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: wild_card_arn
        }
      ]
    };
    return policy_document;
  }
}
