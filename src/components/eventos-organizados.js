import React, { useEffect, useState } from 'react';

function EventosOrganizados() {
  const idOrganizador = Number(localStorage.getItem("idUsuario"));
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    async function carregarEventos() {
      try {
        const res = await fetch(`https://my-json-server.typicode.com/castrothais/jsonfake/evento`);
        const todosEventos = await res.json();

        const meusEventos = todosEventos.filter(ev => ev.idOrganizador === idOrganizador);
        setEventos(meusEventos);

      } catch (error) {
        console.error("Erro ao buscar eventos organizados:", error);
      }
    }

    if (idOrganizador) {
      carregarEventos();
    }
  }, [idOrganizador]);

  return (
    <div>
      <h2>Eventos Organizados</h2>

      {eventos.length === 0 ? (
        <p>Você ainda não está organizando nenhum evento.</p>
      ) : (
        <ul>
          {eventos.map(ev => (
            <li key={ev.id}>
              {ev.nomeEvento} — {ev.dataInicio}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EventosOrganizados;
