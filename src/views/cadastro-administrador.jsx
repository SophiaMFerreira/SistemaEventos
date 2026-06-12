import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import { Grid, Paper, Typography, TextField, Stack, Button } from "@mui/material";
import InputsEndereco from "../components/form-inputsEndereco";
import InputsSenha from "../components/form-inputsSenha";
import "../style/cadastro.css";

import { formatarCPF, TextMaskCPF } from "../utils/cpf";
import { formatarCEP} from "../utils/endereco";
import { formatarCelular, TextMaskCelular } from "../utils/celular";
import { validarDados } from "../utils/validacoes";

import axios from 'axios';
import { BASE_URL } from '../config/axios';



function CadastroAdministrador(){
      const baseURL = `${BASE_URL}/usuario`;
      const { idParam } = useParams();
      const navigate = useNavigate();
  
      const [acao, setAcao] = useState("Cadastro");
      const [mensagem, setMensagem] = useState("Faça cadastro de novos");
      const [acaoButton, setAcaoButton] = useState("Criar");
      const [navegacao, setNavegacao] = useState("/");
      
      const [id, setIdAdministrador] = useState("");
      const [nome, setNomeAdministrador] = useState("");
      const [cpf, setCpfAdministrador] = useState("");
      const [dataNascimento, setDataNascimentoUsuarioCPF] = useState("");
      const [genero, setGeneroUsuarioCPF] = useState("placeholder");
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
        setDataNascimentoUsuarioCPF(dados.data);
        setGeneroUsuarioCPF(dados.genero);
        setCelular(dados.celular);
        setEmailAdministrador(dados.email);
        
        if (dados.endereco) {
          setCep(dados.endereco.cep);
          setLogradouro(dados.endereco.logradouro);
          setNumero(dados.endereco.numero);
          setComplemento(dados.endereco.complemento);
          setBairro(dados.endereco.bairro);
          setCidade(dados.endereco.cidade);
          setEstado(dados.endereco.estado);
        }
        
        setAcao("Edição");
        setMensagem("Faça edição dos");
        setAcaoButton("Editar");
        setNavegacao("/listagem-eventos");
      });
  }, [idParam, baseURL]);

  async function save(e) {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      mensagemErro("As senhas não coincidem");
      return;
    }

    const cpfFormatado = formatarCPF(cpf);
    const cepFormatado = formatarCEP(cep);
    const celularFormatado = formatarCelular(celular);

    const endereco = {
      cep: cepFormatado,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado
    };
     
    const data = {
                  tipoUsuario: "PF",
                  nome,
                  cpf: cpfFormatado,
                  data: dataNascimento,
                  genero: genero === "placeholder" ? "" : genero,
                  email,
                  celular: celularFormatado,
                  senha,
                  endereco,
                  perfis: ["ADMINISTRADOR"]
    };

    try {
      if(!validarDados({dataNascimento, cpf, celular, senha})){
        return
      }

      if (!idParam) {
          await axios.post(baseURL, data);
          mensagemSucesso(`Bem vindo ${nome}!`);
        } else {
          await axios.put(`${baseURL}/${id}`, data);
          mensagemSucesso(`${nome} seus dados foram alterados com sucesso!`);
        }
    } catch (error) {
      mensagemErro(error?.response?.data || "Erro ao salvar os dados.");
    }
    navigate("/listagem-eventos");
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
        navigate(`/`);
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir o admninistrador`);
      });
  }

  return (
    <Grid container direction="column" sx={{ mt: 6, minHeight: "100vh", width: "100%", overflow: "hidden", justifyContent: "center", alignItems: "center", px: { xs: 1, sm: 3 } }} >
        <Paper elevation={3} sx={{ width: "100%", maxWidth: 900, maxHeight: "90vh", overflowY: "auto", p: { xs: 2, sm: 4 }}}>
            <Typography component="h1" variant="h3">{acao} de Administrador</Typography>
            <Typography variant="subtitle1" className="label" sx={{ mb: 3 }}>{mensagem} administradores.</Typography>
             <Grid container component="form" onSubmit={save} noValidate spacing={2} >
                  <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                      <Typography variant="body1" className="label">Nome*</Typography>
                      <TextField name="nome" placeholder="Nome do administrador" value={nome} onChange={(e) => setNomeAdministrador(e.target.value)}  required fullWidth />
                  </Grid>
                  <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                      <Typography variant="body1" className="label">CPF*</Typography>
                      <TextField
                        name="cpf"
                        placeholder="000.000.000-00" 
                        value={cpf}
                        onChange={(e) => setCpfAdministrador(e.target.value)}
                        required
                        fullWidth
                        InputProps={{
                          inputComponent: TextMaskCPF,
                        }}
                      />
                  </Grid>
                  <Grid container size={12} sx={{ mb: 2, mx: 2, width: "100%", justifyContent: "space-between"} } direction={"row"}>
                <Grid size={6} sx={{ width: "48%", boxSizing: "border-box", maxWidth: "100%"}}>
                    <Typography variant="body1" className="label">Data de nascimento*</Typography>
                    <TextField name="dataNascimento" type="date" value={dataNascimento} onChange={(e) => setDataNascimentoUsuarioCPF(e.target.value)} required fullWidth/>
                </Grid>
                <Grid size={6} sx={{ width: "48%", boxSizing: "border-box", maxWidth: "100%"}}>
                    <Typography variant="body1" className="label">Gênero</Typography>
                    <Select
                          name="genero"
                          id="generoUsuario"
                          value={genero}
                          onChange={select}
                          required
                          fullWidth
                        >
                            <MenuItem value="placeholder" disabled>
                              Selecione um gênero
                            </MenuItem>
                            <MenuItem value={"femenino"}>Feminino</MenuItem>
                            <MenuItem value={"masculino"}>Masculino</MenuItem>
                            <MenuItem value={"lgbtqia+"}>LGBTQIA+</MenuItem>
                            <MenuItem value={"naoDeclarar"}>Prefiro não declarar</MenuItem>
                        </Select>
                </Grid>
            </Grid>
                  <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                      <Typography variant="body1" className="label">Email para contato*</Typography>
                      <TextField name="email" placeholder="administrador@email.com" type="email" value={email} onChange={(e) => setEmailAdministrador(e.target.value)} required fullWidth/>
                  </Grid>
                  <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                      <Typography variant="body1" className="label">Celular para contato*</Typography>
                      <TextField
                        name="celular"
                        placeholder="(32)) 00000-0000"
                        value={celular}
                        onChange={(e) => setCelular(e.target.value)}
                        required
                        fullWidth
                        InputProps={{
                          inputComponent: TextMaskCelular,
                        }}
                      />
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