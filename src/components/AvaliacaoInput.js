import { useState, useEffect } from "react";

const AvaliacaoInput = ({ value, onChange, ...props }) => {
  const [avaliacao, setAvaliacao] = useState("");

  useEffect(() => {
    // Quando o value externo mudar, atualiza o estado interno formatado
    if (value !== undefined && value !== null) {
      let valStr = value.toString().replace(".", ",");
      setAvaliacao(valStr);
    }
  }, [value]);

  const handleChange = (e) => {
    let val = e.target.value;

    // Remove tudo que não for dígito
    val = val.replace(/\D/g, "");

    // Limita a dois dígitos brutos
    if (val.length > 2) val = val.slice(0, 2);

    // Primeiro dígito entre 0 e 5
    if (val.length >= 1) {
      let firstDigit = parseInt(val[0]);
      if (firstDigit < 0) firstDigit = 0;
      if (firstDigit > 5) firstDigit = 5;
      val = firstDigit.toString() + (val.length > 1 ? val[1] : "");
    }

    // Formata com vírgula
    if (val.length === 0) {
      setAvaliacao("");
      onChange("");
      return;
    } else if (val.length === 1) {
      // só o dígito, ex: "3"
      setAvaliacao(val);
      onChange(val);
      return;
    } else if (val.length === 2) {
      // dois dígitos, ex: "3,5"
      let formatted = `${val[0]},${val[1]}`;

      // Se for maior que 5,0, limita a 5,0
      if (parseFloat(formatted.replace(",", ".")) > 5.0) {
        formatted = "5,0";
      }

      setAvaliacao(formatted);
      onChange(formatted);
    }
  };

  return (
    <input
      type="text"
      className="form-control"
      value={avaliacao}
      onChange={handleChange}
      placeholder="0,0 a 5,0"
      inputMode="numeric"
      maxLength={4} // Ex: "5,0"
      {...props}
    />
  );
};

export default AvaliacaoInput;
