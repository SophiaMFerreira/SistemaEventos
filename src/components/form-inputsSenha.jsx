import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';

function InputsSenha({senha, setSenha, confirmarSenha, setConfirmarSenha}) {
  const validacao = (senha !== confirmarSenha && confirmarSenha !== "");

  return (
    <Grid container size={12} sx={{width: "100%"}} direction={"row"}>
        <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
              <Typography variant="body1" className="label">Senha*</Typography>
              <TextField name="senha" type="password" placeholder="********" value={senha} error={validacao} onChange={(e) => setSenha(e.target.value)} required fullWidth/>
        </Grid>
        <Grid size={12} sx={{ mb: 2, mx: 2, width: "100%"}}>
              <Typography variant="body1" className="label">Confirmar senha*</Typography>
              <TextField name="confirmarSenha" type="password" placeholder="********" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} error={validacao} helperText={validacao ? "As senhas não coincidem" : ""} required fullWidth/>
        </Grid>
    </Grid>
  );
}

export default InputsSenha;
