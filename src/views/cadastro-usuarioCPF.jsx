import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import { Grid, Paper, Typography, TextField, Stack, Button, FormControlLabel, Checkbox, MenuItem, Select } from "@mui/material";
import InputsEndereco from "../components/form-inputsEndereco";
import InputsSenha from "../components/form-inputsSenha";
import "../style/cadastro.css";

import axios from 'axios';
import { BASE_URL } from '../config/axios';

import React from 'react';
import { IMaskInput } from 'react-imask';


const TextMaskCPF = React.forwardRef(function TextMaskCPF(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="000.000.000-00"
      definitions={{ '0': /[0-9]/ }}
      inputRef={ref}
      unmask="typed"
      onAccept={(value, maskRef) =>
        onChange?.({
          target: {
            name: props.name,
            value: maskRef.unmaskedValue
          }
        })
      }
    />
  );
});

const TextMaskCelular = React.forwardRef(function TextMaskCelular(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(00) 00000-0000"
      definitions={{ '0': /[0-9]/ }}
      inputRef={ref}
      unmask="typed"
      onAccept={(value, maskRef) =>
        onChange?.({
          target: {
            name: props.name,
            value: maskRef.unmaskedValue
          }
        })
      }
    />
  );
});

function CadastroUsuarioCPF() {
    const baseURL = `${BASE_URL}/usuario`;
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
    const [genero, setGeneroUsuarioCPF] = useState("placeholder");    
    const [celular, setCelularUsuarioCPF] = useState("");
    const [email, setEmailUsuarioCPF] = useState(""); 
    
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
        setDataNascimentoUsuarioCPF(dados.data);
        setGeneroUsuarioCPF(dados.genero);
        setCelularUsuarioCPF(dados.celular);
        setEmailUsuarioCPF(dados.email);
        
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
        setMensagem("Edite seus dados aqui.");
        setAcaoButton("Editar");
        setNavegacao("/listagem-eventos");
      }).catch(() => mensagemErro("Erro ao carregar usuário"));
    }, [idParam, baseURL]);
    
    async function save(e) {
      e.preventDefault();
      if (senha !== confirmarSenha) {
        mensagemErro("As senhas não coincidem");
        return;
      }
        
      const cepFormatado = cep.replace(
  /^(\d{5})(\d{3})$/,
  "$1-$2"
);

const endereco = {
  cep: cepFormatado,
  logradouro,
  numero,
  complemento,
  bairro,
  cidade,
  estado
};

  const cpfFormatado = cpf.replace(
  /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
  "$1.$2.$3-$4"
);

const celularFormatado = celular.replace(
  /^(\d{2})(\d{5})(\d{4})$/,
  "($1) $2-$3"
);

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
  perfis: ["PARTICIPANTE"]
};

      try {
        const senhaValida = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;
        const cpfValido = /^\d{11}$/;      // Aceita 11 números limpos
        const celularValido = /^\d{11}$/;
        const celularCom9 = /^9/;
          // Aceita 11 números limpos

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const [ano, mes, dia] = dataNascimento.split('-');
        const nascimento = new Date(ano, mes - 1, dia); 

        if (!cpfValido.test(cpf)) {
          mensagemErro("CPF inválido ou incompleto.");
          return;
        }

        if (!celularValido.test(celular) || !celularCom9.test(celular.substring(2))) {
  mensagemErro("Celular inválido. Use um número móvel que comece com 9 após o DDD.");
  return;
}

        if (!senhaValida.test(senha)) {
          mensagemErro("A senha deve conter letra maiúscula, minúscula, número e caractere especial.");
          return;
        }

        if (nascimento >= hoje) {
          mensagemErro("A data de nascimento deve ser menor que a data de hoje.");
          return;
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
    }

    async function exclude() {
      let url = `${baseURL}/${id}`;
      await axios
        .delete(url)
        .then(() => {
          mensagemSucesso(`Usuário ${nome} excluído com sucesso!`);
          navigate(`/`);
        })
        .catch(() => {
          mensagemErro(`Erro ao excluir o usuário ${nome}`);
        });
    }

    return (
      <Grid container direction="column" sx={{ minHeight: "100vh", width: "100%", overflow: "hidden", justifyContent: "center", alignItems: "center", px: { xs: 1, sm: 3 } }} >
        <Paper elevation={3} sx={{ width: "100%", maxWidth: 900, maxHeight: "90vh", overflowY: "auto", p: { xs: 2, sm: 4 }}}>
          <Typography component="h1" variant="h3">{acao} de Usuários</Typography>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>{mensagem}</Typography>

          <FormControlLabel control={<Checkbox checked={false} disabled={idParam ? true : false} onClick={() => navigate("/cadastro-usuarioCNPJ")}/>} label="Sou CNPJ"/>

          <Grid container component="form" onSubmit={save} noValidate spacing={2} >
            <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}} >
                <Typography variant="body1" className="label">Nome*</Typography>
                <TextField name="nome" placeholder="Nome do usuário" value={nome} onChange={(e) => setNomeUsuarioCPF(e.target.value)} required fullWidth />
            </Grid>
            <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                <Typography variant="body1" className="label">CPF*</Typography>
                <TextField 
                  name="cpf" 
                  placeholder="000.000.000-00" 
                  value={cpf} 
                  onChange={(event) => setCPFUsuarioCPF(event.target.value)} 
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
                <TextField name="email" placeholder="usuario@email.com" type="email" value={email} onChange={(e) => setEmailUsuarioCPF(e.target.value)} required fullWidth/>
            </Grid>
            <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                <Typography variant="body1" className="label">Celular para contato*</Typography>
                <TextField 
                  name="celular" 
                  placeholder="(32) 99999-9999" 
                  value={celular} 
                  onChange={(event) => setCelularUsuarioCPF(event.target.value)} 
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
