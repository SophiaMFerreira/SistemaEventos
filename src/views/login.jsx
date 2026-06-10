import { useState } from "react";
import "../style/login.css";
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, TextField, Button, Card, Box, CircularProgress } from "@mui/material";
import { mensagemErro } from "../components/toastr";
import imagemBaloes from "../components/baloesLogin.png";
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function Login() {
  const baseURL = `${BASE_URL}/usuario`;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [validacao, setValidacao] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fazerLogin(e) {
    e.preventDefault();
    setValidacao(false);

    const emailTrim = email.trim().toLowerCase();
    const senhaTrim = senha.trim();

    if (!emailTrim || !senhaTrim) {
      setValidacao(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(baseURL);
      const usuarios = response.data || [];

      console.log("Resposta API:", response.data);
console.log("Email digitado:", emailTrim);
console.log("Senha digitada:", senhaTrim);

      const usuario = usuarios.find(
  (u) => (u.email || "").toLowerCase() === emailTrim
);

      if (!usuario) {
        setValidacao(true);
        setLoading(false);
        return;
      }

      const tipoParticipante = usuario.tipoUsuario || (
        usuario.perfis?.includes("ADMINISTRADOR")
          ? "admin"
          : usuario.perfis?.includes("PARTICIPANTE")
            ? "participante"
            : "usuario"
      );

      const nomeUsuario = usuario.nome || usuario.nomeFantasia || usuario.razaoSocial || "";

      localStorage.setItem("idUsuario", usuario.id);
      localStorage.setItem("tipoParticipante", tipoParticipante);
      localStorage.setItem("nomeUsuario", nomeUsuario);
      localStorage.setItem("isAuthenticated", "true");

      navigate(`/listagem-eventos`, { replace: true });
    } catch (error) {
      mensagemErro(error?.response?.data?.message || "Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Grid container sx={{position: "relative", height: "100vh", width: "100vw"}}>
      <Grid item xs={12} md={6} sx={{ height: "100%", display: { xs: "none", md: "block" }, alignItems: "center", justifyContent: "center", overflow: "hidden"}}>
        <Box component="img" id="imagemBaloes" src={imagemBaloes} alt="Balões decorativos" sx={{ position: "relative", width: "100%", height: "100%", objectFit: "cover", display: "block" }}/>
      </Grid>
      <Grid xs={12} md={6} sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow:"auto", px: { xs: 5, sm: 6 } }}>
        <Grid component="form" onSubmit={fazerLogin} noValidate sx={{ width: "100%", maxWidth: 900, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <Typography variant="h1" className="logo" >Event+</Typography>
          <Typography variant="h1" id="titulo">Login</Typography>
          <Typography variant="subtitle1" sx={{mt: 1}}>Faça login com os dados inseridos durante seu cadastro.</Typography>

          <Typography variant="body1" mt={3}>Email*</Typography>
            <TextField name="email" type="email" placeholder="meuEmail@mail.com" required value={email} onChange={(e) => setEmail(e.target.value)} fullWidth/>
          <Typography variant="body1"mt={2}>Senha*</Typography>
            <TextField type="password" placeholder="********" required value={senha} onChange={(e) => setSenha(e.target.value)} error={validacao} helperText={validacao ? "Senha ou email incorretos" : ""} fullWidth />
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 3 }} disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : "Entrar"}
          </Button>
          <a href="/cadastro-usuarioCPF" className="linkEsqueciSenha" sx={{mt: 3}}>
            <Typography variant="body1">Você esqueceu a sua senha?</Typography>
          </a>

          <Card variant="outlined" sx={{ mt: 5, p: 3 }}>
            <Typography variant="h2" id="tituloSecundario">Cadastre-se</Typography>
            <Typography variant="body2">Cadastre-se e aproveite ótimos eventos.</Typography>
            <Button variant="outlined" onClick={() => navigate("/cadastro-usuarioCPF")} fullWidth sx={{mt: 1}}>Criar Conta</Button>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}
export default Login;
