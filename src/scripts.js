const button = document.querySelector('.button-add-task')
const input = document.querySelector('.input-task')
const listaCompleta = document.querySelector('.list-tasks')

let minhaListaDeItens = []
const baseUrl = 'https://us-central1-crud-firebase-4bea8.cloudfunctions.net/api'

async function adicionarNovaTarefa() {

    await fetch("https://us-central1-crud-firebase-4bea8.cloudfunctions.net/api/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            description: input.value,
            done: false,
        }),
    })

    input.value = '';

    mostrarTarefas()
}


async function mostrarTarefas() {
    let novaLi = ''

    await fetch("https://us-central1-crud-firebase-4bea8.cloudfunctions.net/api/todos")
        .then((response) => response.json())
        .then((data) => {
            minhaListaDeItens = data
            console.log(data)
        }
        )

    minhaListaDeItens.forEach((item, posicao) => {
        let id = item.id
        novaLi = novaLi +
            `<li class="task">
                <img src="img/checked.png" alt="check-na-tarefa" onclick="editarItem('${item.id}', ${item.done})">
                ${item.done ? `<s>${item.description}</s>` : `<p>${item.description}</p>`}
                <img src="img/trash.png" alt="tarefa-para-o-lixo" onclick="deletarItem('${id}')">
            </li>`
    })

    listaCompleta.innerHTML = novaLi

    localStorage.setItem('lista', JSON.stringify(minhaListaDeItens))
}

async function deletarItem(id) {
    try {
        const response = await fetch(`https://us-central1-crud-firebase-4bea8.cloudfunctions.net/api/todos/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar o item');
        }

        mostrarTarefas();
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function editarItem(id, currentDone) {
    try {
        await fetch(`https://us-central1-crud-firebase-4bea8.cloudfunctions.net/api/todos/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                done: !currentDone,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
    } catch (error) {
        console.error('Erro:', error);
    }
    
    mostrarTarefas()
}

async function recarregarTarefas() {
    const tarefasDoLocalStorage = localStorage.getItem('lista')

    if (tarefasDoLocalStorage) {
        minhaListaDeItens = JSON.parse(tarefasDoLocalStorage)
    }

    mostrarTarefas()
}

recarregarTarefas()

button.addEventListener('click', adicionarNovaTarefa)