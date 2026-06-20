import React from "react";
import { IMaskInput } from 'react-imask';

export const TextMaskCelular = React.forwardRef(function TextMaskCelular(
  props,
  ref
) {
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

export function formatarCelular(celular){
  const cell = celular.replace(/\D/g, '');

  return cell.replace(
        /^(\d{2})(\d{5})(\d{4})$/,
        "($1) $2-$3"
    );
}
