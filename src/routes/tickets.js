import { create } from "../controllers/tickets/create.js";
import { index } from "../controllers/tickets/index.js";
import { show } from "../controllers/tickets/show.js";
import { update } from "../controllers/tickets/update.js";
import { updateStatus } from "../controllers/tickets/updateStatus.js";
import { patch } from "../controllers/tickets/patch.js";
import { remove } from "../controllers/tickets/remove.js";
import { getStatusHistory } from "../controllers/tickets/getStatusHistory.js";
import { addSolution } from "../controllers/tickets/addSolution.js";
import { resolveTicket } from "../controllers/tickets/resolveTicket.js";

export const tickets = [
  {
    method: "POST",
    path: "/tickets",
    controller: create,
  },

  {
    method: "GET",
    path: "/tickets",
    controller: index,
  },

  {
    method: "GET",
    path: "/tickets/:id",
    controller: show,
  },

  {
    method: "PUT",
    path: "/tickets/:id",
    controller: update,
  },

  {
    method: "PATCH",
    path: "/tickets/:id",
    controller: patch,
  },

  {
    method: "PATCH",
    path: "/tickets/:id/status",
    controller: updateStatus,
  },

  {
    method: "PATCH",
    path: "/tickets/:id/solution",
    controller: addSolution,
  },

  {
    method: "POST",
    path: "/tickets/:id/resolve",
    controller: resolveTicket,
  },

  {
    method: "GET",
    path: "/tickets/:id/history",
    controller: getStatusHistory,
  },

  {
    method: "DELETE",
    path: "/tickets/:id",
    controller: remove,
  },
];
