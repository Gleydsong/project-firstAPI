/**
 * Utilitários para trabalhar com dados de tickets
 */

import { randomUUID } from "node:crypto";

/**
 * Valida os dados de um ticket
 * @param {Object} ticketData - Dados do ticket a validar
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export function validateTicketData(ticketData) {
  const errors = [];

  if (!ticketData.equipment || typeof ticketData.equipment !== "string") {
    errors.push("Equipment é obrigatório e deve ser uma string");
  }

  if (!ticketData.description || typeof ticketData.description !== "string") {
    errors.push("Description é obrigatório e deve ser uma string");
  }

  if (!ticketData.user_name || typeof ticketData.user_name !== "string") {
    errors.push("User name é obrigatório e deve ser uma string");
  }

  if (
    ticketData.status &&
    !["open", "in_progress", "closed"].includes(ticketData.status)
  ) {
    errors.push("Status deve ser: open, in_progress ou closed");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Formata um ticket para resposta da API
 * @param {Object} ticket - Ticket do banco de dados
 * @returns {Object} - Ticket formatado
 */
export function formatTicketResponse(ticket) {
  return {
    id: ticket.id,
    equipment: ticket.equipment,
    description: ticket.description,
    user_name: ticket.user_name,
    status: ticket.status || "open",
    solution: ticket.solution || null,
    resolved_by: ticket.resolved_by || null,
    resolved_at: ticket.resolved_at || null,
    created_at: ticket.created_at,
    updated_at: ticket.updated_at,
    status_history: ticket.status_history || [],
  };
}

/**
 * Calcula estatísticas dos tickets
 * @param {Array} tickets - Array de tickets
 * @returns {Object} - Estatísticas
 */
export function calculateTicketStats(tickets) {
  const stats = {
    total: tickets.length,
    open: 0,
    in_progress: 0,
    closed: 0,
    byEquipment: {},
  };

  tickets.forEach((ticket) => {
    // Conta por status
    stats[ticket.status || "open"]++;

    // Conta por equipamento
    const equipment = ticket.equipment;
    stats.byEquipment[equipment] = (stats.byEquipment[equipment] || 0) + 1;
  });

  return stats;
}

/**
 * Filtra tickets por critérios específicos
 * @param {Array} tickets - Array de tickets
 * @param {Object} filters - Filtros a aplicar
 * @returns {Array} - Tickets filtrados
 */
export function filterTickets(tickets, filters) {
  return tickets.filter((ticket) => {
    // Filtro por status
    if (filters.status && ticket.status !== filters.status) {
      return false;
    }

    // Filtro por equipamento
    if (
      filters.equipment &&
      !ticket.equipment.toLowerCase().includes(filters.equipment.toLowerCase())
    ) {
      return false;
    }

    // Filtro por usuário
    if (
      filters.user_name &&
      !ticket.user_name.toLowerCase().includes(filters.user_name.toLowerCase())
    ) {
      return false;
    }

    // Filtro por data de criação (YYYY-MM-DD)
    if (filters.created_after) {
      const ticketDate = new Date(ticket.created_at);
      const filterDate = new Date(filters.created_after);
      if (ticketDate < filterDate) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Cria um novo ticket com valores padrão
 * @param {Object} ticketData - Dados básicos do ticket
 * @returns {Object} - Ticket completo
 */
export function createTicketObject(ticketData) {
  const now = new Date();

  return {
    id: ticketData.id || randomUUID(),
    equipment: ticketData.equipment,
    description: ticketData.description,
    user_name: ticketData.user_name,
    status: ticketData.status || "open",
    created_at: ticketData.created_at || now,
    updated_at: ticketData.updated_at || now,
  };
}

/**
 * Valida se uma transição de status é permitida
 * @param {string} currentStatus - Status atual
 * @param {string} newStatus - Novo status
 * @returns {boolean} - Se a transição é válida
 */
export function isValidStatusTransition(currentStatus, newStatus) {
  const allowedTransitions = {
    open: ["in_progress", "closed"],
    in_progress: ["open", "closed"],
    closed: [], // Status final, não pode ser alterado
  };

  return allowedTransitions[currentStatus]?.includes(newStatus) || false;
}

/**
 * Adiciona entrada no histórico de status do ticket
 * @param {Object} ticket - Ticket atual
 * @param {string} newStatus - Novo status
 * @returns {Object} - Ticket com histórico atualizado
 */
export function addStatusToHistory(ticket, newStatus) {
  const historyEntry = {
    status: newStatus,
    changed_at: new Date(),
    previous_status: ticket.status,
  };

  if (!ticket.status_history) {
    ticket.status_history = [];
  }

  ticket.status_history.push(historyEntry);
  return ticket;
}
