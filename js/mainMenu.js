import { verificaAutenticacao } from "./modules/auth.js";
import { logoutUi } from "./ui/authUi.js";

document.addEventListener('DOMContentLoaded', () => {
    if (!verificaAutenticacao()) {return}
    logoutUi()
})