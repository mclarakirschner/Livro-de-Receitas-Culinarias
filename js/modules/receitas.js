import { SUPABASE_URL, API_KEY } from "./config.js";
import { logout } from "./auth.js";

const token = localStorage.getItem("sb_token");

// Buscar receitas
export async function buscarReceita() {
  const user = JSON.parse(localStorage.getItem("sb_user"));
  if (!token || !user) {
    window.location.href = "index.html";
    return [];
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/receitas?select=*,categorias(descricao)&user_id=eq.${user.id}`, {
    headers: {
      "apikey": API_KEY,
      "Authorization": `Bearer ${token}`
    }
  });

  if (res.status === 401) {
    logout();
  }

  return res.json();
}

// Adicionar receita
export async function adicionarReceita(receita) {
  const user = JSON.parse(localStorage.getItem("sb_user"));
  if (!token || !user) {
    window.location.href = "index.html";
    return;
  }

  const receitaComUsuario = { ...receita, user_id: user.id };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/receitas`, {
    method: "POST",
    headers: {
      "apikey": API_KEY,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(receitaComUsuario)
  });

  if (res.status === 201) return true;

  if (res.ok) return res.json();

  try {
    const errorBody = await res.json();
    throw new Error(errorBody.message || `Erro do servidor: Status ${res.status}`);
  } catch (e) {
    throw new Error(`Falha na requisição: Status ${res.status}`);
  }
}

// Editar receita
export async function editarReceita(id, dados) {
  const user = JSON.parse(localStorage.getItem("sb_user"));
  if (!token || !user) {
    window.location.href = "index.html";
    return;
  }

  const dadosComUsuario = { ...dados, user_id: user.id };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/receitas?id=eq.${id}&user_id=eq.${user.id}`, {
    method: "PATCH",
    headers: {
      "apikey": API_KEY,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dadosComUsuario)
  });

  if (res.status === 204) return true;
  if (res.ok) return res.json();

  try {
    const errorBody = await res.json();
    throw new Error(errorBody.message || `Erro do servidor: Status ${res.status}`);
  } catch (e) {
    throw new Error(`Falha na requisição: Status ${res.status}`);
  }
}

// Excluir receita
export async function excluirReceita(id) {
  const user = JSON.parse(localStorage.getItem("sb_user"));
  if (!token || !user) {
    window.location.href = "index.html";
    return false;
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/receitas?id=eq.${id}&user_id=eq.${user.id}`, {
    method: "DELETE",
    headers: {
      "apikey": API_KEY,
      "Authorization": `Bearer ${token}`
    }
  });

  return res.ok;
}

// Buscar receita pelo ID
export async function buscarReceitaPeloId(id) {
  const user = JSON.parse(localStorage.getItem("sb_user"));
  if (!token || !user) {
    window.location.href = "index.html";
    return null;
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/receitas?id=eq.${id}&user_id=eq.${user.id}&select=*,categorias(descricao)`, {
    headers: {
      "apikey": API_KEY,
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error(`Erro ao buscar receita: ${res.statusText}`);
  }

  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}
