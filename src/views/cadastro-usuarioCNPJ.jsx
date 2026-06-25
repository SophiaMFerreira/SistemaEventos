import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import { Grid, Paper, Typography, TextField, Stack, Button, FormControlLabel, Checkbox } from "@mui/material";
import InputsEndereco from "../components/form-inputsEndereco";
import InputsSenha from "../components/form-inputsSenha";
import "../style/cadastro.css";

import {api} from '../config/axios';

import React from 'react';
import { IMaskInput } from 'react-imask';

const TextMaskCNPJ = React.forwardRef(function TextMaskCNPJ(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="00.000.000/0000-00"
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

function CadastroUsuarioCNPJ() {
    const baseURL = '/usuario';
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
      api.get(`${baseURL}/${idParam}`).then((response) => {
        const dados = response.data;
        setIdUsuarioCNPJ(dados.id);
        setRazaoSocialUsuarioCNPJ(dados.razaoSocial);
        setNomeFantasiaUsuarioCNPJ(dados.nomeFantasia);
        setCNPJUsuarioCNPJ(dados.cnpj);
        setEmailUsuarioCNPJ(dados.email);
        setCelularUsuarioCNPJ(dados.celular);
        setInscricaoEstadualMunicipalUsuarioCNPJ(dados.inscricaoEstadualMunicipal);
        
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
      
      const senhaValida = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;
      const cnpjValido = /^\d{14}$/;
      const celularValido = /^\d{11}$/;
      const celularCom9 = /^9/;

      if (!cnpjValido.test(cnpj)) {
        mensagemErro("CNPJ inválido ou incompleto.");
        return;
      }

      if (!celularValido.test(celular) || !celularCom9.test(celular.substring(2))) {
        mensagemErro("Celular inválido. Use um número móvel que comece com 9 após o DDD.");
        return;
      }

      if (!senhaValida.test(senha)) {
        mensagemErro("Senha deve ter mínimo 6 caracteres e incluir número, maiúscula, minúscula e símbolo");
        return;
      }

      const cnpjFormatado = cnpj.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        "$1.$2.$3/$4-$5"
      );

      const celularFormatado = celular.replace(
        /^(\d{2})(\d{5})(\d{4})$/,
        "($1) $2-$3"
      );

      const cepFormatado = cep.replace(
        /^(\d{5})(\d{3})$/,
        "$1-$2"
      );

      const data = {
        tipoUsuario: "PJ",
        razaoSocial,
        nomeFantasia,
        cnpj: cnpjFormatado,
        inscricaoEstadualMunicipal,
        email,
        celular: celularFormatado,
        senha,
        endereco: {
          cep: cepFormatado,
          logradouro,
          numero,
          complemento,
          bairro,
          cidade,
          estado
        },
        perfis: ["PARTICIPANTE"]
      };

      try {
        if (!idParam) {
          await api.post(baseURL, data);
          mensagemSucesso(`Bem vindo ${nomeFantasia}!`);
          navigate(`/`);
        } else {
          await api.put(`${baseURL}/${id}`, data);
          mensagemSucesso(`${nomeFantasia} seus dados foram alterados com sucesso!`);
        }
        navigate("/listagem-eventos");
      } catch (error) {
        mensagemErro(error?.response?.data?.message || "Erro ao salvar usuário");
      }
    }

    async function exclude() {
      let url = `${baseURL}/${id}`;
      await api
        .delete(url)
        .then(() => {
          mensagemSucesso(`Usuário ${nomeFantasia} excluído com sucesso!`);
          navigate(`/`);
        })
        .catch(() => {
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
                <TextField
                  name="cnpj"
                  placeholder="00.000.000/0001-00"
                  value={cnpj}
                  onChange={(e) => setCNPJUsuarioCNPJ(e.target.value)}
                  required
                  fullWidth
                  InputProps={{ inputComponent: TextMaskCNPJ }}
                />
            </Grid>
            <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                <Typography variant="body1" className="label">Email*</Typography>
                <TextField name="email" placeholder="empresa@email.com" type="email" value={email} onChange={(e) => setEmailUsuarioCNPJ(e.target.value)} required fullWidth/>
            </Grid>
            <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                <Typography variant="body1" className="label">Celular*</Typography>
                <TextField
                  name="celular"
                  placeholder="(32) 99999-9999"
                  value={celular}
                  onChange={(e) => setCelularUsuarioCNPJ(e.target.value)}
                  required
                  fullWidth
                  InputProps={{ inputComponent: TextMaskCelular }}
                />
            </Grid>
            <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
                <Typography variant="body1" className="label">Inscrição Estadual/Municipal*</Typography>
                <TextField name="inscricaoEstadualMunicipal" placeholder="000000000" value={inscricaoEstadualMunicipal} onChange={(e) => setInscricaoEstadualMunicipalUsuarioCNPJ(e.target.value)} required fullWidth/>
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

export default CadastroUsuarioCNPJ;
