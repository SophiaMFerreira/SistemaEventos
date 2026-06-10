import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Stack, Button, Typography } from "@mui/material";
import Card from "../components/card";
import { BASE_URL} from "../config/axios";
import axios from "axios";

function DetalhesEventoOrganizador() {
  const { idParam } = useParams();
  const [evento, setEvento] = useState(null);
  const [ingressos, setIngressos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarEvento() {
      try {
        const respEvento = await axios.get(`${BASE_URL}/eventos/${idParam}`);
        setEvento(respEvento.data);

        const respIngressos = await axios.get(`${BASE_URL}/ingressos`);
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

 const formatarDataHora = (dataHora) => {
  return new Date(dataHora).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

  return (
    <div className="container" style={{ marginTop: '120px' }}>
      <Card title={`Detalhes do Evento:`}>
        <Stack spacing={2} direction="row">
            <Stack spacing={1} sx={{ flex: 1 }}>
            <Typography variant="h5">{evento.nome}</Typography>
            <Typography><strong>Vagas:</strong> {ingressos.length}/{evento.lotacaoMaxima}</Typography>
            <Typography><strong>Tipo de evento:</strong> {evento.nomeTipoEvento}</Typography>
            <Typography><strong>Modalidade:</strong> {evento.modalidade}</Typography>
            <Typography><strong>Data/hora início:</strong> {formatarDataHora(evento.dataHoraInicio)}</Typography>
            <Typography><strong>Data/hora fim:</strong> {formatarDataHora(evento.dataHoraFim)}</Typography>
            <Typography><strong>Descrição:</strong> {evento.descricao}</Typography>
            <Typography><strong>CEP:</strong> {evento.endereco.cep}</Typography>
            <Typography><strong>Endereço:</strong> {`${evento.endereco.logradouro}, ${evento.endereco.numero} ${evento.endereco.complemento}`}</Typography>
            <Typography><strong>Bairro:</strong> {evento.endereco.bairro}</Typography>
            <Typography><strong>Cidade:</strong> {evento.endereco.cidade}</Typography>
            <Typography><strong>Estado:</strong> {evento.endereco.estado}</Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={() => navigate("/eventos-organizados")}>Voltar</Button>
          <Button variant="contained" color="warning" onClick={() => navigate(`/listagem-participantes/${idParam}`)}>Ver participantes</Button>
        </Stack>
      </Card>
    </div>
  );
}

export default DetalhesEventoOrganizador;
