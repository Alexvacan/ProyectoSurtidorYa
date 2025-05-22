export default function filtrarTickets(tickets, criterio) {
  return tickets.filter(ticket =>
    ticket.numero.toLowerCase().includes(criterio.toLowerCase()) ||
    ticket.nombre.toLowerCase().includes(criterio.toLowerCase())
  );
}
