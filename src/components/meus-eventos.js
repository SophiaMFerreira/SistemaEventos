import React, { useEffect, useState } from "react";

function MeusEventos() {
  const idParticipante = Number(localStorage.getItem("idUsuario"));
  const [eventosInscritos, setEventosInscritos] = useState([]);

  useEffect(() => {
    async function carregarEventos() {
      try {
        const resEventos = await fetch(
          `https://my-json-server.typicode.com/castrothais/jsonfake/evento`
        );
        const eventos = await resEventos.json();

        const resIngressos = await fetch(
          "https://my-json-server.typicode.com/SophiaMFerreira/jsonfake/ingresso"
        );
        const ingressos = await resIngressos.json();

        const meusIngressos = ingressos.filter(i =>
          Number(i.idParticipanteCPF) === idParticipante ||
          Number(i.idParticipanteCNPJ) === idParticipante
        );

        const eventosDoParticipante = eventos.filter(ev =>
          meusIngressos.some(i => Number(i.idEvento) === ev.id)
        );

        setEventosInscritos(eventosDoParticipante);
      } catch (err) {
        console.error("Erro ao buscar eventos inscritos:", err);
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
