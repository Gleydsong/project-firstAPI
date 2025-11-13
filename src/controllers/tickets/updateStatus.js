import {
  formatTicketResponse,
  isValidStatusTransition,
  addStatusToHistory,
} from "../../utils/ticketUtils.js";

export function updateStatus({ req, res, database }) {
  if (!req.body) {
    return res
      .writeHead(400)
      .end(JSON.stringify({ error: "Invalid JSON body" }));
  }

  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res
      .writeHead(400)
      .end(JSON.stringify({ error: "Status is required" }));
  }

  if (!["open", "in_progress", "closed"].includes(status)) {
    return res.writeHead(400).end(
      JSON.stringify({
        error: "Invalid status. Must be: open, in_progress, or closed",
      })
    );
  }

  // Busca o ticket existente
  const tickets = database.select("tickets");
  const existingTicket = tickets.find((ticket) => ticket.id === id);

  if (!existingTicket) {
    return res
      .writeHead(404)
      .end(JSON.stringify({ error: "Ticket not found" }));
  }

  // Valida transição de status
  if (!isValidStatusTransition(existingTicket.status, status)) {
    return res.writeHead(400).end(
      JSON.stringify({
        error: `Invalid status transition from '${existingTicket.status}' to '${status}'`,
        message:
          "Closed tickets cannot be changed. You can only move from open ↔ in_progress or to closed.",
      })
    );
  }

  // Se o status não mudou, retorna sem fazer nada
  if (existingTicket.status === status) {
    return res.writeHead(200).end(
      JSON.stringify({
        message: "Status is already set to the requested value",
        ticket: formatTicketResponse(existingTicket),
      })
    );
  }

  // Prepara dados para atualização
  const updateData = {
    status,
    updated_at: new Date(),
  };

  // Adiciona ao histórico de status
  const ticketWithHistory = addStatusToHistory(existingTicket, status);
  updateData.status_history = ticketWithHistory.status_history;

  const updatedTicket = database.update("tickets", id, updateData);

  if (!updatedTicket) {
    return res
      .writeHead(500)
      .end(JSON.stringify({ error: "Failed to update ticket status" }));
  }

  const formattedTicket = formatTicketResponse(updatedTicket);
  return res.end(
    JSON.stringify({
      message: `Ticket status updated from '${existingTicket.status}' to '${status}'`,
      ticket: formattedTicket,
      transition: {
        from: existingTicket.status,
        to: status,
        timestamp: updateData.updated_at,
      },
    })
  );
}
