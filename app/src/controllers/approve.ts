import { FastifyReply, FastifyRequest } from 'fastify';
import { Validator } from '../adapters/validate';
import { aws_params } from '../aws/config';
import { ApproveBusiness } from '../business/Approve';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { CONFIGURATION } from '../constants/configuration';
import { HTTP_STATUS_CODE } from '../constants/httpStatus';
import { order_id_schema } from '../schemas/order_id';
import { CodeMessage } from '../types/CodeMessage';

export async function approve(req: FastifyRequest, res: FastifyReply): Promise<CodeMessage> {
  const logger = req.log;
  const business = new ApproveBusiness({
    logger,
    event_bus_topic: CONFIGURATION.EVENT_BUS,
    aws_params: aws_params()
  });
  const body = await Validator.validate(req.body, order_id_schema);

  await business.approve(body);

  res.status(HTTP_STATUS_CODE.OK);
  return CODE_MESSAGES.APPROVED;
}
