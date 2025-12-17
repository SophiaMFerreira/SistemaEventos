import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { mensagemErro, mensagemSucesso } from '../components/toastr'; 
import { Typography, Stack, Button, Box, Modal, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import BoxInfoEvento from "../components/box-info-evento";
import "../style/listagemDadosEvento.css"
import imagemEventoBale from "../components/eventoBale.jpg"

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
    <Stack spacing={4} p={4}>
      <Typography variant="h4">Dados do evento</Typography>

      <BoxInfoEvento {...evento} statusPagamento={ingresso?.pago} />

      <Box component="img" src={imagemEventoBale} sx={{ maxWidth: 600, borderRadius: 2 }} />

      <Typography>Descrição: {evento.descricao}</Typography>

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button variant="outlined" onClick={() => navigate("/meus-eventos")}>
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
            onClick={() => navigate(`/meus-eventos/${evento.id}/ingresso`)}
          >
            Emitir ingresso
          </Button>
        )}
      </Stack>

      {/* MODAL PAGAMENTO */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ background: "#fff", p: 4, borderRadius: 2, width: 300, mx: "auto", mt: "20%" }}>
          <Typography variant="h6">Tipo de ingresso</Typography>

          <RadioGroup value={tipoIngresso} onChange={(e) => setTipoIngresso(e.target.value)}>
            <FormControlLabel value="inteira" control={<Radio />} label="Inteira" />
            <FormControlLabel value="meia" control={<Radio />} label="Meia" />
          </RadioGroup>

          <Button fullWidth variant="contained" onClick={realizarPagamento}>
            Confirmar pagamento
          </Button>
        </Box>
      </Modal>
    </Stack>
  );
}

export default ListagemDadosEvento;
