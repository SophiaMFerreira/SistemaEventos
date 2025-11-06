import React, { useEffect, useState } from 'react';

function MeusEventos({ idParticipante }) {
  const [eventosInscritos, setEventosInscritos] = useState([]);

  useEffect(() => {
    async function carregarEventos() {
      try {
        const resEventos = await fetch(`https://my-json-server.typicode.com/castrothais/jsonfake/evento`);
        const eventos = await resEventos.json();

        const resPresencas = await fetch(`https://my-json-server.typicode.com/castrothais/jsonfake/presenca`);
        const presencas = await resPresencas.json();

        const minhasPresencas = presencas.filter(p => p.idParticipante === idParticipante && p.presenca === true);

        const eventosDoParticipante = eventos.filter(ev => 
          minhasPresencas.some(p => p.idEvento === ev.id)
        );

        setEventosInscritos(eventosDoParticipante);
      } catch (err) {
        console.error('Erro ao buscar eventos inscritos:', err);
      }
    }

    carregarEventos();
  }, [idParticipante]);

  return (
    <div>
      <h2>Meus Eventos</h2>
      {eventosInscritos.length === 0 ? (
        <p>Você ainda não está inscrito em nenhum evento.</p>
      ) : (
        <ul>
          {eventosInscritos.map(ev => (
            <li key={ev.id}>
              {ev.nomeEvento} — {ev.dataInicio}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MeusEventos;
