// src/utils/yearUtils.js

const MIN_YEAR = 1400;

/**
 * Retorna o ano atual dinâmico, sempre atualizado ao chamar
 * @returns {number}
 */
export function getCurrentYear() {
  return new Date().getFullYear();
}

/**
 * Valida se o ano é um número inteiro válido entre MIN_YEAR e o ano atual
 * @param {string|number} yearInput - O ano em string ou número
 * @returns {boolean} true se válido, false se inválido
 */
export function isValidYear(yearInput) {
  if (typeof yearInput === "string") {
    if (!/^\d{4}$/.test(yearInput)) return false; // só aceita 4 dígitos
    yearInput = parseInt(yearInput, 10);
  }
  if (typeof yearInput !== "number" || isNaN(yearInput)) return false;
  if (!Number.isInteger(yearInput)) return false;

  const currentYear = getCurrentYear();
  return yearInput >= MIN_YEAR && yearInput <= currentYear;
}

/**
 * Normaliza a entrada do ano para número inteiro válido
 * Retorna null se inválido
 * @param {string|number} input
 * @returns {number|null}
 */
export function normalizeYear(input) {
  if (!input) return null;

  const yearStr = input.toString().trim();
  if (!/^\d{4}$/.test(yearStr)) return null;

  const year = parseInt(yearStr, 10);
  const currentYear = getCurrentYear();

  if (year < MIN_YEAR || year > currentYear) return null;
  return year;
}

/**
 * Compara dois anos para priorizar o mais recente (ordem decrescente)
 * @param {number} a
 * @param {number} b
 * @returns {number} >0 se b > a, <0 se a > b, 0 se iguais
 */
export function compareYearsDesc(a, b) {
  return b - a;
}

/**
 * Formata o ano para string (ex: "2023")
 * Se inválido, retorna string vazia
 * @param {number|string} yearInput
 * @returns {string}
 */
export function formatYear(yearInput) {
  const normalized = normalizeYear(yearInput);
  return normalized !== null ? normalized.toString() : "";
}
