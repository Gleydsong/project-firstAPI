export const tickets = [
  {
    method : "POST",
    path   : "/tickets",
    controller: (req, res) => {
      res.end(JSON.stringify({ message: "List of tickets" }));
    }
  }
];