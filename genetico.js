var cromosoma1 = []//[0,1,1,0,1];
var cromosoma2 = []//[1,1,0,0,0];
var cromosoma3 = []//[1,1,0,1,1];
var cromosoma4 = []//[0,0,1,0,1];
var cromosoma5 = []//[1,0,0,0,1];
var poblacion = []//[cromosoma1,cromosoma2,cromosoma3,cromosoma4,cromosoma5];
var fitness = [0,0,0,0,0];
var sumaFitness = 0;
var modelo = [1,1,1,1,1];
var puntoCruce = 3;
var generacion = 1;

//Funciones para el calculo
function registrar(){
    var cromosoma = [];
    for(var r=1;r<=5;r++){
        for(var c=1;c<=5;c++){
            var element = document.getElementById("a"+r+c);
            cromosoma[c-1]=element.value;
            element.disabled = true;
        }
        console.log("Cromosoma a registrar: "+cromosoma);
        poblacion.push(cromosoma.slice());
        cromosoma = [];
    }
    evaluarPoblacion();
    for(var i=0;i<fitness.length;i++){
        var element = document.getElementById("f"+(i+1));
        element.value = fitness[i];
    }
    document.getElementById("sf").value=sumaFitness;
    document.getElementById("btnCalcular").disabled=false;
    document.getElementById("btnRegistrar").disabled=true;
}


function calcularFitness(cromosoma){
    var sum=0;
    for(var i=0;i<cromosoma.length;i++){
        if(cromosoma[i]==modelo[i]){
            sum=sum+1;
        }
    }
    return sum;
}

function evaluarPoblacion(){
    fitness[0]=calcularFitness(poblacion[0]);
    fitness[1]=calcularFitness(poblacion[1]);
    fitness[2]=calcularFitness(poblacion[2]);
    fitness[3]=calcularFitness(poblacion[3]);
    fitness[4]=calcularFitness(poblacion[4]);
    sumaFitness=evaluarGeneracion();
}

function procesar(){

    var noMejora=0;
    while(noMejora<5 && generacion!=5){

        console.log(poblacion);
        fitness[0]=calcularFitness(poblacion[0]);
        fitness[1]=calcularFitness(poblacion[1]);
        fitness[2]=calcularFitness(poblacion[2]);
        fitness[3]=calcularFitness(poblacion[3]);
        fitness[4]=calcularFitness(poblacion[4]);
        sumaFitness=evaluarGeneracion();

        console.log(fitness);
        var auxFitness = fitness.slice();
        auxFitness.sort(function(a, b){return b-a});
        console.log(auxFitness);
        var aux = seleccionar(auxFitness[0]);
        var aux2 = seleccionar(auxFitness[1]);
        console.log(aux);
        console.log(aux2);
        var nuevoCromosoma=cruzar(aux,aux2);
        var nuevoCromosoma2 = cruzar(aux2,aux);
        var vaMutar= Math.floor((Math.random() * 3) + 1);
        switch(vaMutar){
            case 1:
                mutar(nuevoCromosoma);
                console.log(nuevoCromosoma);
            break;
            case 2:
                mutar(nuevoCromosoma2);
                console.log(nuevoCromosoma2);
            break;
            default:
                //no va a mutar
        }
        reemplazarCromosoma(nuevoCromosoma);
        reemplazarCromosoma(nuevoCromosoma2);
        console.log(poblacion);
        fitness[0]=calcularFitness(poblacion[0]);
        fitness[1]=calcularFitness(poblacion[1]);
        fitness[2]=calcularFitness(poblacion[2]);
        fitness[3]=calcularFitness(poblacion[3]);
        fitness[4]=calcularFitness(poblacion[4]);
        console.log(fitness);
        var auxSuma=evaluarGeneracion();
        console.log("sumaFitness: "+sumaFitness+" nuevaSumaFitness: "+auxSuma);
        generacion++;
        if(sumaFitness<auxSuma){
            //continua
            sumaFitness = auxSuma;
        }
        else{
            //no continua
            noMejora++;
        }
        imprimirPoblacion();
    }
}

function seleccionar(valFitness){
    for(var i=0;i<fitness.length;i++){
        if(fitness[i]==valFitness){
            return poblacion[i];
        }
    }
}

function cruzar(crm1,crm2){
    var padre1 = crm1.slice(0,puntoCruce);
    var padre2 = crm2.slice(puntoCruce,crm2.length);
    var hijo = padre1.concat(padre2);
    console.log(hijo);
    return hijo;
}

function mutar(cromosoma){
    var indice=Math.floor((Math.random() * 4));
    if(cromosoma[indice]===0){
        cromosoma[indice]=1;
    }
    else{
        cromosoma[indice]=0;
    }
}

function reemplazarCromosoma(cromosoma){
    var menor = fitness[0];
    var indice = 0;
    for(var i=1;i<fitness.length;i++){
        if(fitness[i]!=-1 && menor>fitness[i]){
            menor=fitness[i];
            indice=i;
        }
    }
    poblacion[indice]=cromosoma;
    fitness[indice]=-1;
}

function evaluarGeneracion(){
    var suma=0;
    for(var i=0;i<fitness.length;i++){
        suma=suma+fitness[i];
    }
    return suma;
}

///Funciones para el DOM

function imprimirPoblacion(){
    var container = document.getElementById("container");

    var etiqueta = document.createElement("label");
    etiqueta.appendChild(document.createTextNode("Generacion "+generacion));
    container.appendChild(etiqueta);
    container.appendChild(document.createElement("br"));

    var tabla = document.createElement("table");
    tabla.className = "tabla";
    for(var i=0;i<poblacion.length;i++){
        var tr = document.createElement("tr");
        var et = document.createElement("td");
        et.className="colInfo";
        var texto = document.createTextNode("A"+(i+1)+":");
        et.appendChild(texto);
        tr.appendChild(et);
        for(var cont=0;cont<poblacion[i].length;cont++){
            var td = document.createElement("td");
            td.className = "col";
            var nodo = document.createTextNode(poblacion[i][cont]);
            td.appendChild(nodo);
            tr.appendChild(td);
        }
        tabla.appendChild(tr);
    }
    tabla.appendChild(imprimirFitness());
    tabla.appendChild(imprimirSumaFitness());
    container.appendChild(tabla);
    container.appendChild(document.createElement("br"))
}

function imprimirFitness(){

     var tr = document.createElement("tr");
     var et = document.createElement("td");
     var texto = document.createTextNode("Fitness:");
     et.appendChild(texto);
     tr.appendChild(et);

    for(var i=0;i<fitness.length;i++){
        var td = document.createElement("td");
        td.className = "col";
        var nodo = document.createTextNode(fitness[i]);
        td.appendChild(nodo);
        tr.appendChild(td);
    }
    return tr;
}

function imprimirSumaFitness(){
    var tr = document.createElement("tr");
    var et = document.createElement("td");
    var texto = document.createTextNode("Suma:");
    et.appendChild(texto);
    tr.appendChild(et);
    var td = document.createElement("td");
    td.className = "col";
    var nodo = document.createTextNode(sumaFitness);
    td.appendChild(nodo);
    tr.appendChild(td);
    return tr;
}

function limpiar(){
    var element=document.getElementById("container");
    while(element.hasChildNodes()){
        element.removeChild(element.firstChild);
    }
    document.getElementById("btnCalcular").disabled=true;
    document.getElementById("btnRegistrar").disabled=false;
}