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
import { BASE_URL, BASE_URL_S } from '../config/axios';

function ListagemDadosEvento() {
  const baseURL = `${BASE_URL}/evento`;
  const baseURLingresso = `${BASE_URL_S}/ingresso`;
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
      const eventoRes = await axios.get(`${baseURL}/${idParam}`);
      setEvento(eventoRes.data);

      const ingressosRes = await axios.get(baseURLingresso);
      const ingressos = ingressosRes.data;

      const encontrado = ingressos.find(i =>
        i.idEvento === Number(idParam) &&
        (
          (tipoParticipante === "cpf" && i.idParticipanteCPF === idParticipante) ||
          (tipoParticipante === "cnpj" && i.idParticipanteCNPJ === idParticipante)
        )
      );

      if (encontrado) {
        setIngresso(encontrado);
        setInscrito(true);
      }
    }
    carregarDados();
  }, [idParam]);

  async function inscrever() {
    const novoIngresso = {
      codigoIngresso: `ING-${Date.now()}`,
      dataCompra: new Date().toLocaleDateString(),
      horaCompra: new Date().toLocaleTimeString(),
      valor: 0,
      tipo: null,
      idEvento: evento.id,
      idParticipanteCPF: tipoParticipante === "cpf" ? idParticipante : null,
      idParticipanteCNPJ: tipoParticipante === "cnpj" ? idParticipante : null,
      cancelado: false,
      pago: false
    };

    const res = await axios.post(baseURLingresso, novoIngresso);
    setIngresso(res.data);
    setInscrito(true);
    mensagemSucesso("Inscrição realizada com sucesso");
  }

  async function realizarPagamento() {
    try {
        const valorFinal = tipoIngresso === "meia"
      ? evento.valorIngresso / 2
      : evento.valorIngresso;

      await axios.patch(`${baseURLingresso}/${ingresso.id}`, {
        pago: true,
        tipo: tipoIngresso,
        valor: valorFinal
      });

    setIngresso({ ...ingresso, pago: true });
    setOpenModal(false);
    mensagemSucesso("Pagamento salvo com sucesso");

    } catch(error) {
    console.error(error);
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
          nomeEvento={evento.nomeEvento}
          dataInicioEvento={evento.dataInicio}
          horaInicioEvento={evento.horaInicio}
          dataFimEvento={evento.dataFim}
          horaFimEvento={evento.horaFim}
          modalidade={evento.modalidade}
          valorIngresso={evento.valorIngresso}
          cep={evento.cep}
          logradouro={evento.logradouro}
          bairro={evento.bairro}
          cidade={evento.cidade}
          estado={evento.estado}
          numero={evento.numero}
          complemento={evento.complemento}
          infoLateral="Dados evento"
          statusPagamento={ingresso?.pago}
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
              <strong>Valor do ingresso:</strong>{" "}
              {evento.valorIngresso === 0
                ? "Gratuito"
                : `R$ ${evento.valorIngresso}`}
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

          {inscrito && ingresso && !ingresso.pago && (
            <Button variant="contained" color="success" onClick={() => setOpenModal(true)}>
              Realizar pagamento
            </Button>
          )}

          {ingresso?.pago && !ingresso.cancelado && (
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
