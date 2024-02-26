import { FastifyReply, FastifyRequest } from 'fastify';
import { Validator } from '../adapters/validate';
import { aws_params } from '../aws/config';
import { RejectBusiness } from '../business/Reject';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { CONFIGURATION } from '../constants/configuration';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { approve_schema } from '../schemas/approve';
import { CodeMessage } from '../types/CodeMessage';

export async function reject(req: FastifyRequest, res: FastifyReply): Promise<CodeMessage> {
  const logger = req.log;
  const business = new RejectBusiness({
    logger,
    event_bus_topic: CONFIGURATION.EVENT_BUS,
    aws_params: aws_params()
  });
  const body = await Validator.validate(req.body, approve_schema);

  await business.reject(body);

  res.status(HTTP_STATUS_CODE.OK);
  return CODE_MESSAGES.REJECTED;
}
