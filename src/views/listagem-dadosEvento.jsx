import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { mensagemSucesso } from '../components/toastr'; 
import { Typography, Stack, Button, Box } from "@mui/material";
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
  
    const infoLateral = "Dados evento";
    const idParticipante = Number(localStorage.getItem("idUsuario"));
    const tipoParticipante = localStorage.getItem("tipoParticipante");

    const [id, setIdEvento] = useState("");
    const [nomeEvento, setNomeEvento] = useState("");
    const [dataInicioEvento, setDataInicioEvento] = useState("");
    const [horaInicioEvento, setHoraInicioEvento] = useState("");
    const [dataFimEvento, setDataFimEvento] = useState("");
    const [horaFimEvento, setHoraFimEvento] = useState("");
    const [descricaoEvento, setDescricaoEvento] = useState(""); 
    const [statusPagamento, setStatusPagamento] = useState(false); 

    const [cep, setCep] = useState("");
    const [logradouro, setLogradouro] = useState("");
    const [numero, setNumero] = useState("");
    const [complemento, setComplemento] = useState("");
    const [bairro, setBairro] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");

    useEffect(() => {
  if (!idParam) return;

    async function carregarDados() {
      try {
          const eventoRes = await axios.get(`${baseURL}/${idParam}`);
          const dados = eventoRes.data;

          setIdEvento(dados.id);
          setNomeEvento(dados.nomeEvento);
          setDataInicioEvento(dados.dataInicio);
          setHoraInicioEvento(dados.horaInicio);
          setDataFimEvento(dados.dataFim);
          setHoraFimEvento(dados.horaFim);
          setDescricaoEvento(dados.descricao);

          setCep(dados.cep);
          setLogradouro(dados.logradouro);
          setNumero(dados.numero);
          setComplemento(dados.complemento);
          setBairro(dados.bairro);
          setCidade(dados.cidade);
          setEstado(dados.estado);

          const ingressosRes = await axios.get(baseURLingresso);
          const ingressos = ingressosRes.data;
          let ingresso;

          if (tipoParticipante === "cpf") {
            ingresso = ingressos.find(
              i => i.idEvento === Number(idParam) && i.idParticipanteCPF === idParticipante );
          }
          if (tipoParticipante === "cnpj") {
            ingresso = ingressos.find( i => i.idEvento === Number(idParam) && i.idParticipanteCNPJ === idParticipante );
          }
          if (ingresso) {
            setStatusPagamento(ingresso.pago);
          }
      } catch (error) {
          console.error("Erro ao carregar dados:", error);
      }
      }
      carregarDados();
      }, [idParam]);

    async function cancel(e) {
        
    }

    return(
        <Stack direction="column" p={{ xs: 2, sm: 3, md: 5 }} spacing={4} overflow="auto" sx={{ position: "relative" }}>
            <Stack direction="column">
                <Typography variant="h1" className="regiao" sx={{ mb: { xs: 3, md: 5 }, fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.6rem" } }}>Dados do evento</Typography>
                <BoxInfoEvento  nomeEvento={nomeEvento}
                                dataInicioEvento={dataInicioEvento}
                                horaInicioEvento={horaInicioEvento}
                                dataFimEvento={dataFimEvento}
                                horaFimEvento={horaFimEvento}
                                cep={cep}
                                logradouro={logradouro}
                                bairro={bairro}
                                cidade={cidade}
                                estado={estado}
                                numero={numero}
                                complemento={complemento}
                                
                                infoLateral={infoLateral}
                                lotacaoMaxima={0}
                                statusPagamento={statusPagamento}                                
                sx={{ width: "100%" }} />
                
            </Stack>
            <Box sx={{display: "flex", justifyContent: "center", width: "100%",}}>
                <Box component="img" src={imagemEventoBale} alt="Dançarinas de balé em roupas brancas." sx={{ width: "100%", maxWidth: 700, height: "auto", borderRadius: 2 }} />
            </Box>
            <Typography variant="body1" sx={{ mb: 5, pl: 5}}>Descrição: {descricaoEvento}</Typography>
            <Stack spacing={2} direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "flex-end" }}>
                <Button variant="outlined" onClick={() => navigate("/tela-principal")}>Voltar</Button>
                <Button variant="contained" color="warning" onClick={() => navigate("/ingresso")}>Emitir ingresso</Button>
            </Stack>
        </Stack>   
    );
}
export default ListagemDadosEvento;