import { randomUUID } from "node:crypto";

export function create({ req, res, database }) {
  if (!req.body) {
    return res
      .writeHead(400)
      .end(JSON.stringify({ error: "Invalid JSON body" }));
  }

  const { equipment, description, user_name } = req.body;

  if (!equipment || !description || !user_name) {
    return res.writeHead(400).end(
      JSON.stringify({
        error: "Missing required fields: equipment, description, user_name",
      })
    );
  }

  const ticket = {
    id: randomUUID(),
    equipment,
    description,
    user_name,
    status: "open",
    created_at: new Date(),
    updated_at: new Date(),
  };

  database.insert("tickets", ticket);

  return res.writeHead(201).end(JSON.stringify(ticket));
}
