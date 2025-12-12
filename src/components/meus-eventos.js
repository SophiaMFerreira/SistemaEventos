import React, { useEffect, useState } from "react";
import BuscarEvento from "./input-buscar-evento";
import Card from "./card";
import { BASE_URL, BASE_URL_S } from "../config/axios";

const baseURL = `${BASE_URL}/evento`;
const baseURLIngresso = `${BASE_URL_S}/ingresso`;

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
      const resEventos = await fetch(baseURL);
      const eventos = await resEventos.json();

      const resIngressos = await fetch(baseURLIngresso);
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
}, [idParticipante, baseURL, baseURLIngresso]);


  return (
  <div>
    <Card title='Meus Eventos'>
      <BuscarEvento
        value={filtro}
        onChange={setFiltro}
        placeholder="Digite nome do evento"
      />

      {eventosFiltrados.length === 0 ? (
        <p>Você ainda não está inscrito em nenhum evento.</p>
      ) : (
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>Nome</th>
                    <th scope='col'>Data Início</th>
                    <th scope='col'>Data Fim</th>
                    <th scope='col'>Hora</th>
                    <th scope='col'>Cidade</th>
                  </tr>
                </thead>
                <tbody>
                  {eventosFiltrados.map((ev) => (
                    <tr key={ev.id}>
                      <td>{ev.nomeEvento}</td>
                      <td>{new Date(ev.dataInicio).toLocaleDateString('pt-BR')}</td>
                      <td>{new Date(ev.dataFim).toLocaleDateString('pt-BR')}</td>
                      <td>{ev.horaInicio}</td>
                      <td>{ev.cidade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Card>
  </div>
);
}

export default MeusEventos;
