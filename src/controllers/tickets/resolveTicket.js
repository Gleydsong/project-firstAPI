import {
  formatTicketResponse,
  isValidStatusTransition,
  addStatusToHistory,
} from "../../utils/ticketUtils.js";

export function resolveTicket({ req, res, database }) {
  if (!req.body) {
    return res
      .writeHead(400)
      .end(JSON.stringify({ error: "Invalid JSON body" }));
  }

  const { id } = req.params;
  const { solution, resolved_by } = req.body;

  if (
    !solution ||
    typeof solution !== "string" ||
    solution.trim().length === 0
  ) {
    return res.writeHead(400).end(
      JSON.stringify({
        error: "Solution is required and must be a non-empty string",
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

  // Verifica se já está resolvido
  if (existingTicket.status === "closed") {
    return res.writeHead(400).end(
      JSON.stringify({
        error: "Ticket is already closed",
      })
    );
  }

  // Valida transição para closed
  if (!isValidStatusTransition(existingTicket.status, "closed")) {
    return res.writeHead(400).end(
      JSON.stringify({
        error: `Cannot resolve ticket with status '${existingTicket.status}'`,
      })
    );
  }

  // Prepara dados para atualização
  const updateData = {
    status: "closed",
    solution: solution.trim(),
    resolved_at: new Date(),
    updated_at: new Date(),
  };

  if (resolved_by) {
    updateData.resolved_by = resolved_by;
  } else if (existingTicket.user_name) {
    updateData.resolved_by = existingTicket.user_name;
  }

  // Adiciona mudança de status ao histórico
  const ticketWithHistory = addStatusToHistory(existingTicket, "closed");
  updateData.status_history = ticketWithHistory.status_history;

  const updatedTicket = database.update("tickets", id, updateData);

  if (!updatedTicket) {
    return res
      .writeHead(500)
      .end(JSON.stringify({ error: "Failed to resolve ticket" }));
  }

  const formattedTicket = formatTicketResponse(updatedTicket);
  return res.end(
    JSON.stringify({
      message: "Ticket resolved successfully",
      ticket: formattedTicket,
      resolution: {
        solution: solution.trim(),
        resolved_by: updateData.resolved_by,
        resolved_at: updateData.resolved_at,
      },
    })
  );
}
