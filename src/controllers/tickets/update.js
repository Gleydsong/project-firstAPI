import {
  validateTicketData,
  formatTicketResponse,
} from "../../utils/ticketUtils.js";

export function update({ req, res, database }) {
  if (!req.body) {
    return res
      .writeHead(400)
      .end(JSON.stringify({ error: "Invalid JSON body" }));
  }

  const { id } = req.params;

  // Busca o ticket existente para validação
  const tickets = database.select("tickets");
  const existingTicket = tickets.find((ticket) => ticket.id === id);

  if (!existingTicket) {
    return res
      .writeHead(404)
      .end(JSON.stringify({ error: "Ticket not found" }));
  }

  // Verifica se pode atualizar
  if (!canUpdateTicket(existingTicket, req.body)) {
    return res.writeHead(400).end(
      JSON.stringify({
        error: "Cannot update closed ticket",
      })
    );
  }

  const { equipment, description, user_name, status } = req.body;

  const allowedFields = { equipment, description, user_name, status };
  const updateData = Object.fromEntries(
    Object.entries(allowedFields).filter(([_, value]) => value !== undefined)
  );

  if (Object.keys(updateData).length === 0) {
    return res
      .writeHead(400)
      .end(JSON.stringify({ error: "No valid fields to update" }));
  }

  const updatedTicket = database.update("tickets", id, updateData);

  if (!updatedTicket) {
    return res
      .writeHead(404)
      .end(JSON.stringify({ error: "Ticket not found" }));
  }

  const formattedTicket = formatTicketResponse(updatedTicket);
  return res.end(JSON.stringify(formattedTicket));
}
