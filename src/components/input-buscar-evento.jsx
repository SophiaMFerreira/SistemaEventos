import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function BuscarEvento({ value, onChange, placeholder = "Buscar evento..." }) {
  return (
    <TextField 
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: "#888" }} />
          </InputAdornment>
        ),
      }}
      sx={{
        width: "50%",
        backgroundColor: "#fff",
        borderRadius: "12px",
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          "& fieldset": {
            borderColor: "#eee",
          },
          "&:hover fieldset": {
            borderColor: "#1E66F5",
          },
        },
      }}
    />
  );
}

export default BuscarEvento;
