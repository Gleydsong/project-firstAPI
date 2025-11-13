export function getStatusHistory({ req, res, database }) {
  const { id } = req.params;

  const tickets = database.select("tickets");
  const ticket = tickets.find((ticket) => ticket.id === id);

  if (!ticket) {
    return res
      .writeHead(404)
      .end(JSON.stringify({ error: "Ticket not found" }));
  }

  const history = ticket.status_history || [];

  return res.end(
    JSON.stringify({
      ticket_id: ticket.id,
      current_status: ticket.status,
      status_history: history,
      total_changes: history.length,
    })
  );
}
