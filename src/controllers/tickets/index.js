import {
  formatTicketResponse,
  filterTickets,
} from "../../utils/ticketUtils.js";

export function index({ req, res, database }) {
  let tickets = database.select("tickets");

  // Aplica filtros customizados usando as funções utilitárias
  const filters = {};
  if (req.query.status) filters.status = req.query.status;
  if (req.query.equipment) filters.equipment = req.query.equipment;
  if (req.query.user_name) filters.user_name = req.query.user_name;
  if (req.query.created_after) filters.created_after = req.query.created_after;

  if (Object.keys(filters).length > 0) {
    tickets = filterTickets(tickets, filters);
  }

  // Formata a resposta
  const formattedTickets = tickets.map(formatTicketResponse);

  return res.end(JSON.stringify(formattedTickets));
}
