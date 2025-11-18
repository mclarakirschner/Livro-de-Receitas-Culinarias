import { buscarReceita, adicionarReceita, editarReceita, excluirReceita, buscarReceitaPeloId } from "./../modules/receitas.js";
import { buscarCategorias } from "./../modules/categorias.js";

// =====================================================
// POPULAR CATEGORIAS NO SELECT
// =====================================================
export async function popularCategorias() {
    const select = document.getElementById("categoria_id");
    select.innerHTML = '<option value="" disabled selected>Selecione a Categoria</option>';

    try {
        const categorias = await buscarCategorias();

        categorias.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.descricao;
            option.className = "bg-amber-100 hover:bg-amber-200";
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        const option = document.createElement("option");
        option.textContent = "Erro ao carregar categorias";
        option.disabled = true;
        select.appendChild(option);
    }
}

// =====================================================
// CARREGAR RECEITAS NA TABELA
// =====================================================
export async function carregarReceita() {
    const dados = await buscarReceita();
    const tbody = document.getElementById("tabelaReceitas");
    tbody.innerHTML = "";

    if (!dados || dados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-gray-500">Nenhuma receita cadastrada.</td></tr>`;
        return;
    }

    dados.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="border p-2">${r.categorias?.descricao || "-"}</td>
            <td class="border p-2">${r.titulo}</td>
            <td class="border p-2 text-left whitespace-pre-wrap">${r.ingredientes}</td>
            <td class="border p-2 text-left whitespace-pre-wrap">${r.preparo}</td>
            <td class="border p-2">${new Date(r.data_criacao + "T00:00:00").toLocaleDateString("pt-BR")}</td>
            <td class="border p-2 flex space-x-2">

                <button class="bg-green-800 hover:bg-green-900 text-white px-2 py-1 flex-1 btnEditarReceita" data-id="${r.id}">
                    <span class="material-symbols-outlined mr-1">edit</span>Editar
                </button>
                
                <button class="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 flex-1 btnExcluirReceita" data-id="${r.id}">
                    <span class="material-symbols-outlined mr-1">delete_forever</span>Excluir
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Linha de total
    const trTotal = document.createElement("tr");
    trTotal.innerHTML = `
        <td colspan="5" class="text-right text-gray-700 p-4 border border-gray-400">Total de Receitas:</td>
        <td class="text-left text-gray-700 p-4 border border-gray-400">${dados.length}</td>
    `;
    tbody.appendChild(trTotal);

    // Eventos editar/excluir
    document.querySelectorAll(".btnEditarReceita").forEach(btn => {
        btn.addEventListener("click", e => {
            const id = e.target.closest("button").dataset.id;
            carregarReceitaNoFormulario(id);
        });
    });

    document.querySelectorAll(".btnExcluirReceita").forEach(btn => {
        btn.addEventListener("click", async e => {
            const id = e.target.closest("button").dataset.id;
            const result = await Swal.fire({
                title: "Confirma a exclusão?",
                text: "Isso irá excluir a receita e NÃO poderá ser desfeito!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sim, excluir!",
                cancelButtonText: "Cancelar"
            });

            if (result.isConfirmed) {
                await excluirReceita(id);
                carregarReceita();
            }
        });
    });
}

// =====================================================
// FORMULÁRIO DE RECEITA (ADICIONAR / EDITAR)
// =====================================================
document.getElementById("formReceita").addEventListener("submit", async e => {
    e.preventDefault();

    const form = e.target;
    const id = form.dataset.id;
    const categoria_id = document.getElementById("categoria_id").value;
    const titulo = document.getElementById("titulo").value;
    const ingredientes = document.getElementById("ingredientes").value;
    const preparo = document.getElementById("preparo").value;
    const data_criacao = document.getElementById("data_criacao").value;

    const receita = { categoria_id, titulo, ingredientes, preparo, data_criacao };

    try {
        if (id) {
            await editarReceita(id, receita);
            Swal.fire({
                icon: "success",
                title: "Sucesso!",
                text: "Receita editada com sucesso!",
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            await adicionarReceita(receita);
            Swal.fire({
                icon: "success",
                title: "Sucesso!",
                text: "Nova receita adicionada!",
                showConfirmButton: false,
                timer: 1500
            });
        }

        limparFormulario();
        carregarReceita();
    } catch (error) {
        console.error("Erro ao salvar receita:", error);
        Swal.fire({
            icon: "error",
            title: "Erro na Operação",
            text: `Houve um erro ao salvar a receita: ${error.message || "Erro desconhecido"}`,
        });
    }
});

// =====================================================
// CARREGAR DADOS DE UMA RECEITA NO FORMULÁRIO
// =====================================================
async function carregarReceitaNoFormulario(id) {
    const receita = await buscarReceitaPeloId(id);
    if (!receita) return;

    const form = document.getElementById("formReceita");
    form.dataset.id = receita.id;

    document.getElementById("categoria_id").value = receita.categoria_id;
    document.getElementById("titulo").value = receita.titulo;
    document.getElementById("ingredientes").value = receita.ingredientes;
    document.getElementById("preparo").value = receita.preparo;
    document.getElementById("data_criacao").value = receita.data_criacao;

    document.getElementById("titulo").focus();
}

// =====================================================
// LIMPAR FORMULÁRIO
// =====================================================
function limparFormulario() {
    const form = document.getElementById("formReceita");
    delete form.dataset.id;
    form.reset();
    datasReceitas();
}

// =====================================================
// DEFINIR DATAS AUTOMÁTICAS
// =====================================================
export function datasReceitas() {
    const hoje = new Date().toISOString().split("T")[0];
    const dataCriacao = document.getElementById("data_criacao");
    dataCriacao.value = hoje;
    dataCriacao.setAttribute("max", hoje);
}
