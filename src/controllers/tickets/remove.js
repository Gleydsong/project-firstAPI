export function remove({ req, res, database }) {
  const { id } = req.params;

  const deletedTicket = database.delete("tickets", id);

  if (!deletedTicket) {
    return res
      .writeHead(404)
      .end(JSON.stringify({ error: "Ticket not found" }));
  }

  return res.writeHead(200).end(
    JSON.stringify({
      message: "Ticket deleted successfully",
      deletedTicket: {
        id: deletedTicket.id,
        equipment: deletedTicket.equipment,
        user_name: deletedTicket.user_name,
      },
    })
  );
}
