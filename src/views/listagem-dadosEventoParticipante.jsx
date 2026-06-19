import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Stack, Button, Box } from "@mui/material";
import BoxInfoEvento from "../components/box-info-evento";
import Lista from "../components/lista";
import "../style/listagemDadosEvento.css";
import axios from 'axios';
import { BASE_URL } from '../config/axios';

const mainStackStyle = { 
  maxWidth: 1100,
  margin: "80px auto",
  padding: 4,
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
    const [dataFimEvento, setDataFimEvento] = useState("");
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

    const formatarHoraCustomizada = (dataHora) => {
      if (!dataHora) return "";
      const horaString = new Date(dataHora).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }); 
      
      const [hora, minuto] = horaString.split(":");
      const horaLimpa = parseInt(hora, 10); 
      return `${horaLimpa}h${minuto}`;
    };

    return (
         <Stack spacing={4} sx={mainStackStyle}>
            
            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: 3,
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                padding: 4,
              }}
            >
              <Stack direction="column">
                                    
                  <BoxInfoEvento  
                      nomeEvento={nome}
                      dataInicioEvento={dataInicioEvento}
                      horaInicioEvento={formatarHoraCustomizada(dataInicioEvento)}
                      dataFimEvento={dataFimEvento}
                      horaFimEvento={formatarHoraCustomizada(dataFimEvento)}
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
                  
                  {id && (
                    <Box sx={{ mt: 4 }}>
                      <Lista idEvento={id} sx={{ maxWidth: 1200, mx: "auto" }}/>
                    </Box>
                  )}
              </Stack>
              
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
                  <Button variant="outlined" onClick={() => navigate(`/eventos-organizados`)}>
                    Voltar
                  </Button>
                  <Button variant="contained" color="warning" onClick={cancel}>
                    Cancelar evento
                  </Button>
              </Stack>
            </Box>
         </Stack>  
    );
}

export default ListagemParticipantes;
