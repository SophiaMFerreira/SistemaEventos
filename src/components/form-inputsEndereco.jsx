import React from "react";
import { IMaskInput } from "react-imask";
import { Grid, Typography, TextField } from "@mui/material";

const TextMaskEstado = React.forwardRef(function TextMaskEstado(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="aa"
      prepareChar={(str) => str.toUpperCase()}
      definitions={{
        a: /[a-zA-Z]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange?.({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

function InputsEndereco({
  cep,
  setCep,
  logradouro,
  setLogradouro,
  bairro,
  setBairro,
  cidade,
  setCidade,
  estado,
  setEstado,
  numero,
  setNumero,
  complemento,
  setComplemento,
}) {
  return (
    <Grid
      container
      size={12}
      sx={{ width: "100%", pr: 2 }}
      direction={"column"}
    >
      <Grid
        container
        size={12}
        sx={{ mb: 2, mx: 2, width: "100%" }}
        direction={"row"}
      >
        <Grid
          size={6}
          spacing={2}
          sx={{
            width: "100%",
            boxSizing: "border-box",
            maxWidth: "50%",
            pr: 2,
          }}
        >
          <Typography variant="body1" className="label">
            CEP*
          </Typography>
          <TextField
            name="cep"
            placeholder="00000-000"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            required
            fullWidth
          />
        </Grid>
        <Grid
          size={6}
          spacing={2}
          sx={{
            width: "100%",
            boxSizing: "border-box",
            maxWidth: "50%",
            pr: 2,
          }}
        >
          <Typography variant="body1" className="label">
            Logradouro*
          </Typography>
          <TextField
            name="logradouro"
            placeholder="Rua/Avenida/Estrada dos Jaspes"
            value={logradouro}
            onChange={(e) => setLogradouro(e.target.value)}
            required
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid
        container
        size={12}
        sx={{ mb: 2, mx: 2, width: "100%" }}
        direction={"row"}
      >
        <Grid
          size={4}
          spacing={2}
          sx={{
            width: "100%",
            boxSizing: "border-box",
            maxWidth: "33%",
            pr: 2,
          }}
        >
          <Typography variant="body1" className="label">
            Bairro*
          </Typography>
          <TextField
            name="bairro"
            placeholder="Centro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            required
            fullWidth
          />
        </Grid>
        <Grid
          size={4}
          spacing={2}
          sx={{
            width: "100%",
            boxSizing: "border-box",
            maxWidth: "33%",
            pr: 2,
          }}
        >
          <Typography variant="body1" className="label">
            Cidade*
          </Typography>
          <TextField
            name="cidade"
            placeholder="Juiz de Fora"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            required
            fullWidth
          />
        </Grid>
        <Grid
          size={4}
          spacing={2}
          sx={{
            width: "100%",
            boxSizing: "border-box",
            maxWidth: "33%",
            pr: 2,
          }}
        >
          <Typography variant="body1" className="label">
            Estado*
          </Typography>
          <TextField
            name="estado"
            placeholder="MG"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
            fullWidth
            InputProps={{
              inputComponent: TextMaskEstado,
            }}
          />
        </Grid>
      </Grid>
      <Grid
        container
        size={12}
        sx={{ mb: 2, mx: 2, width: "100%" }}
        direction={"row"}
      >
        <Grid
          size={2}
          spacing={2}
          sx={{
            width: "100%",
            boxSizing: "border-box",
            maxWidth: "20%",
            pr: 2,
          }}
        >
          <Typography variant="body1" className="label">
            Número*
          </Typography>
          <TextField
            name="numero"
            placeholder="180"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            required
            fullWidth
          />
        </Grid>
        <Grid
          size={6}
          spacing={2}
          sx={{
            width: "100%",
            boxSizing: "border-box",
            maxWidth: "80%",
            pr: 2,
          }}
        >
          <Typography variant="body1" className="label">
            Complemento
          </Typography>
          <TextField
            name="complemento"
            placeholder="Casa A"
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
            required
            fullWidth
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default InputsEndereco;
