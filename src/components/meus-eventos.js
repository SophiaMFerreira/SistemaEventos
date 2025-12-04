import React, { useEffect, useState } from "react";
import BuscarEvento from "./input-buscar-evento";

function MeusEventos() {
  const idParticipante = Number(localStorage.getItem("idUsuario"));
  const [eventosInscritos, setEventosInscritos] = useState([]);
  const [filtro, setFiltro] = React.useState("");
  
  const eventosFiltrados = eventosInscritos.filter(ev =>
  ev.nomeEvento.toLowerCase().includes(filtro.toLowerCase())
    );


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

       <BuscarEvento
            value={filtro}
            onChange={setFiltro}
            placeholder="Digite nome do evento"
          />

      {eventosFiltrados.length === 0 ? (
        <p>Você ainda não está inscrito em nenhum evento.</p>
      ) : (
        <ul>
          {eventosFiltrados.map(ev => {
            const data = new Date(ev.dataInicio);
            const dia = String(data.getDate()).padStart(2, "0");
            const mes = data.toLocaleString("pt-BR", { month: "long" });

            return (
              <li key={ev.id}>
                <strong>{ev.nomeEvento}</strong> — {dia} de {mes} — {ev.cidade}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default MeusEventos;
