import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import Paper from '@mui/material/Paper';
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputsEndereco from "../components/form-inputsEndereco";
import InputsSenha from "../components/form-inputsSenha";

import axios from 'axios';
import { BASE_URL_S } from '../config/axios';

function CadastroAdministrador(){
      const baseURL = `${BASE_URL_S}/administrador`;
      const { idParam } = useParams();
      const navigate = useNavigate();
  
      const [acao, setAcao] = React.useState("Cadastro");
      const [mensagem, setMensagem] = React.useState("Faça cadastro de novos");
      const [acaoButton, setAcaoButton] = React.useState("Criar");
      
      const [id, setIdAdministrador] = React.useState("");
      const [nome, setNomeAdministrador] = React.useState("");
      const [cpf, setCpfAdministrador] = React.useState("");
      const [celular, setCelular] = React.useState("");
      const [email, setEmailAdministrador] = React.useState("");

      const [cep, setCep] = React.useState("");
      const [logradouro, setLogradouro] = React.useState("");
      const [numero, setNumero] = React.useState("");
      const [complemento, setComplemento] = React.useState("");
      const [bairro, setBairro] = React.useState("");
      const [cidade, setCidade] = React.useState("");
      const [estado, setEstado] = React.useState("");

      const [senha, setSenha] = React.useState("");
      const [confirmarSenha, setConfirmarSenha] = React.useState("");

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
          navigate(`/tela-principal`);
      } else {
        await axios.put(`${baseURL}/${idParam}`, data);
          mensagemSucesso(`Administrador ${nome} alterado com sucesso!`);
          navigate(`/tela-principal`);
      }
      navigate("/tela-principal");
    } catch (error) {
      mensagemErro(error.response.data);
    }
  }

  return (
    <Box display="flex" height="100vh" bgcolor="background.default">
      <Box>
        
      </Box>

      <Box flex={1} p={5} overflow="auto" sx={{ position: "relative", backgroundColor: "background.default", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h3">{acao} de Administrador</Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>{mensagem} administradores.</Typography>
          <Grid container direction="row" component="form" onSubmit={save} noValidate sx={{justifyContent: "center", alignItems: "center", mt: 2}}>
            <Grid size={10}>
                <Typography variant="h6">Nome*</Typography>
                <TextField name="nome" placeholder="Nome do administrador" value={nome} onChange={(e) => setNomeAdministrador(e.target.value)}  required fullWidth sx={{ mb: 3, }}/>
            </Grid>
            <Grid size={10}>
                <Typography variant="h6">CPF*</Typography>
                <TextField name="cpf" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpfAdministrador(e.target.value)}  required fullWidth sx={{ mb: 3, }}/>
            </Grid>
            <Grid size={10}>
                <Typography variant="h6">Email para contato*</Typography>
                <TextField name="email" placeholder="administrador@email.com" type="email" value={email} onChange={(e) => setEmailAdministrador(e.target.value)}  required fullWidth sx={{ mb: 3, }}/>
            </Grid>
            <Grid size={10}>
                <Typography variant="h6">Celular para contato*</Typography>
                <TextField name="celular" placeholder="55 (00) 00000-0000" value={celular} onChange={(e) => setCelular(e.target.value)}  required fullWidth sx={{ mb: 3, }}/>
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
            <Grid size={10}>
                <Stack spacing={2} direction="row">
                    <Button variant="outlined" onClick={() => navigate("/tela-principal")}>Voltar</Button>
                    <Button variant="contained" type="submit">{acaoButton} conta de administrador</Button>
                </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}

export default CadastroAdministrador;