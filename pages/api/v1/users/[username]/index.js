import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user";

const router = createRouter();

router.get(getHandler);

async function getHandler(request, response) {
  const { username } = request.query;
  const userFound = await user.findOneByUsername(username);
  if (!userFound) {
    return response.status(404).json({});
  }
  return response.status(200).json(userFound);
}

export default router.handler(controller.errorHandlers);
