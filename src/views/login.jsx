import { useState } from "react";
import "../style/login.css";
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, TextField, Button, Card, Box } from "@mui/material";
import { mensagemErro } from "../components/toastr"; 
import imagemBaloes from "../components/baloesLogin.png"

import axios from 'axios';
import { BASE_URL_S } from '../config/axios';

function Login() {
    const baseURLcpf = `${BASE_URL_S}/participanteCPF`;
    const baseURLcnpj = `${BASE_URL_S}/participanteCNPJ`;
    const baseURLadmin = `${BASE_URL_S}/administrador`;
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [validacao, setValidacao] = useState(false);
 
    async function fazerLogin(e) {
        e.preventDefault();
        setValidacao(false);
        try {
            const [cpfRes, cnpjRes, adminRes] = await Promise.all([
                axios.get(baseURLcpf),
                axios.get(baseURLcnpj),
                axios.get(baseURLadmin)
            ]);
            let usuario = cpfRes.data.find((u) => u.email === email /*&& u.senha === senha*/);
            let tipoParticipante = "cpf";
            if (!usuario) {
                usuario = cnpjRes.data.find((u) => u.email === email /*&& u.senha === senha*/);
                tipoParticipante = "cnpj";
            }
            if (!usuario) {
                usuario = adminRes.data.find((u) => u.email === email /*&& u.senha === senha*/);
                tipoParticipante = "admin";
            }
            if (!usuario) {
                setValidacao(true);
            return;
            }

            localStorage.setItem("idUsuario", usuario.id);
            localStorage.setItem("tipoParticipante", tipoParticipante);
            navigate(`/listagem-eventos`);
        } catch (error) {
          mensagemErro(error.response.data);
        }
    }

    return(
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
                    <Button variant="contained" type="submit" fullWidth sx={{ mt: 3 }}>Entrar</Button>
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