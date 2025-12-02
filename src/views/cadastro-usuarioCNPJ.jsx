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
import InputsEndereco from "../components/form-inputsEndereco";
import InputsSenha from "../components/form-inputsSenha";

import axios from 'axios';
import { BASE_URL_S } from '../config/axios';

function CadastroUsuarioCNPJ() {
    const baseURL = `${BASE_URL_S}/participanteCNPJ`;
    const { idParam } = useParams();
    const navigate = useNavigate();

    const [acao, setAcao] = React.useState("Cadastro");
    const [mensagem, setMensagem] = React.useState("Faça Faça cadastro com seus dados, promova e participe de eventos incríveis!");
    const [acaoButton, setAcaoButton] = React.useState("Criar conta");
    
    const [id, setIdUsuarioCNPJ] = React.useState("");
    const [razaoSocial, setRazaoSocialUsuarioCNPJ] = useState("");
    const [nomeFantasia, setNomeFantasiaUsuarioCNPJ] = useState("");
    const [cnpj, setCNPJUsuarioCNPJ] = useState("");
    const [email, setEmailUsuarioCNPJ] = useState("");
    const [celular, setCelularUsuarioCNPJ] = useState("");
    const [siteEmpresa, setSiteEmpresaUsuarioCNPJ] = useState("");
    const [nomeResponsavelLegal, setNomeResponsavelLegalUsuarioCNPJ] = useState("");
    const [cpfResponsavelLegal, setCpfResponsavelLegalUsuarioCNPJ] = useState("");
    const [inscricaoestadualMunicipal, setInscricaoestadualMunicipalUsuarioCNPJ] = useState("");
    
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
            if(dados)

            setIdUsuarioCNPJ(dados.id);
            setRazaoSocialUsuarioCNPJ(dados.razaoSocial);
            setNomeFantasiaUsuarioCNPJ(dados.nomeFantasia);
            setCNPJUsuarioCNPJ(dados.cnpj);
            setEmailUsuarioCNPJ(dados.email);
            setCelularUsuarioCNPJ(dados.celular);
            setSiteEmpresaUsuarioCNPJ(dados.siteEmpresa);
            setNomeResponsavelLegalUsuarioCNPJ(dados.nomeResponsavelLegal);
            setCpfResponsavelLegalUsuarioCNPJ(dados.cpfResponsavelLegal);
            setInscricaoestadualMunicipalUsuarioCNPJ(dados.inscricaoestadualMunicipal);
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
         
        const data = { id, razaoSocial, nomeFantasia, cnpj, email, celular, cep, logradouro, numero, complemento, bairro, cidade, estado, siteEmpresa, nomeResponsavelLegal, cpfResponsavelLegal, inscricaoestadualMunicipal};
        try {
          if (!idParam) {
            await axios.post(baseURL, data);
              mensagemSucesso(`Bem vindo ${nomeFantasia}!`);
              navigate(`/tela-principal`);
          } else {
            await axios.put(`${baseURL}/${idParam}`, data);
              mensagemSucesso(`${nomeFantasia} seus dados foram alterados com sucesso!`);
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
        mensagemSucesso(`Usuário ${nomeFantasia} excluído com sucesso!`);
        navigate(`/tela-principal`);
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir o usuário ${nomeFantasia}`);
      });
  }

  return (
      <Box p={5} overflow="auto" sx={{ backgroundColor: "background.default", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", boxSizing:"border-box"}}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: "900px" }}>
          <Typography component="h1" variant="h3">{acao} de Usuários</Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>{mensagem}</Typography>

          <FormControlLabel control={<Checkbox checked={true} disabled={idParam ? true : false} onClick={() => navigate("/cadastro-usuarioCPF")}/>} label="Sou CNPJ" />

          <Grid container direction="row" component="form" onSubmit={save} noValidate sx={{justifyContent: "center", alignItems: "center", mt: 2}}>
            <Grid size={10}>
                <Grid size={10}>
                    <Typography variant="h6">Razão social*</Typography>
                    <TextField name="razaoSocial" placeholder="Razão social completa" value={razaoSocial} onChange={(e) => setRazaoSocialUsuarioCNPJ(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
                </Grid>
                <Grid size={10}>
                    <Typography variant="h6">Nome fantasia*</Typography>
                    <TextField name="nomeFantasia" placeholder="Nome fantasia completo" value={nomeFantasia} onChange={(e) => setNomeFantasiaUsuarioCNPJ(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
                </Grid>
                <Grid size={10}>
                    <Typography variant="h6">CNPJ*</Typography>
                    <TextField name="cnpj" placeholder="00.000.000/0001-00" value={cnpj} onChange={(e) => setCNPJUsuarioCNPJ(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
                </Grid>
                <Grid size={10}>
                    <Typography variant="h6">Email*</Typography>
                    <TextField name="email" placeholder="empresa@email.com" type="email" value={email} onChange={(e) => setEmailUsuarioCNPJ(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
                </Grid>
                <Grid size={10}>
                    <Typography variant="h6">Celular*</Typography>
                    <TextField name="celular" placeholder="+00 (00) 00000-0000" value={celular} onChange={(e) => setCelularUsuarioCNPJ(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
                </Grid>
                <Grid size={10}>
                    <Typography variant="h6">Site oficial</Typography>
                    <TextField name="siteEmpresa" placeholder="www.minhaEmpresa.com" value={siteEmpresa} onChange={(e) => setSiteEmpresaUsuarioCNPJ(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
                </Grid>
                <InputsEndereco cep={cep} setCep={setCep}
                                logradouro={logradouro} setLogradouro={setLogradouro}
                                bairro={bairro} setBairro={setBairro}
                                cidade={cidade} setCidade={setCidade}
                                estado={estado} setEstado={setEstado}
                                numero={numero} setNumero={setNumero}
                                complemento={complemento} setComplemento={setComplemento}
                />
                <Grid size={10}>
                    <Typography variant="h6">Nome do responsável legal*</Typography>
                    <TextField name="nomeResponsavelLegal" placeholder="Nome completo do responsável legal" value={nomeResponsavelLegal} onChange={(e) => setNomeResponsavelLegalUsuarioCNPJ(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
                </Grid>
                <Grid size={10}>
                    <Typography variant="h6">CPF do responsável legal*</Typography>
                    <TextField name="cpfResponsavelLegal" placeholder="000.000.000-00" value={cpfResponsavelLegal} onChange={(e) => setCpfResponsavelLegalUsuarioCNPJ(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
                </Grid>
                <Grid size={10}>
                    <Typography variant="h6">Inscrição Estatual/Municipal*</Typography>
                    <TextField name="inscricaoestadualMunicipal" placeholder="000000000" value={inscricaoestadualMunicipal} onChange={(e) => setInscricaoestadualMunicipalUsuarioCNPJ(e.target.value)} required fullWidth sx={{ mb: 3, }}/>
                </Grid>
            </Grid>
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

export default CadastroUsuarioCNPJ;
