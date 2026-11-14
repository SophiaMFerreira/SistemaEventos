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
  Alert,
} from "@mui/material";
import BoxInfoEvento from "../components/box-info-evento";
import "../style/listagemDadosEvento.css";

import axios, { BASE_URL } from "../config/axios";
import imagemPadrao from "../assets/evento-default.jpg";

function ListagemDadosEvento() {
  const baseURL = `${BASE_URL}/eventos`;
  const baseURLingresso = `${BASE_URL}/ingressos`;
  const { idParam } = useParams();
  const navigate = useNavigate();

  const [idParticipante, setIdParticipante] = useState(null);
  const [evento, setEvento] = useState({});
  const [ingresso, setIngresso] = useState(null);
  const [inscrito, setInscrito] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [tipoIngresso, setTipoIngresso] = useState("inteira");
  const [imagemEvento, setImagemEvento] = useState(imagemPadrao);
  const [formaPagamento, setFormaPagamento] = useState("PIX");
const [saldoCarteira, setSaldoCarteira] = useState(0);
const [carregandoSaldo, setCarregandoSaldo] = useState(false);

  useEffect(() => {
    if (!evento.imagem) {
      setImagemEvento(imagemPadrao);
      return;
    }

    let urlTemporaria;

    async function carregarImagem() {
      try {
        const response = await axios.get(
          `${BASE_URL}/eventos/imagem/${evento.imagem}`,
          { responseType: "blob" },
        );

        urlTemporaria = URL.createObjectURL(response.data);
        setImagemEvento(urlTemporaria);
      } catch (error) {
        console.error("Erro ao carregar imagem do evento:", error);
        setImagemEvento(imagemPadrao);
      }
    }

    carregarImagem();

    return () => {
      if (urlTemporaria) {
        URL.revokeObjectURL(urlTemporaria);
      }
    };
  }, [evento.imagem]);

  useEffect(() => {
    async function carregarDados() {
      try {
        // Busca o usuário autenticado
        const usuarioRes = await axios.get(`${BASE_URL}/usuario/me`);
        const idUsuario = usuarioRes.data.id;

        setIdParticipante(idUsuario);

        // Busca os dados do evento
        const eventoRes = await axios.get(`${baseURL}/${idParam}`);
        setEvento(eventoRes.data);

        // Busca os ingressos
        const ingressosRes = await axios.get(baseURLingresso);
        const ingressos = ingressosRes.data;

        // Verifica se o participante já possui ingresso para o evento
        const encontrado = ingressos.find(
          (i) =>
            Number(i.idEvento) === Number(idParam) &&
            Number(i.idParticipante) === Number(idUsuario),
        );

        console.log("ID PARTICIPANTE:", idUsuario);
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

  useEffect(() => {
  if (!openModal) return;

  async function carregarSaldoCarteira() {
    try {
      setCarregandoSaldo(true);

      const response = await axios.get(`${BASE_URL}/carteira`);
      setSaldoCarteira(Number(response.data));
    } catch (error) {
      console.error("Erro ao consultar saldo da carteira:", error);
      mensagemErro("Não foi possível consultar o saldo da carteira.");
      setSaldoCarteira(0);
    } finally {
      setCarregandoSaldo(false);
    }
  }

  carregarSaldoCarteira();
}, [openModal]);

  async function inscrever() {
    try {
      const novoIngresso = {
        status: "RESERVADO",
        valor: 0,
        taxa: 0,
        idParticipante: idParticipante,
        idEvento: evento.id,
      };

      const res = await axios.post(baseURLingresso, novoIngresso);

      setIngresso(res.data);
      setInscrito(true);

      mensagemSucesso("Inscrição realizada com sucesso!");
    } catch (error) {
      console.error(error);

      mensagemErro(error.response?.data || "Erro ao realizar inscrição");
    }
  }

  async function realizarPagamento() {
  try {
    const valorDoEvento = Number(evento.valorIngresso) || 0;

    const valorFinal =
      tipoIngresso === "meia"
        ? Math.round((valorDoEvento / 2) * 100) / 100
        : valorDoEvento;

    if (
      formaPagamento === "CARTEIRA" &&
      saldoCarteira < valorFinal
    ) {
      mensagemErro("Saldo insuficiente na carteira.");
      return;
    }

    await axios.patch(`${baseURLingresso}/${ingresso.id}/pagamento`, {
      tipoIngresso: tipoIngresso,
      formaPagamento: formaPagamento,
    });

    setIngresso({
      ...ingresso,
      status: "PAGO",
      valor: valorFinal,
      tipoIngresso: tipoIngresso,
    });

    setOpenModal(false);
    mensagemSucesso("Pagamento salvo com sucesso");
  } catch (error) {
    console.error("ERRO PAGAMENTO:", error);

    mensagemErro(
      error.response?.data?.mensagem ||
      error.response?.data ||
      "Não foi possível processar o pagamento. Tente novamente."
    );
  }
}
const valorIngressoSelecionado =
  Number(evento.valorIngresso || 0) *
  (tipoIngresso === "meia" ? 0.5 : 1);

const valorFinal = Math.round(valorIngressoSelecionado * 100) / 100;

const saldoInsuficiente = saldoCarteira < valorFinal;
  return (
    <Stack
      spacing={4}
      sx={{
        maxWidth: 1100,
        margin: "80px auto",
        padding: 4,
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          padding: 4,
        }}
      >
        {evento.cancelado && (
  <Alert severity="error" sx={{ mb: 3 }}>
    Este evento foi cancelado pelo organizador. Sua inscrição também foi
    cancelada. Não é possível realizar novas inscrições ou pagamentos.
  </Alert>
)}
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
          eventoCancelado={evento.cancelado}
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
            <Typography variant="body1">{evento.descricao}</Typography>
          </Box>
        </Box>

        <Box
          component="img"
          src={imagemEvento}
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
          <Button variant="outlined" onClick={() => navigate("/meus-eventos")}>
            Voltar
          </Button>

          {!evento.cancelado && !inscrito && (
  <Button variant="contained" onClick={inscrever}>
    Inscrever-se
  </Button>
)}

{!evento.cancelado &&
  inscrito &&
  ingresso &&
  ingresso.status !== "PAGO" && (
    <Button
      variant="contained"
      color="success"
      onClick={() => setOpenModal(true)}
    >
      Realizar pagamento
    </Button>
  )}

{!evento.cancelado && ingresso?.status === "PAGO" && (
  <Button
    variant="contained"
    color="warning"
    onClick={() => navigate(`/meus-eventos/${evento.id}/ingresso`)}
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
  p: 3,
  borderRadius: 3,
  width: 400,
  maxWidth: "90%",
  maxHeight: "85vh",
  overflowY: "auto",
  mx: "auto",
  mt: "7vh",
  mb: 2,
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
}}
  >
    <Typography variant="h6" fontWeight={600} mb={2}>
      Forma de pagamento
    </Typography>

    <Typography fontWeight={600} mb={1}>
      Tipo de ingresso
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
        label="Meia-entrada"
      />
    </RadioGroup>

    <Typography fontWeight={600} mt={2} mb={1}>
      Valor a pagar
    </Typography>

    <Typography variant="h6" color="#0B3B91" fontWeight={700}>
      {valorFinal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
    </Typography>

    <Typography fontWeight={600} mt={3} mb={1}>
      Escolha a forma de pagamento
    </Typography>

    <RadioGroup
      value={formaPagamento}
      onChange={(e) => setFormaPagamento(e.target.value)}
    >
      <FormControlLabel
        value="PIX"
        control={<Radio />}
        label="PIX"
      />

      <FormControlLabel
        value="CARTEIRA"
        control={<Radio />}
        disabled={carregandoSaldo || saldoInsuficiente}
        label="Carteira digital"
      />
    </RadioGroup>

    <Box
      sx={{
        backgroundColor: "#f5f7fa",
        borderRadius: 2,
        p: 2,
        mt: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Saldo disponível na carteira
      </Typography>

      <Typography fontWeight={700} color="#0B3B91">
        {carregandoSaldo
          ? "Consultando saldo..."
          : saldoCarteira.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
      </Typography>
    </Box>

    {!carregandoSaldo && saldoInsuficiente && (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Saldo insuficiente para pagar este ingresso pela carteira.
      </Alert>
    )}

    <Button
      fullWidth
      variant="contained"
      size="large"
      sx={{ mt: 3 }}
      onClick={realizarPagamento}
      disabled={carregandoSaldo}
    >
      Confirmar pagamento
    </Button>
  </Box>
</Modal>
    </Stack>
  );
}

export default ListagemDadosEvento;
