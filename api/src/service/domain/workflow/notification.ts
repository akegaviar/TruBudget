import Joi = require("joi");

import * as Result from "../../../result";
import { BusinessEvent } from "../business_event";
import * as UserRecord from "../organization/user_record";
import { NotificationTraceEvent, notificationTraceEventSchema } from "./notification_trace_event";

export type Id = string;

export const idSchema = Joi.string().max(36);

export interface Notification {
  id: Id;
  createdAt: string; // ISO timestamp
  recipient: UserRecord.Id;
  isRead: boolean;
  businessEvent: BusinessEvent;
  projectId?: string;
  subprojectId?: string;
  workflowitemId?: string;
  log: NotificationTraceEvent[];
}

const schema = Joi.object({
  id: idSchema.required(),
  createdAt: Joi.date()
    .iso()
    .required(),
  recipient: UserRecord.idSchema,
  isRead: Joi.boolean().required(),
  // "object" due to recursiveness of validation:
  businessEvent: Joi.object(),
  projectId: Joi.string().max(32),
  subprojectId: Joi.string().max(32),
  workflowitemId: Joi.string().max(32),
  log: Joi.array()
    .required()
    .items(notificationTraceEventSchema),
}).options({ stripUnknown: true });

export function validate(input: any): Result.Type<Notification> {
  const { error, value } = Joi.validate(input, schema);
  return !error ? value : error;
}
