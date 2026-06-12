import React from "react";
import { IMaskInput } from 'react-imask';

interface TextMaskCPFProps {
  name?: string;
  onChange?: (event: {
    target: {
      name?: string;
      value: string;
    };
  }) => void;
}

export const TextMaskCPF = React.forwardRef<
  HTMLInputElement,
  TextMaskCPFProps
  >(function TextMaskCPF(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="000.000.000-00"
      definitions={{ '0': /[0-9]/ }}
      inputRef={ref}
      unmask="typed"
      onAccept=
      {(value, maskRef) =>
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

export function formatarCPF(cpf : string) {
  const nros = cpf.replace(/\D/g, '');

  return nros.replace(
            /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
            "$1.$2.$3-$4"
    );
}