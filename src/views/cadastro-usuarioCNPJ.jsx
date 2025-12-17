import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import { Grid, Paper, Typography, TextField, Stack, Button, FormControlLabel, Checkbox } from "@mui/material";
import InputsEndereco from "../components/form-inputsEndereco";
import InputsSenha from "../components/form-inputsSenha";
import "../style/cadastro.css";

import axios from 'axios';
import { BASE_URL_S } from '../config/axios';

function CadastroUsuarioCNPJ() {
    const baseURL = `${BASE_URL_S}/participanteCNPJ`;
    const { idParam } = useParams();
    const navigate = useNavigate();

    const [acao, setAcao] = useState("Cadastro");
    const [mensagem, setMensagem] = useState("Faça cadastro com seus dados, promova e participe de eventos incríveis!");
    const [acaoButton, setAcaoButton] = useState("Criar conta");
    const [navegacao, setNavegacao] = useState("/");
    
    const [id, setIdUsuarioCNPJ] = useState("");
    const [razaoSocial, setRazaoSocialUsuarioCNPJ] = useState("");
    const [nomeFantasia, setNomeFantasiaUsuarioCNPJ] = useState("");
    const [cnpj, setCNPJUsuarioCNPJ] = useState("");
    const [email, setEmailUsuarioCNPJ] = useState("");
    const [celular, setCelularUsuarioCNPJ] = useState("");
    const [siteEmpresa, setSiteEmpresaUsuarioCNPJ] = useState("");
    const [nomeResponsavelLegal, setNomeResponsavelLegalUsuarioCNPJ] = useState("");
    const [cpfResponsavelLegal, setCpfResponsavelLegalUsuarioCNPJ] = useState("");
    const [inscricaoEstadualMunicipal, setInscricaoEstadualMunicipalUsuarioCNPJ] = useState("");
    
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
            setInscricaoEstadualMunicipalUsuarioCNPJ(dados.inscricaoEstadualMunicipal);
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
            setNavegacao("/listagem-eventos");
          });
      }, [idParam, baseURL]);
    
      async function save(e) {
        e.preventDefault();
        if (senha !== confirmarSenha) {
          return;
        }
         
        const data = { id, razaoSocial, nomeFantasia, cnpj, email, celular, cep, logradouro, numero, complemento, bairro, cidade, estado, siteEmpresa, nomeResponsavelLegal, cpfResponsavelLegal, inscricaoEstadualMunicipal};
        try {
          if (!idParam) {
            await axios.post(baseURL, data);
              mensagemSucesso(`Bem vindo ${nomeFantasia}!`);
          } else {
            await axios.put(`${baseURL}/${idParam}`, data);
              mensagemSucesso(`${nomeFantasia} seus dados foram alterados com sucesso!`);
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
        mensagemSucesso(`Usuário ${nomeFantasia} excluído com sucesso!`);
        navigate(`/`);
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir o usuário ${nomeFantasia}`);
      });
  }

  return (
      <Grid container direction="column" sx={{ minHeight: "100vh", width: "100%", overflow: "hidden", justifyContent: "center", alignItems: "center", px: { xs: 1, sm: 3 } }} >
        <Paper elevation={3} sx={{ width: "100%", maxWidth: 900, maxHeight: "90vh", overflowY: "auto", p: { xs: 2, sm: 4 }}}>
          <Typography component="h1" variant="h3">{acao} de Usuários</Typography>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>{mensagem}</Typography>

          <FormControlLabel control={<Checkbox checked={true} disabled={idParam ? true : false} onClick={() => navigate("/cadastro-usuarioCPF")}/>} label="Sou CNPJ"/>

          <Grid container component="form" onSubmit={save} noValidate spacing={2} >
            <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                <Typography variant="body1" className="label">Razão social*</Typography>
                <TextField name="razaoSocial" placeholder="Razão social completa" value={razaoSocial} onChange={(e) => setRazaoSocialUsuarioCNPJ(e.target.value)} required fullWidth/>
            </Grid>
            <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                <Typography variant="body1" className="label">Nome fantasia*</Typography>
                <TextField name="nomeFantasia" placeholder="Nome fantasia completo" value={nomeFantasia} onChange={(e) => setNomeFantasiaUsuarioCNPJ(e.target.value)} required fullWidth/>
            </Grid>
            <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                <Typography variant="body1" className="label">CNPJ*</Typography>
                <TextField name="cnpj" placeholder="00.000.000/0001-00" value={cnpj} onChange={(e) => setCNPJUsuarioCNPJ(e.target.value)} required fullWidth/>
            </Grid>
            <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                <Typography variant="body1" className="label">Email*</Typography>
                <TextField name="email" placeholder="empresa@email.com" type="email" value={email} onChange={(e) => setEmailUsuarioCNPJ(e.target.value)} required fullWidth/>
            </Grid>
            <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                <Typography variant="body1" className="label">Celular*</Typography>
                <TextField name="celular" placeholder="+00 (00) 00000-0000" value={celular} onChange={(e) => setCelularUsuarioCNPJ(e.target.value)} required fullWidth/>
            </Grid>
            <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                <Typography variant="body1" className="label">Site oficial</Typography>
                <TextField name="siteEmpresa" placeholder="www.minhaEmpresa.com" value={siteEmpresa} onChange={(e) => setSiteEmpresaUsuarioCNPJ(e.target.value)} required fullWidth/>
            </Grid>
            <InputsEndereco cep={cep} setCep={setCep}
                            logradouro={logradouro} setLogradouro={setLogradouro}
                            bairro={bairro} setBairro={setBairro}
                            cidade={cidade} setCidade={setCidade}
                            estado={estado} setEstado={setEstado}
                            numero={numero} setNumero={setNumero}
                            complemento={complemento} setComplemento={setComplemento}
            />
            <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                <Typography variant="body1" className="label">Nome do responsável legal*</Typography>
                <TextField name="nomeResponsavelLegal" placeholder="Nome completo do responsável legal" value={nomeResponsavelLegal} onChange={(e) => setNomeResponsavelLegalUsuarioCNPJ(e.target.value)} required fullWidth/>
            </Grid>
            <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                <Typography variant="body1" className="label">CPF do responsável legal*</Typography>
                <TextField name="cpfResponsavelLegal" placeholder="000.000.000-00" value={cpfResponsavelLegal} onChange={(e) => setCpfResponsavelLegalUsuarioCNPJ(e.target.value)} required fullWidth/>
            </Grid>
            <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                <Typography variant="body1" className="label">Inscrição Estatual/Municipal*</Typography>
                <TextField name="inscricaoEstadualMunicipal" placeholder="000000000" value={inscricaoEstadualMunicipal} onChange={(e) => setInscricaoEstadualMunicipalUsuarioCNPJ(e.target.value)} required fullWidth/>
            </Grid>
            <InputsSenha  senha={senha}  setSenha={setSenha}
                          confirmarSenha={confirmarSenha}  setConfirmarSenha={setConfirmarSenha}
            />
            <Grid item xs={12} justifyContent="flex-end">
                <Stack spacing={2} direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" >
                    <Button variant="outlined" onClick={() => navigate(navegacao)}>Voltar</Button>
                    <Button variant="contained" type="submit">{acaoButton}</Button>
                    {idParam ? <Button variant="outlined" color="error" onClick={exclude}>Excluir</Button> : false}
                </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
  );
}

export default CadastroUsuarioCNPJ;