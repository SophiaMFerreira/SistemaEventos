import React from "react";

function BuscarEvento({ value, onChange, placeholder = "Digite para buscar..." }) {
  return (
    <input
      type="text"
      className="form-control my-3"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default BuscarEvento;
