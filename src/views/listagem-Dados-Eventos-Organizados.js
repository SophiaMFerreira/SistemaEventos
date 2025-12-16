import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Stack, Box, Typography } from "@mui/material";
import Card from "../components/card";
import { BASE_URL, BASE_URL_S } from "../config/axios";
import axios from "axios";

function DetalhesEventoOrganizador() {
  const { idParam } = useParams();
  const [evento, setEvento] = useState(null);
  const [ingressos, setIngressos] = useState([]);

  useEffect(() => {
    async function carregarEvento() {
      try {
        const respEvento = await axios.get(`${BASE_URL}/evento/${idParam}`);
        setEvento(respEvento.data);

        const respIngressos = await axios.get(`${BASE_URL_S}/ingresso`);
        const ingressosEvento = respIngressos.data.filter(
          (i) => Number(i.idEvento) === Number(idParam) && !i.cancelado && i.pago
        );
        setIngressos(ingressosEvento);
      } catch (err) {
        console.error("Erro ao carregar evento:", err);
      }
    }

    carregarEvento();
  }, [idParam]);

  if (!evento) return <p>Carregando detalhes do evento...</p>;

  const vagasDisponiveis = evento.lotacaoMaxima - ingressos.length;

  return (
    <div className="container" style={{ marginTop: '120px' }}>
      <Card title={`Detalhes do Evento:`}>
        <Stack spacing={2} direction="row">
            <Stack spacing={1} sx={{ flex: 1 }}>
            <Typography variant="h5">{evento.nomeEvento}</Typography>
            <Typography><strong>Vagas:</strong>{ingressos.length}/{evento.lotacaoMaxima}</Typography>
            <Typography><strong>Tipo de evento:</strong> {evento.tipoEvento}</Typography>
            <Typography><strong>Modalidade:</strong> {evento.modalidade}</Typography>
            <Typography><strong>Data/hora início:</strong> {evento.dataInicio} {evento.horaInicio}</Typography>
            <Typography><strong>Data/hora fim:</strong> {evento.dataFim} {evento.horaFim}</Typography>
            <Typography><strong>Descrição:</strong> {evento.descricao}</Typography>
            <Typography><strong>CEP:</strong> {evento.cep}</Typography>
            <Typography><strong>Endereço:</strong> {`${evento.logradouro}, ${evento.numero} ${evento.complemento}`}</Typography>
            <Typography><strong>Bairro:</strong> {evento.bairro}</Typography>
            <Typography><strong>Cidade:</strong> {evento.cidade}</Typography>
            <Typography><strong>Estado:</strong> {evento.estado}</Typography>
          </Stack>
        </Stack>
      </Card>
    </div>
  );
}

export default DetalhesEventoOrganizador;
