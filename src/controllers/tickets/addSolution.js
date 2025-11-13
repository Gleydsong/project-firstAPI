import { formatTicketResponse } from "../../utils/ticketUtils.js";

export function addSolution({ req, res, database }) {
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

  // Só permite adicionar solução se o ticket estiver fechado ou em andamento
  if (existingTicket.status === "open") {
    return res.writeHead(400).end(
      JSON.stringify({
        error:
          "Cannot add solution to open ticket. Please update status to 'in_progress' or 'closed' first",
      })
    );
  }

  // Verifica se já existe solução
  if (existingTicket.solution) {
    return res.writeHead(400).end(
      JSON.stringify({
        error:
          "Ticket already has a solution. Use PATCH /tickets/:id to update it",
      })
    );
  }

  // Prepara dados para atualização
  const updateData = {
    solution: solution.trim(),
    resolved_at: new Date(),
    updated_at: new Date(),
  };

  if (resolved_by) {
    updateData.resolved_by = resolved_by;
  }

  // Se não especificou resolved_by, usa o user_name do ticket
  if (!resolved_by && existingTicket.user_name) {
    updateData.resolved_by = existingTicket.user_name;
  }

  const updatedTicket = database.update("tickets", id, updateData);

  if (!updatedTicket) {
    return res
      .writeHead(500)
      .end(JSON.stringify({ error: "Failed to add solution" }));
  }

  const formattedTicket = formatTicketResponse(updatedTicket);
  return res.end(
    JSON.stringify({
      message: "Solution added successfully",
      ticket: formattedTicket,
    })
  );
}
