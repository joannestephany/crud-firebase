const button = document.querySelector('.button-add-task')
const input = document.querySelector('.input-task')
const listaCompleta = document.querySelector('.list-tasks')

let minhaListaDeItens = []
const baseUrl = 'https://us-central1-crud-firebase-4bea8.cloudfunctions.net/api'

async function adicionarNovaTarefa() {

    fetch("https://us-central1-crud-firebase-4bea8.cloudfunctions.net/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: input.value,
          done: false,
        }),
    })

    // minhaListaDeItens.push({
    //     tarefa: input.value,
    //     concluida: false,
    // });
    input.value = '';

    mostrarTarefas()
}

function mostrarTarefas() {
    let novaLi = ''
    // adiciona a tarefa na lista vindo do back

    fetch("https://us-central1-crud-firebase-4bea8.cloudfunctions.net/api/todos")
    .then((response) => response.json())
    .then((data) => {
        minhaListaDeItens = data
        console.log(data)
    }
    )

    minhaListaDeItens.forEach((item, posicao) => {
        

        let id = item.id
        
        novaLi =
            novaLi +
            `
        
        <li class="task">
            <img src="../public/checked.png" alt="check-na-tarefa" onclick="concluirTarefa(${posicao})">
            <p>${item.description}</p>
            <img src="../public/trash.png" alt="tarefa-para-o-lixo" onclick="deletarItem('${id}')">
        </li>
        
        `
        //console.log(item.id)
    })

    listaCompleta.innerHTML = novaLi

    localStorage.setItem('lista', JSON.stringify(minhaListaDeItens))
}

async function concluirTarefa(posicao) {
    //minhaListaDeItens[posicao].concluida = !minhaListaDeItens[posicao].concluida

    mostrarTarefas()
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

async function editarItem(posicao) {
    fetch("https://us-central1-crud-firebase-4bea8.cloudfunctions.net/api/todos/${id}", {
        method: "PUT",
        body: JSON.stringify({
            done: true,
          }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
    // const novoTexto = prompt('Digite o novo texto da tarefa')

    // minhaListaDeItens[posicao].tarefa = novoTexto

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