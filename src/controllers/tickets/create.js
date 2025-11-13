import {
  validateTicketData,
  formatTicketResponse,
  createTicketObject,
} from "../../utils/ticketUtils.js";

export function create({ req, res, database }) {
  if (!req.body) {
    return res
      .writeHead(400)
      .end(JSON.stringify({ error: "Invalid JSON body" }));
  }

  const validation = validateTicketData(req.body);
  if (!validation.isValid) {
    return res
      .writeHead(400)
      .end(
        JSON.stringify({
          error: "Validation failed",
          details: validation.errors,
        })
      );
  }

  const ticket = createTicketObject(req.body);
  database.insert("tickets", ticket);

  const formattedTicket = formatTicketResponse(ticket);
  return res.writeHead(201).end(JSON.stringify(formattedTicket));
}
