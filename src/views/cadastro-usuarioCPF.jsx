import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import { Grid, Paper, Typography, TextField, Stack, Button, FormControlLabel, Checkbox, MenuItem, Select } from "@mui/material";
import InputsEndereco from "../components/form-inputsEndereco";
import InputsSenha from "../components/form-inputsSenha";
import "../style/cadastro.css";

import axios from 'axios';
import { BASE_URL_S } from '../config/axios';

function CadastroUsuarioCPF() {
    const baseURL = `${BASE_URL_S}/participanteCPF`;
    const { idParam } = useParams();
    const navigate = useNavigate();

    const [acao, setAcao] = useState("Cadastro");
    const [mensagem, setMensagem] = useState("Faça cadastro com seus dados, promova e participe de eventos incríveis!");
    const [acaoButton, setAcaoButton] = useState("Criar conta");
    const [navegacao, setNavegacao] = useState("/");
       
    const [id, setIdUsuarioCPF] = useState("");
    const [nome, setNomeUsuarioCPF] = useState("");
    const [cpf, setCPFUsuarioCPF] = useState("");
    const [dataNascimento, setDataNascimentoUsuarioCPF] = useState("");
    const [genero, setGeneroUsuarioCPF] = useState('Selecionar gênero');
    const [email, setEmailUsuarioCPF] = useState("");
    const [celular, setCelularUsuarioCPF] = useState("");
   
    const [cep, setCep] = useState("");
    const [logradouro, setLogradouro] = useState("");
    const [numero, setNumero] = useState("");
    const [complemento, setComplemento] = useState("");
    const [bairro, setBairro] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
 
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
            setNavegacao("/listagem-eventos");
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
          } else {
            await axios.put(`${baseURL}/${idParam}`, data);
              mensagemSucesso(`${nome} seus dados foram alterados com sucesso!`);
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
        mensagemSucesso(`Usuário ${nome} excluído com sucesso!`);
        navigate(`/`);
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir o usuário ${nome}`);
      });
  }

  return (
      <Grid container direction="column" sx={{ minHeight: "100vh", width: "100%", overflow: "hidden", justifyContent: "center", alignItems: "center", px: { xs: 1, sm: 3 } }} >
        <Paper elevation={3} sx={{ width: "100%", maxWidth: 900, maxHeight: "90vh", overflowY: "auto", p: { xs: 2, sm: 4 }}}>
          <Typography component="h1" variant="h3">{acao} de Usuários</Typography>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>{mensagem}</Typography>

          <FormControlLabel control={<Checkbox checked={false} disabled={idParam ? true : false} onClick={() => navigate("/cadastro-usuarioCNPJ")}/>} label="Sou CNPJ" />

          <Grid container component="form" onSubmit={save} noValidate spacing={2} sx={{ justifyContent: "center", alignItems: "stretch"}}>
            <Grid size={10}>
                <Typography variant="body1" className="label">Nome*</Typography>
                <TextField name="nome" placeholder="Nome do usuário" value={nome} onChange={(e) => setNomeUsuarioCPF(e.target.value)} required fullWidth sx={{ mb: 2, }}/>
            </Grid>
            <Grid size={10}>
                <Typography variant="body1" className="label">CPF*</Typography>
                <TextField name="cpf" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCPFUsuarioCPF(e.target.value)} required fullWidth sx={{ mb: 2, }}/>
            </Grid>
            <Grid size={10}>
                <Grid container spacing={2} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                    <Grid size={6} spacing={2}>
                        <Typography variant="body1" className="label">Data de nascimento*</Typography>
                        <TextField name="dataNascimento" type="date" value={dataNascimento} onChange={(e) => setDataNascimentoUsuarioCPF(e.target.value)} required fullWidth sx={{ mb: 2, }}/>
                    </Grid>
                    <Grid size={6} spacing={2}>
                        <Typography variant="body1" className="label">Gênero</Typography>
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
                <Typography variant="body1" className="label">Email para contato*</Typography>
                <TextField name="email" placeholder="usuario@email.com" type="email" value={email} onChange={(e) => setEmailUsuarioCPF(e.target.value)} required fullWidth sx={{ mb: 2, }}/>
            </Grid>
            <Grid size={10}>
                <Typography variant="body1" className="label">Celular para contato*</Typography>
                <TextField name="celular" placeholder="+00 (00) 00000-0000" value={celular} onChange={(e) => setCelularUsuarioCPF(e.target.value)} required fullWidth sx={{ mb: 2, }}/>
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

export default CadastroUsuarioCPF;
