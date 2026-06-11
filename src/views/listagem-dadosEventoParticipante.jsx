import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Stack, Button } from "@mui/material";
import BoxInfoEvento from "../components/box-info-evento";
import Lista from "../components/lista";
import "../style/listagemDadosEvento.css"
import axios from 'axios';
import { BASE_URL } from '../config/axios';

const mainStackStyle = { 
  minHeight: "100vh", 
  boxSizing: "border-box", 
  overflowX: "hidden" 
};

function ListagemParticipantes() {
    const baseURL = `${BASE_URL}/eventos`;
    const { idParam } = useParams();
    const navigate = useNavigate();

    const infoLateral = "Participantes";
  
    const [id, setIdEvento] = useState("");
    const [nome, setNome] = useState("");
    const [dataInicioEvento, setDataInicioEvento] = useState("");
    const [horaInicioEvento, setHoraInicioEvento] = useState("");
    const [dataFimEvento, setDataFimEvento] = useState("");
    const [horaFimEvento, setHoraFimEvento] = useState("");
    const [lotacaoMaxima, setLotacaoMaximaEvento] = useState("");

    const [cep, setCep] = useState("");
    const [logradouro, setLogradouro] = useState("");
    const [numero, setNumero] = useState("");
    const [complemento, setComplemento] = useState("");
    const [bairro, setBairro] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");

    useEffect(() => {
      if (!idParam) return;

      axios.get(`${baseURL}/${idParam}`).then((response) => {
        const dados = response.data;
        setIdEvento(dados.id);
        setNome(dados.nome);
        setDataInicioEvento(dados.dataHoraInicio);
        setDataFimEvento(dados.dataHoraFim);
        
        setLotacaoMaximaEvento(dados.lotacaoMaxima || 0);

        setCep(dados.endereco?.cep || "");
        setLogradouro(dados.endereco?.logradouro || "");
        setNumero(dados.endereco?.numero || "");
        setComplemento(dados.endereco?.complemento || "");
        setBairro(dados.endereco?.bairro || "");
        setCidade(dados.endereco?.cidade || "");
        setEstado(dados.endereco?.estado || "");   
      });
    }, [idParam, baseURL]);

    async function cancel(e) {
    }

    return (
         <Stack direction="column" spacing={4} p={{ xs: 2, sm: 3, md: 5 }} sx={mainStackStyle} >
            <Stack direction="column">
                <Typography 
                    variant="h1" 
                    className="regiao" 
                    sx={{ mb: 3, fontSize: { xs: "1.8rem", sm: "2.4rem", md: "3rem" } }}
                >
                    Dados do evento
                </Typography>
                
                <BoxInfoEvento  
                    nomeEvento={nome}
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
                    lotacaoMaxima={lotacaoMaxima}
                    statusPagamento={false} 
                />
                
                {id && <Lista idEvento={id} sx={{ maxWidth: 1200, mx: "auto" }}/>}
            </Stack>
            
            <Stack spacing={2} direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "flex-end" }}>
                <Button variant="outlined" onClick={() => navigate("/eventos-organizados")}>Voltar</Button>
                <Button variant="contained" color="warning" onClick={cancel}>Cancelar evento</Button>
            </Stack>
         </Stack>  
    );
}

export default ListagemParticipantes;
