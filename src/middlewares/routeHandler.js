import { routes } from "../routes/index.js";
import { Database } from "../database/database.js";
import { extractQueryParams } from "../utils/extractQueryParams.js";

const database = new Database();

export function routeHandler(req, res) {
  const route = routes.find((route) => {
    return route.method === req.method && route.path.test(req.url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);
    const { groups } = routeParams;

    req.params = groups || {};

    const [path, queryString] = req.url.split("?");
    req.query = queryString ? extractQueryParams(`?${queryString}`) : {};

    return route.controller({ req, res, database });
  }

  return res.writeHead(404).end(JSON.stringify({ message: "Route not found" }));
}
