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
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import InputsEndereco from "../components/form-inputsEndereco";
import InputsSenha from "../components/form-inputsSenha";

import axios from 'axios';
import { BASE_URL_S } from '../config/axios';

function CadastroUsuarioCPF() {
    const baseURL = `${BASE_URL_S}/participanteCPF`;
    const { idParam } = useParams();
    const navigate = useNavigate();

    const [acao, setAcao] = React.useState("Cadastro");
    const [mensagem, setMensagem] = React.useState("Faça Faça cadastro com seus dados, promova e participe de eventos incríveis!");
    const [acaoButton, setAcaoButton] = React.useState("Criar conta");
       
    const [id, setIdUsuarioCPF] = React.useState("");
    const [nome, setNomeUsuarioCPF] = React.useState("");
    const [cpf, setCPFUsuarioCPF] = React.useState("");
    const [dataNascimento, setDataNascimentoUsuarioCPF] = React.useState("");
    const [genero, setGeneroUsuarioCPF] = React.useState('Selecionar gênero');
    const [email, setEmailUsuarioCPF] = React.useState("");
    const [celular, setCelularUsuarioCPF] = React.useState("");
   
    const [cep, setCep] = React.useState("");
    const [logradouro, setLogradouro] = React.useState("");
    const [numero, setNumero] = React.useState("");
    const [complemento, setComplemento] = React.useState("");
    const [bairro, setBairro] = React.useState("");
    const [cidade, setCidade] = React.useState("");
    const [estado, setEstado] = React.useState("");
    const [senha, setSenha] = React.useState("");
    const [confirmarSenha, setConfirmarSenha] = React.useState("");
 
    const select = (event) => {
      setGeneroUsuarioCPF(event.target.value);
    };

    useEffect(() => {
          if (!idParam) return;
          axios.get(`${baseURL}/${idParam}`).then((response) => {
            const dados = response.data;
            setIdUsuarioCPF(dados.id);
            setNomeUsuarioCPF(dados.nome);
            setCPFUsuarioCPF(dados.cpf);
            setDataNascimentoUsuarioCPF(dados.dataNascimento);
            setGeneroUsuarioCPF(dados.genero);
            setCelularUsuarioCPF(dados.celular);
            setEmailUsuarioCPF(dados.email);
            setCep(dados.cep);
            setLogradouro(dados.logradouro);
            setNumero(dados.numero);
            setComplemento(dados.complemento);
            setBairro(dados.bairro);
            setCidade(dados.cidade);
            setEstado(dados.estado);
    
            setAcao("Edição");
            setMensagem("Edite seus dados aqui.");
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
              mensagemSucesso(`Bem vindo ${nome}!`);
              navigate(`/tela-principal`);
          } else {
            await axios.put(`${baseURL}/${idParam}`, data);
              mensagemSucesso(`${nome} seus dados foram alterados com sucesso!`);
              navigate(`/tela-principal`);
          }
          navigate("/tela-principal");
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
        mensagemSucesso(`Usuário ${nome} excluído com sucesso!`);
        navigate(`/tela-principal`);
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir o usuário ${nome}`);
      });
  }

  return (
      <Box p={5} overflow="auto" sx={{ backgroundColor: "background.default", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", boxSizing:"border-box"}}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: "900px" }}>
          <Typography component="h1" variant="h3">{acao} de Usuários</Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>{mensagem}</Typography>

          <FormControlLabel control={<Checkbox checked={false} disabled={idParam ? true : false} onClick={() => navigate("/cadastro-usuarioCNPJ")}/>} label="Sou CNPJ" />

          <Grid container direction="row" component="form" onSubmit={save} noValidate sx={{justifyContent: "center", alignItems: "center", mt: 2}}>
            <Grid size={10}>
                <Typography variant="h6">Nome*</Typography>
                <TextField name="nome" placeholder="Nome do usuário" value={nome} onChange={(e) => setNomeUsuarioCPF(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
            </Grid>
            <Grid size={10}>
                <Typography variant="h6">CPF*</Typography>
                <TextField name="cpf" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCPFUsuarioCPF(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
            </Grid>
            <Grid size={10}>
                <Grid container spacing={2} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                    <Grid size={6} spacing={2}>
                        <Typography variant="h6">Data de nascimento*</Typography>
                        <TextField name="dataNascimento" type="date" value={dataNascimento} onChange={(e) => setDataNascimentoUsuarioCPF(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
                    </Grid>
                    <Grid size={6} spacing={2}>
                        <Typography variant="h6">Gênero</Typography>
                        <Select name="genero" id="generoUsuario" value={genero} onChange={select} required fullWidth>
                            <MenuItem value={"femenino"}>Femenino</MenuItem>
                            <MenuItem value={"masculino"}>Masculino</MenuItem>
                            <MenuItem value={"lgbtqia+"}>LGBTQIA+</MenuItem>
                            <MenuItem value={"naoDeclarar"}>Prefiro não declarar</MenuItem>
                        </Select>
                    </Grid>
                </Grid>
            </Grid>
            <Grid size={10}>
                <Typography variant="h6">Email para contato*</Typography>
                <TextField name="email" placeholder="usuario@email.com" type="email" value={email} onChange={(e) => setEmailUsuarioCPF(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
            </Grid>
            <Grid size={10}>
                <Typography variant="h6">Celular para contato*</Typography>
                <TextField name="celular" placeholder="+00 (00) 00000-0000" value={celular} onChange={(e) => setCelularUsuarioCPF(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
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
                    <Button variant="contained" type="submit">{acaoButton}</Button>
                    {idParam ? <Button variant="outlined" color="error" onClick={() => exclude()}>Excluir</Button> : false}
                </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>
  );
}

export default CadastroUsuarioCPF;
