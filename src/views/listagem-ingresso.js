import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/card";
import "../custom.css";
import axios from "axios";
import { BASE_URL, BASE_URL_S } from "../config/axios";

const baseURLEvento = `${BASE_URL}/evento`;
const baseURLIngresso = `${BASE_URL_S}/ingresso`;
const baseURLParticipanteCPF = `${BASE_URL_S}/participanteCPF`;
const baseURLParticipanteCNPJ = `${BASE_URL_S}/participanteCNPJ`;


function ListagemIngressos() {
  const { idParam } = useParams();
  const idParticipante = Number(localStorage.getItem("idUsuario"));
  const [ingressosExibidos, setIngressosExibidos] = useState([]);

  useEffect(() => {
  async function carregarIngressos() {
    try {
      const [resEventos, resIngressos] = await Promise.all([
        axios.get(baseURLEvento),
        axios.get(baseURLIngresso),
      ]);

      const eventos = resEventos.data;
      const ingressos = resIngressos.data;

      let nomeParticipante = '';

      try {
        const respCPF = await axios.get(
          `${baseURLParticipanteCPF}/${idParticipante}`
        );
        nomeParticipante = respCPF.data.nome;
      } catch {
        const respCNPJ = await axios.get(
          `${baseURLParticipanteCNPJ}/${idParticipante}`
        );
        nomeParticipante = respCNPJ.data.razaoSocial;
      }

      const meusIngressos = ingressos.filter(
        (i) =>
          Number(i.idEvento) === Number(idParam) &&
          !i.cancelado &&
          i.pago &&
          (
            (i.idParticipanteCPF &&
              Number(i.idParticipanteCPF) === idParticipante) ||
            (i.idParticipanteCNPJ &&
              Number(i.idParticipanteCNPJ) === idParticipante)
          )
      );

      const ingressosCompletos = meusIngressos.map((ing) => {
        const evento = eventos.find(
          (ev) => Number(ev.id) === Number(ing.idEvento)
        );

        return {
          codigoIngresso: ing.codigoIngresso,
          nomeParticipante,
          nomeEvento: evento?.nomeEvento,
          dataHoraEmissao: `${ing.dataCompra} ${ing.horaCompra}`,
          dataHoraEvento: `${evento?.dataInicio} ${evento?.horaInicio}`,
          valor: ing.valor,
        };
      });

      setIngressosExibidos(ingressosCompletos);
    } catch (err) {
      console.error("Erro ao carregar ingressos:", err);
    }
  }

  carregarIngressos();
}, [idParticipante, idParam]);


  return (
    <div className="container">
      <Card title="Ingressos para Impressão">
        {ingressosExibidos.length === 0 ? (
          <p>Você não possui ingressos disponíveis.</p>
        ) : (
          <div className="row">
            <div className="col-lg-12">
              <div className="bs-component">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nome Participante</th>
                      <th>Evento</th>
                      <th>Emissão</th>
                      <th>Data do Evento</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingressosExibidos.map((ing, index) => (
                      <tr key={index}>
                        <td>{ing.codigoIngresso}</td>
                        <td>{ing.nomeParticipante}</td>
                        <td>{ing.nomeEvento}</td>
                        <td>{ing.dataHoraEmissao}</td>
                        <td>{ing.dataHoraEvento}</td>
                        <td>R$ {ing.valor}</td>
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

export default ListagemIngressos;
