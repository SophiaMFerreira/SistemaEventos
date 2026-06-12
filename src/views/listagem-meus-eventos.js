import React, { useEffect, useState } from "react";
import { BASE_URL} from "../config/axios";
import BuscarEvento from "../components/input-buscar-evento";
import Card from "../components/card";
import { useNavigate } from "react-router-dom";

const baseURL = `${BASE_URL}/eventos`;
const baseURLIngresso = `${BASE_URL}/ingressos`;

function MeusEventos() {
  const navigate = useNavigate();
  const idParticipante = Number(localStorage.getItem("idUsuario"));
  const [eventosInscritos, setEventosInscritos] = useState([]);
  const [filtro, setFiltro] = React.useState("");
  
  const eventosFiltrados = eventosInscritos.filter(ev =>
  ev.nome?.toLowerCase().includes(filtro.toLowerCase())
);


  useEffect(() => {
  async function carregarEventos() {
    try {
      const resEventos = await fetch(baseURL);
      const eventos = await resEventos.json();

      const resIngressos = await fetch(baseURLIngresso);
      const ingressos = await resIngressos.json();
console.log("INGRESSOS:", ingressos);

 const meusIngressos = ingressos.filter(
  i => Number(i.idParticipante) === idParticipante
);

console.log("MEUS INGRESSOS:", meusIngressos);

 const eventosDoParticipante = eventos.filter(ev =>
  meusIngressos.some(i => Number(i.idEvento) === ev.id)
);

console.log("EVENTOS:", eventos);
console.log("EVENTOS DO PARTICIPANTE:", eventosDoParticipante);

      setEventosInscritos(eventosDoParticipante);
    } catch (err) {
      console.error("Erro ao buscar eventos inscritos:", err);
    }
  }

  carregarEventos();
}, [idParticipante, baseURL, baseURLIngresso]);


  return (
  <div className='container' style={{ marginTop: '120px' }}>
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
                    <tr key={ev.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/meus-eventos/${ev.id}`)}

                    >
                      <td>{ev.nome}</td>

                  <td>
                    {new Date(ev.dataHoraInicio).toLocaleDateString("pt-BR")}
                  </td>

                  <td>
                    {new Date(ev.dataHoraFim).toLocaleDateString("pt-BR")}
                  </td>

                  <td>
                    {new Date(ev.dataHoraInicio).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </td>

                  <td>{ev.endereco?.cidade}</td>
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
