import { formatTicketResponse } from "../../utils/ticketUtils.js";

export function show({ req, res, database }) {
  const { id } = req.params;

  const tickets = database.select("tickets");
  const ticket = tickets.find((ticket) => ticket.id === id);

  if (!ticket) {
    return res
      .writeHead(404)
      .end(JSON.stringify({ error: "Ticket not found" }));
  }

  const formattedTicket = formatTicketResponse(ticket);
  return res.end(JSON.stringify(formattedTicket));
}
