import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import { Grid, Paper, Typography, TextField, Stack, Button } from "@mui/material";
import InputsEndereco from "../components/form-inputsEndereco";
import InputsSenha from "../components/form-inputsSenha";
import "../style/cadastro.css";

import axios from 'axios';
import { BASE_URL_S } from '../config/axios';

function CadastroAdministrador(){
      const baseURL = `${BASE_URL_S}/administrador`;
      const { idParam } = useParams();
      const navigate = useNavigate();
  
      const [acao, setAcao] = useState("Cadastro");
      const [mensagem, setMensagem] = useState("Faça cadastro de novos");
      const [acaoButton, setAcaoButton] = useState("Criar");
      
      const [id, setIdAdministrador] = useState("");
      const [nome, setNomeAdministrador] = useState("");
      const [cpf, setCpfAdministrador] = useState("");
      const [celular, setCelular] = useState("");
      const [email, setEmailAdministrador] = useState("");

      const [cep, setCep] = useState("");
      const [logradouro, setLogradouro] = useState("");
      const [numero, setNumero] = useState("");
      const [complemento, setComplemento] = useState("");
      const [bairro, setBairro] = useState("");
      const [cidade, setCidade] = useState("");
      const [estado, setEstado] = useState("");

      const [senha, setSenha] = useState("");
      const [confirmarSenha, setConfirmarSenha] = useState("");

    useEffect(() => {
      if (!idParam) return;

      axios.get(`${baseURL}/${idParam}`).then((response) => {
        const dados = response.data;
        setIdAdministrador(dados.id);
        setNomeAdministrador(dados.nome);
        setCpfAdministrador(dados.cpf);
        setCelular(dados.celular);
        setEmailAdministrador(dados.email);
        
        setCep(dados.cep);
        setLogradouro(dados.logradouro);
        setNumero(dados.numero);
        setComplemento(dados.complemento);
        setBairro(dados.bairro);
        setCidade(dados.cidade);
        setEstado(dados.estado);

        setAcao("Edição");
        setMensagem("Faça edição dos");
        setAcaoButton("Editar");
      });
  }, [idParam, baseURL]);

  async function save(e) {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      return;
    }
     
    const data = { id, nome, cpf, celular, cep, logradouro, numero, complemento, bairro, cidade, estado, email};
    try {
      if (!idParam) {
        await axios.post(baseURL, data);
          mensagemSucesso(`Novo administrador ${nome} criado com sucesso!`);
          navigate(`/listagem-eventos`);
      } else {
        await axios.put(`${baseURL}/${idParam}`, data);
          mensagemSucesso(`Administrador ${nome} alterado com sucesso!`);
          navigate(`/listagem-eventos`);
      }
      navigate("/listagem-eventos");
    } catch (error) {
      mensagemErro(error.response.data);
    }
  }

  async function exclude() {
    let data = JSON.stringify({ idParam });
    let url = `${baseURL}/${idParam}`;
    await axios
      .delete(url, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(function (response) {
        mensagemSucesso(`Admninistrador excluído com sucesso!`);
        navigate(`/listagem-eventos`);
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir o admninistrador`);
      });
  }

  return (
    <Grid container direction="column" sx={{ minHeight: "100vh", width: "100%", overflow: "hidden", justifyContent: "center", alignItems: "flex-start", mt: 8, boxSizing: "border-box", px: { xs: 1, sm: 3 } }} >
        <Paper elevation={3} sx={{ width: "100%", maxWidth: 900, maxHeight: "90vh", overflowY: "auto", p: { xs: 2, sm: 4 }}}>
            <Typography component="h1" variant="h3">{acao} de Administrador</Typography>
            <Typography variant="subtitle1" className="label" sx={{ mb: 3 }}>{mensagem} administradores.</Typography>
            <Grid container component="form" onSubmit={save} noValidate spacing={2} sx={{ justifyContent: "center", alignItems: "stretch"}}>
                <Grid item size={10} direction="column"> 
                    <Grid item xs={12} md={10}>
                        <Typography variant="body1" className="label">Nome*</Typography>
                        <TextField name="nome" placeholder="Nome do administrador" value={nome} onChange={(e) => setNomeAdministrador(e.target.value)}  required fullWidth sx={{ mb: 2 }}/>
                    </Grid>
                    <Grid item xs={12} md={10}>
                        <Typography variant="body1" className="label">CPF*</Typography>
                        <TextField name="cpf" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpfAdministrador(e.target.value)}  required fullWidth sx={{ mb: 2 }}/>
                    </Grid>
                    <Grid item xs={12} md={10}>
                        <Typography variant="body1" className="label">Email para contato*</Typography>
                        <TextField name="email" placeholder="administrador@email.com" type="email" value={email} onChange={(e) => setEmailAdministrador(e.target.value)}  required fullWidth sx={{ mb: 2 }}/>
                    </Grid>
                    <Grid item xs={12} md={10}>
                        <Typography variant="body1" className="label">Celular para contato*</Typography>
                        <TextField name="celular" placeholder="55 (00) 00000-0000" value={celular} onChange={(e) => setCelular(e.target.value)}  required fullWidth sx={{ mb: 2 }}/>
                    </Grid>
                </Grid>
            <InputsEndereco cep={cep} setCep={setCep}
                            logradouro={logradouro} setLogradouro={setLogradouro}
                            bairro={bairro} setBairro={setBairro}
                            cidade={cidade} setCidade={setCidade}
                            estado={estado} setEstado={setEstado}
                            numero={numero} setNumero={setNumero}
                            complemento={complemento} setComplemento={setComplemento}
            />
            <InputsSenha  senha={senha}  setSenha={setSenha}
                          confirmarSenha={confirmarSenha}  setConfirmarSenha={setConfirmarSenha}
            />
            <Grid item xs={12} justifyContent="flex-end">
                <Stack spacing={2} direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" >
                    <Button variant="outlined" onClick={() => navigate("/listagem-eventos")}>Voltar</Button>
                    <Button variant="contained" type="submit">{acaoButton} conta de administrador</Button>
                    {idParam ? <Button variant="outlined" color="error" onClick={exclude}>Excluir</Button> : false}
                </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
  );
}

export default CadastroAdministrador;