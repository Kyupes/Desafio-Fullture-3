let arrayTarefas = [];
// let user = sessionStorage.getItem("user");
function removeOneTask(evento) {
  const id = evento.target.id;
  arrayTarefas = arrayTarefas.filter(function filtrar(item) {
    return item.id !== id.split("-")[1];
  });
  atualizarDom(arrayTarefas);
  const divTarefa = document.getElementById(id.split("-")[1]);
  if (divTarefa) {
    divTarefa.classList.add("removed");
  }
  localStorage.setItem(
    "hmassareli",
    JSON.stringify({ info: { senha: "123" }, tarefas: arrayTarefas })
  );
}

function registrar() {
  const user = document.getElementById("user").value;
  const senha = document.getElementById("senha").value;
  const usuarioNoLocalStorage = localStorage.getItem(user);
  if (usuarioNoLocalStorage !== null){
    alert ("usário ja existe");
  } else {
    const infoUsuario = { senha: senha };
    localStorage.setItem(user, JSON.stringify({ info: infoUsuario, tarefas: [] }));
    alert("cadastro efetuado com sucesso");
  }
  }

function finalizarTarefa(evento) {
  const id = evento.target.id;
  const posicaoDaTarefaNoArray = arrayTarefas.findIndex(function encontrar(
    item
  ) {
    return item.id === id.split("-")[1];
  });
  arrayTarefas[posicaoDaTarefaNoArray].status = "completed";
  atualizarDom(arrayTarefas);
  const divTarefa = document.getElementById(id.split("-")[1]);
  divTarefa.classList.add("completed");
  divTarefa.classList.remove("uncompleted");
  localStorage.setItem(
    "hmassareli",
    JSON.stringify({ info: { senha: "123" }, tarefas: arrayTarefas })
  );
}
function adicionar() {
  console.log("Função adicionar chamada.");
  // puxar valor do input
  const input = document.getElementById("texto-tarefa");

  //pega o value do input
  const texto = input.value;

  if (!texto) {
    return;
  }

  const objTarefa = {
    id: Date.now().toString(), // cria um id para cada tarefa
    name: texto, // pode repetir
    status: "uncompleted", //(tarefa pendente)
  };

  arrayTarefas.push(objTarefa);
  localStorage.setItem(
    "hmassareli",
    JSON.stringify({ info: { senha: "123" }, tarefas: arrayTarefas })
  );

  // Criação dos elementos HTML
  const li = document.createElement("li");
  li.className = "todo-item uncompleted";
  li.appendChild(document.createTextNode(objTarefa.name));
  console.log(li);

  const checkBtn = document.createElement("button");
  checkBtn.className = "check-btn";
  const checkIcon = document.createElement("i");
  checkIcon.className = "fas fa-check";
  checkBtn.appendChild(checkIcon);
  console.log(checkBtn);

  const trashBtn = document.createElement("button");
  trashBtn.className = "trash-btn";
  const trashIcon = document.createElement("i");
  trashIcon.className = "fas fa-trash";
  trashBtn.appendChild(trashIcon);
  console.log(trashBtn);

  // Adiciona os elementos HTML ao li
  li.appendChild(checkBtn);
  li.appendChild(trashBtn);

  // Adiciona o li à lista de tarefas no DOM
  const divTarefas = document.getElementById("tarefas");
  divTarefas.appendChild(li);

  console.log(arrayTarefas);
  atualizarDom(arrayTarefas);
}

function handleClick(evento) {
  if (evento.target.nodeName === "BUTTON") {
    //verificar quem foi clicado, pra ver se chama a função de remover ou de finalizar
    if (evento.target.classList.contains("trash-btn")) {
      removeOneTask(evento);
    } else if (evento.target.classList.contains("check-btn")) {
      finalizarTarefa(evento);
    }
  }
}

// executa o código de dentro somente quando a página estiver carregada (DOM na tela)
window.addEventListener("load", function () {
  //pegando informações do localStorage
  let armazenamento = localStorage.getItem("hmassareli");
  if (armazenamento) {
    // se tiver tarefas no localStorage, transforma em objeto de verdade
    armazenamento = JSON.parse(armazenamento);

    // coloca as tarefas no arrayTarefas e logo atualiza o DOM
    arrayTarefas = armazenamento.tarefas;
    atualizarDom(arrayTarefas);
  }
  // pega a div que contém as tarefas
  const divTarefas = document.getElementById("tarefas");

  // pega o select de filtro
  const select = document.getElementById("select-filtro");

  //chama a função atualizar DOM sempre que o select for "mudado"
  select.addEventListener("change", function atualizar() {
    atualizarDom(arrayTarefas);
  });

  // chama a função de lidar com cliques sempre que alguém clicar na divTarefas
  divTarefas.addEventListener("click", handleClick);
});

function atualizarDom(arrayTarefas) {
  const selectFiltro = document.getElementById("select-filtro");
  let opcaoSelecionada = selectFiltro.value;
  let arrayFiltrado = [];

  if (opcaoSelecionada === "all") {
    arrayFiltrado = arrayTarefas;
  } else {
    arrayFiltrado = arrayTarefas.filter(function filtrar(item) {
      return item.status === opcaoSelecionada;
    });
  }
  // pega a div onde ficarão as tarefas
  const divTarefas = document.getElementById("tarefas");

  // esvazia a div, para que tenha só tarefas atualidas
  divTarefas.innerHTML = "";

  // percorre o array de tarefas filtradas
  for (let i = 0; i < arrayFiltrado.length; i++) {
    console.log(i);

    let divTarefa = document.createElement("div");
    divTarefa.className = "todo";
    divTarefa.setAttribute("id", arrayFiltrado[i].id);

    // coloca os botões e paragrafo dentro da divTarefa com seus respectivos ids e classes
    divTarefa.innerHTML = `<p class="todo-item">${arrayFiltrado[i].name}</p><div class="buttons"><button class="check-btn" id="finalizar-${arrayFiltrado[i].id}"> </button> <button class="trash-btn" id="remover-${arrayFiltrado[i].id}"></button></div>`;

    divTarefas.appendChild(divTarefa);
    const id = `finalizar-${arrayFiltrado[i].id}`;
    const botao = document.getElementById(id);
    botao.innerHTML = '<i class="fas fa-check"></i>';
    const id2 = `remover-${arrayFiltrado[i].id}`;
    const botao2 = document.getElementById(id2);
    botao2.innerHTML = '<i class="fas fa-trash"></i>';
  }
}