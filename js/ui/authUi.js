import { login, logout, signup } from "../modules/auth.js";

// ==========================================
// LOGIN
// ==========================================
export function loginUi() {
    const form = document.getElementById('formLogin');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita reload da página

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            Swal.fire({
                icon: 'error',
                title: 'Erro de login',
                text: 'É obrigatório informar o email e a senha para fazer o login',
                confirmButtonText: 'Tentar novamente'
            });
            return;
        }

        try {
            await login(email, password);
            await Swal.fire({
                icon: 'success',
                title: 'Login bem-sucedido!',
                text: 'Redirecionando para o menu...',
                showConfirmButton: false,
                timer: 1500
            });
            window.location.href = 'menu.html';
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao efetuar o login',
                text: err.message || 'Erro no login',
                confirmButtonText: 'Tentar novamente'
            });
        }
    });
}

// ==========================================
// LOGOUT
// ==========================================
export function logoutUi() {
    document.getElementById('btnLogout').addEventListener('click', logout);
}

// ==========================================
// CADASTRO DE NOVO USUÁRIO (SIGNUP)
// ==========================================
export function signUpUi() {
    const form = document.getElementById("formSignup");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // impede reload da página

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            await signup(email, password);
            await Swal.fire({
                icon: 'success',
                title: 'Usuário criado com sucesso!',
                text: 'Redirecionando para a tela de login...',
                showConfirmButton: false,
                timer: 1500
            });
            window.location.href = "index.html";
        } catch (err) {
            await Swal.fire({
                icon: 'error',
                title: 'Erro ao criar um novo Usuário',
                text: err.message || 'Ocorreu um erro desconhecido ao tentar criar um novo usuário.',
                confirmButtonText: 'Tentar Novamente',
                timer: 4000
            });
        }
    });
}
