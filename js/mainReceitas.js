import { verificaAutenticacao } from "./modules/auth.js";
import { logoutUi } from "./ui/authUi.js";
import { popularCategorias, carregarReceita, datasReceitas} from "./ui/receitasUi.js"

document.addEventListener("DOMContentLoaded", () => {
  if (!verificaAutenticacao()) return;
  logoutUi()
  popularCategorias();
  carregarReceita();
  datasReceitas();
});