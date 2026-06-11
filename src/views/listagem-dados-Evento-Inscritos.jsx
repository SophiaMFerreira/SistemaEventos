import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mensagemErro, mensagemSucesso } from "../components/toastr";
import {
  Typography,
  Stack,
  Button,
  Box,
  Modal,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import BoxInfoEvento from "../components/box-info-evento";
import "../style/listagemDadosEvento.css";
import imagemEventoBale from "../components/eventoBale.jpg";

import axios from 'axios';
import { BASE_URL} from '../config/axios';

function ListagemDadosEvento() {
  const baseURL = `${BASE_URL}/eventos`;
  const baseURLingresso = `${BASE_URL}/ingressos`;
  const { idParam } = useParams();
  const navigate = useNavigate();

  const idParticipante = Number(localStorage.getItem("idUsuario"));
  const tipoParticipante = localStorage.getItem("tipoParticipante");

  const [evento, setEvento] = useState({});
  const [ingresso, setIngresso] = useState(null);
  const [inscrito, setInscrito] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [tipoIngresso, setTipoIngresso] = useState("inteira");

  useEffect(() => {
  async function carregarDados() {
    try {
      const eventoRes = await axios.get(`${baseURL}/${idParam}`);
      setEvento(eventoRes.data);

      const ingressosRes = await axios.get(baseURLingresso);
      const ingressos = ingressosRes.data;
      console.log("INGRESSOS:", ingressos);
console.log("ID EVENTO:", idParam);
console.log("ID PARTICIPANTE:", idParticipante);

      const encontrado = ingressos.find(
  (i) =>
    Number(i.idEvento) === Number(idParam) &&
    Number(i.idParticipante) === idParticipante
);
console.log("INGRESSO ENCONTRADO:", encontrado);

      if (encontrado) {
        setIngresso(encontrado);
        setInscrito(true);
      }
    } catch (error) {
      console.error(error);
      mensagemErro("Erro ao carregar evento");
    }
  }

  carregarDados();

}, [idParam]);

  const formatarData = (dataHora) => {
  if (!dataHora) return "";

  return new Date(dataHora).toLocaleDateString("pt-BR");
};

const formatarHora = (dataHora) => {
  if (!dataHora) return "";

  return new Date(dataHora).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

  async function inscrever() {
  try {

    const novoIngresso = {
      status: "RESERVADO",
      valor: 0,
      taxa: 0,
      idParticipante: idParticipante,
      idEvento: evento.id
    };

    const res = await axios.post(baseURLingresso, novoIngresso);

    setIngresso(res.data);
    setInscrito(true);

    mensagemSucesso("Inscrição realizada com sucesso!");

  } catch (error) {
    console.error(error);

    mensagemErro(
      error.response?.data || "Erro ao realizar inscrição"
    );
  }
}

  async function realizarPagamento() {
    try {
      const valorDoEvento = Number(evento.valorIngresso) || 0;
      const valorFinal = tipoIngresso === "meia"
        ? valorDoEvento / 2
        : valorDoEvento;

      await axios.patch(
        `${baseURLingresso}/${ingresso.id}/pagamento`,
        {
          valor: valorFinal,
          tipoIngresso: tipoIngresso
        }
      );

      setIngresso({
        ...ingresso,
        status: "PAGO",
        valor: valorFinal,
        tipoIngresso: tipoIngresso 
      });
      
      setOpenModal(false);
      mensagemSucesso("Pagamento salvo com sucesso");

    } catch(error) {
      console.error("ERRO PAGAMENTO:", error);
      mensagemErro("Não foi possível processar o pagamento. Tente novamente.");
    }
  }

  return (
    <Stack
      spacing={4}
      sx={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: 4,
      }}
    >
      <Typography variant="h4" fontWeight={600}>
        Detalhes do evento
      </Typography>

      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          padding: 4,
        }}
      >
        <BoxInfoEvento
  nomeEvento={evento.nome}
  dataInicioEvento={evento.dataHoraInicio}
  dataFimEvento={evento.dataHoraFim}
  cep={evento.endereco?.cep}
  logradouro={evento.endereco?.logradouro}
  bairro={evento.endereco?.bairro}
  cidade={evento.endereco?.cidade}
  estado={evento.endereco?.estado}
  numero={evento.endereco?.numero}
  complemento={evento.endereco?.complemento}

  infoLateral="Dados evento"
  statusPagamento={ingresso?.status === "PAGO"}
/>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            mt: 3,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 260 }}>
            <Typography variant="body1">
              <strong>Modalidade:</strong> {evento.modalidade}
            </Typography>
            <Typography variant="body1" mt={1}>
  <strong>Tipo do evento:</strong> {evento.nomeTipoEvento}
</Typography>
            <Typography variant="body1" mt={1}>
  <strong>Valor do ingresso:</strong>{" "}
  {evento.valorIngresso == null
    ? "Não informado"
    : evento.valorIngresso === 0
      ? "Gratuito"
      : `R$ ${Number(evento.valorIngresso).toFixed(2)}`}
</Typography>

          </Box>

          <Box sx={{ flex: 1, minWidth: 260 }}>
            <Typography variant="body1" fontWeight={600}>
              Descrição
            </Typography>
            <Typography variant="body1">
              {evento.descricao}
            </Typography>
          </Box>
        </Box>

        <Box
          component="img"
          src={imagemEventoBale}
          sx={{
            width: "100%",
            maxHeight: 320,
            objectFit: "cover",
            borderRadius: 3,
            mt: 4,
          }}
        />

        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          mt={4}
          sx={{
            borderTop: "1px solid #eee",
            pt: 3,
          }}
        >
          <Button variant="outlined"  onClick={() => navigate("/meus-eventos")}>
            Voltar
          </Button>

          {!inscrito && (
            <Button variant="contained" onClick={inscrever}>
              Inscrever-se
            </Button>
          )}

          {inscrito && ingresso && ingresso.status !== "PAGO" && (
            <Button variant="contained" color="success" onClick={() => setOpenModal(true)}>
              Realizar pagamento
            </Button>
          )}

          {ingresso?.status === "PAGO" && ingresso.status !== "CANCELADO" && (
            <Button
              variant="contained"
              color="warning"
              onClick={() =>
                navigate(`/meus-eventos/${evento.id}/ingresso`)
              }
            >
              Emitir ingresso
            </Button>
          )}
        </Stack>
      </Box>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            background: "#fff",
            p: 4,
            borderRadius: 3,
            width: 320,
            mx: "auto",
            mt: "15%",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          <Typography variant="h6" fontWeight={600} mb={2}>
            Forma de pagamento
          </Typography>

          <RadioGroup
            value={tipoIngresso}
            onChange={(e) => setTipoIngresso(e.target.value)}
          >
            <FormControlLabel
              value="inteira"
              control={<Radio />}
              label="Inteira"
            />
            <FormControlLabel
              value="meia"
              control={<Radio />}
              label="Meia"
            />
          </RadioGroup>

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
            onClick={realizarPagamento}
          >
            Confirmar pagamento
          </Button>
        </Box>
      </Modal>
    </Stack>
  );
}

export default ListagemDadosEvento;
