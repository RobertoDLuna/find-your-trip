// Módulo nativo do Node.js para leitura e escritaem arquivos JSON
import fs from "fs";
import path from "path";
import { Driver } from "../interfaces/interfaces";

// Caminho para meu arquivo JSON
const dbPath = path.join(__dirname, "mockDatabase.json");

// Função para leitura dos dados
export const readDatabase = () => {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
};

// Função para escrever dados
export const writeDatabase = (newData: Driver): void => {
  fs.writeFileSync(dbPath, JSON.stringify(newData, null, 2), "utf-8");
};
