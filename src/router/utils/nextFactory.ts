import { Middleware, RouterContext } from "@/ts/types/router";

const nextFactory = (
  context: RouterContext,
  middleware: Middleware[],
  index: number
) => {
  const subsequentMiddleware = middleware[index];
  if (!subsequentMiddleware) return context.next;
  return (...parameters: []) => {
    context.next(...parameters);
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({ ...context, next: nextMiddleware });
  };
};

export default nextFactory;
