import * as Global from "..";
import { throwIfUnauthorized } from "../../authz";
import { allIntents } from "../../authz/intents";
import { AuthenticatedRequest, HttpResponse } from "../../httpd/lib";
import { isNonemptyString, value } from "../../lib/validation";
import { MultichainClient } from "../../multichain";

export const revokeGlobalPermission = async (
  multichain: MultichainClient,
  req: AuthenticatedRequest,
): Promise<HttpResponse> => {
  const input = value("data", req.body.data, x => x !== undefined);

  const identity: string = value("identity", input.identity, isNonemptyString);
  const intent = value("intent", input.intent, x => allIntents.includes(x));

  // Is the user allowed to revoke global permissions?
  await throwIfUnauthorized(
    req.token,
    "global.intent.revokePermission",
    await Global.getPermissions(multichain),
  );

  await Global.revokePermission(multichain, identity, intent);

  return [
    200,
    {
      apiVersion: "1.0",
      data: "OK",
    },
  ];
};
