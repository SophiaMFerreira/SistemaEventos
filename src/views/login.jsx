import React from "react";
import "../style/login.css";
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, TextField, Button, Card } from "@mui/material";
import { mensagemErro } from "../components/toastr"; 
import imagemBaloes from "../components/baloesLogin.png"

function Login() {
    const navigate = useNavigate();
   
    const [email, setEmail] = React.useState("");
    const [senha, setSenha] = React.useState("");
    const [validacao, setValidacao] = React.useState(false);
 
    async function fazerLogin(e) {
        e.preventDefault();
        try {
          if (senha === senha || email === email) {
              navigate(`/tela-principal`);
          } else {
                setValidacao(true);
                return;
          }
        } catch (error) {
          mensagemErro(error.response.data);
        }
    }

    return(
        <Grid container direction="row" id="gridLogin" sx={{justifyContent: "center"}}>
            <img id="imagemBaloes" src={imagemBaloes}  alt={"Balão transparente com brilhos laranja e azuis refletidos."}/>
            <Grid size={5} container direction="column" component="form" onSubmit={fazerLogin} noValidate sx={{padding: 5, boxSizing: "border-box", textAlign: "left"}}>
                <Typography variant="h1" className="logo" >Event+</Typography>
                <Typography variant="h1" id="titulo">Login</Typography>
                <Typography variant="subtitle1" sx={{mt: 1}}>Faça login com os dados inseridos durante seu cadastro.</Typography>
                
                <Typography variant="body1" sx={{mt: 2}}>Email*</Typography>
                    <TextField name="email" type="email" placeholder="meuEmail@mail.com" required value={email} onChange={(e) => setEmail(e.target.value)} fullWidth sx={{ mb: 1}}/>
                <Typography variant="body1">Senha*</Typography>
                    <TextField type="password" placeholder="********" required value={senha} onChange={(e) => setSenha(e.target.value)} error={validacao} helperText={validacao ? "Senha ou email incorretos" : ""} fullWidth sx={{ mb: 2 }}/>
                <Button variant="contained" type="submit" fullWidth>Entrar</Button>
                <a href="/tela-principal" className="linkEsqueciSenha" sx={{mt: 3}}>
                    <Typography variant="body1">Você esqueceu a sua senha?</Typography>
                </a>
                <Card variant="outlined" sx={{padding: 3, display: "flex", flexDirection: "column", gap: 1, textAlign: "left", mt: 5}}>
                    <Typography variant="h2" id="tituloSecundario">Cadastre-se</Typography>
                    <Typography variant="body2">Cadastre-se e aproveite ótimos eventos.</Typography>
                    <Button variant="outlined" onClick={() => navigate("/cadastro-usuarioCPF")} sx={{mt: 1}}>Criar Conta</Button>
                </Card>    
            </Grid>
        </Grid>      
    );
}
export default Login;