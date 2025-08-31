function salvarTarefa(){
    abrirModalCarregar();

    var id_tarefa = document.getElementById("id_tarefa").value;

    var titulo_tarefa = document.getElementById("titulo_tarefa").value;
    var descricao_tarefa = document.getElementById("descricao_tarefa").value;
    var data_tarefa = document.getElementById("data_tarefa").valueAsDate;

    var novaTarefa = {
        titulo: titulo_tarefa, 
        data: data_tarefa, 
        descricao: descricao_tarefa, 
        isFinalizado: false,
    };

    var metodoRequisicao;
    var url;

    if(id_tarefa == null || id_tarefa == ""){
        metodoRequisicao = "POST";
        url = "https://68855333f52d34140f699e91.mockapi.io/todos";
    }else{
        metodoRequisicao = "PUT";
        url = "https://68855333f52d34140f699e91.mockapi.io/todos/"+id_tarefa;
    }

    $.ajax({   
        method: metodoRequisicao,
        url: url,
        headers: {'content-type':'application/json'},
        data: JSON.stringify(novaTarefa),
        success: function(result){
            fecharModalCarregar();
            window.location.reload();
        },
        error: function(error){
            fecharModalCarregar();
            limpaFormulario();
            alert("Erro ao salver tarefa"); 
        }
    });
}

function abrirModalCarregar(){
    $('#model_carregando').modal('show',{
        focus: false
    });
}

function fecharModalCarregar(){
    $('#model_carregando').modal('hide',{
        focus: false
    });
}

function fecharFormModel(){
    $('#modal_adicionar_tarefa').modal('hide',{
        focus: false
    });
}

function abrirFormModel(){
    $('#modal_adicionar_tarefa').modal('show',{
        focus: false
    });
}

function pegarTarefas(){
    abrirModalCarregar();

    $.ajax({   
        method: "GET",
        url: "https://68855333f52d34140f699e91.mockapi.io/todos",
        success: function(result){
            result.sort(function(a,b) {
                return a.data < b.data ? -1 : a.data > b.data ? 1 : 0;
            });

            var tarefasAgrupadasPorData = groupBy(result, 'data');

            const arrayDeDatas = Object.keys(tarefasAgrupadasPorData);

            for (const data of arrayDeDatas) {  
                const listaDeTarefas = tarefasAgrupadasPorData[data];
                var cartoesTarefa = montaCartoesDeTarefas(listaDeTarefas);
                adicionarCartaoDeGrupoDeTarefas(data, cartoesTarefa);
            }
            setTimeout(function(){
                fecharModalCarregar();
            }, 500);
        },
        error: function(error){
                fecharModalCarregar();
            alert("Erro ao carregar tarefas");
        }
    });
}

function groupBy(array, key) {
	return array.reduce((acc, item) => {
    	if (!acc[item[key]]) acc[item[key]] = []
        acc[item[key]].push(item)
        return acc
    }, {})
}

function adicionarCartaoDeGrupoDeTarefas(titulo, cartoesTarefa){
    var dataArray = titulo.split('-');
    var data = dataArray[2].split("T")[0] + "/" + dataArray[1] + "/" + dataArray[0];
    
    var cartaoGrupoTarefas = '<div class="card m-1" style="width: 18rem; max-height: 65vh;">' +
                    '<div class="card-header">' +
                       data + 
                    '</div>' +
                    '<div class="card-body p-1" style="overflow-y: auto;"> '+
                        cartoesTarefa.join("") +
                    '</div>' +
                '</div>';
    $("main").append(cartaoGrupoTarefas);
}

function editarTarefa(id){
    limpaFormulario();

    abrirModalCarregar();

    setTimeout(
        function(){
            var data = null;

            $.ajax({   
                method: "GET",
                url: "https://68855333f52d34140f699e91.mockapi.io/todos/"+id,
                headers: {'content-type':'application/json'},
                success: function(result){    
                    fecharModalCarregar();
                    
                    setTimeout(function(){
                        data = result;

                        var id_tarefa = document.getElementById("id_tarefa");
                        var titulo_tarefa_campo = document.getElementById("titulo_tarefa");
                        var descricao_tarefa_campo = document.getElementById("descricao_tarefa");
                        var data_tarefa_campo = document.getElementById("data_tarefa");

                        id_tarefa.value = data.id;
                        titulo_tarefa_campo.value = data.titulo;
                        descricao_tarefa_campo.value = data.descricao;
                        data_tarefa_campo.valueAsDate = new Date(data.data);

                        abrirFormModel();
                    }, 200);
                },
                error: function(error){
                    fecharModalCarregar();
                    alert("Erro ao salvar tarefa"); 
                }
            });

        }, 500
    );}

function limpaFormulario(){
    var id_tarefa = document.getElementById("id_tarefa");
    var titulo_tarefa_campo = document.getElementById("titulo_tarefa");
    var descricao_tarefa_campo = document.getElementById("descricao_tarefa");
    var data_tarefa_campo = document.getElementById("data_tarefa");

    id_tarefa.value = "";
    titulo_tarefa_campo.value = "";
    descricao_tarefa_campo.value = "";
    data_tarefa_campo.value = "";
}

function montaCartoesDeTarefas(listaDeTarefas){
    var listaDeItems = [];

    for(var i = 0; i < listaDeTarefas.length; i++){
        var item =  '<div class="card item m-1">'+
                        '<div class="card-body">'+
                            '<h5 class="card-title">'+
                                '<div class="d-flex justify-content-between">'+
                                    '<span><i class="bi bi-check-circle-fill"></i>&nbsp;'+ listaDeTarefas[i].titulo+'</span>'+
                                    '<i class="bi bi-pencil-square botao-edicao" onclick="editarTarefa('+listaDeTarefas[i].id+')"></i>'+
                                '</div>' +
                            '</h5>'+
                        '</div>'+
                    '</div>';
        listaDeItems.push(item);
    }
    return listaDeItems;
}

function deletarTarefa(){
    var desejaDeletar = window.confirm("Deseja deletar a tarefa?");

    if(desejaDeletar){
        var id_tarefa = document.getElementById("id_tarefa").value;

        abrirModalCarregar();

        setTimeout(function(){
            $.ajax({   
                method: "DELETE",
                url: "https://68855333f52d34140f699e91.mockapi.io/todos/"+id_tarefa,
                headers: {'content-type':'application/json'},
                success: function(result){
                    fecharModalCarregar();
                    window.location.reload();
                },
                error: function(error){
                    fecharModalCarregar();
                    alert("Erro ao deletar tarefa"); 
                }
            });
        }, 600);
    }
}

window.onload = function(){
    pegarTarefas();
}