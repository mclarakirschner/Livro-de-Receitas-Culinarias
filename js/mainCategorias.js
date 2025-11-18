import { verificaAutenticacao } from "./modules/auth.js";
import { logoutUi } from "./ui/authUi.js";
import { carregarCategorias } from "./ui/categoriasUI.js";

document.addEventListener('DOMContentLoaded', () => {
    if (!verificaAutenticacao()) {return}
    logoutUi()
    carregarCategorias()
})