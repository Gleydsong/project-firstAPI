import {
  validateTicketData,
  formatTicketResponse,
} from "../../utils/ticketUtils.js";

export function patch({ req, res, database }) {
  if (!req.body) {
    return res
      .writeHead(400)
      .end(JSON.stringify({ error: "Invalid JSON body" }));
  }

  const { id } = req.params;

  // Busca o ticket existente
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

  // Coleta apenas os campos que foram enviados
  const allowedFields = ["equipment", "description", "user_name", "status"];
  const updateData = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  if (Object.keys(updateData).length === 0) {
    return res.writeHead(400).end(
      JSON.stringify({
        error: "No valid fields provided for update",
      })
    );
  }

  // Validação apenas dos campos que serão atualizados
  const tempTicket = { ...existingTicket, ...updateData };
  const validation = validateTicketData(tempTicket);

  if (!validation.isValid) {
    return res.writeHead(400).end(
      JSON.stringify({
        error: "Validation failed",
        details: validation.errors,
      })
    );
  }

  const updatedTicket = database.update("tickets", id, updateData);

  if (!updatedTicket) {
    return res
      .writeHead(404)
      .end(JSON.stringify({ error: "Failed to update ticket" }));
  }

  const formattedTicket = formatTicketResponse(updatedTicket);
  return res.end(
    JSON.stringify({
      message: "Ticket updated successfully",
      ticket: formattedTicket,
      updatedFields: Object.keys(updateData),
    })
  );
}
