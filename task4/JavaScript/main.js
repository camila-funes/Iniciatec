// // document.getElementById("senate-data").innerHTML = JSON.stringify(data,null,2)

var key = 'q9Kgiv1nwlKrrbwApgeEGKIYUeWb9A9WCsSKEk4m'
var url_senate = "https://api.propublica.org/congress/v1/113/senate/members.json"
var url_house = "https://api.propublica.org/congress/v1/113/house/members.json"
var array_state = []
var array_API = []

var app = new Vue({  
    el: '#app',  
    data: {
        CongressData: []
    }
  }); 

async function traerMiembros() {

    if(document.title == "Senate Congress 113"){
        let resp = await fetch(url_senate, {
            method: "GET",
            headers: { 'X-API-KEY': key }
        })

        let data = await resp.json();

        return data;
    } else if(document.title == "House Congress 113"){
        let resp = await fetch(url_house, {
            method: "GET",
            headers: { 'X-API-KEY': key }
        })

        let data = await resp.json();

        return data;
    }

}

async function carga_api() {

    array_API = await traerMiembros();

    console.log(array_API)

    Republicanbox.addEventListener('click', checked) 
    Democratbox.addEventListener('click', checked) 
    IDbox.addEventListener('click', checked) 
    filterstate.addEventListener('change', checked)

    var members = array_API.results[0].members;

    app.CongressData = members

    members.forEach(member => {    
        array_state.push(member.state)
        })

    var stateArr= new Set(array_state);

    array_state = [...stateArr];

    filtro_estados() 
}

 carga_api()

function checked(){
    var R = document.getElementById("Republicanbox").checked;
    var D = document.getElementById("Democratbox").checked;
    var ID = document.getElementById("IDbox").checked;
    var STATE = document.getElementById("filterstate2")

    var members = array_API.results[0].members;
    var filtro=[];

    members.forEach(member => {
        if (R==true && member.party=="R"){
            filtro.push(member)
        }

        if (D==true && member.party == "D"){
            filtro.push(member) 
        }

        if (ID==true && member.party=="ID"){
            filtro.push(member)
        }
    })

    if (filtro.length == 0){ 
        filtro=0
    }

    if(STATE.value != "ALL"){ 
        app.CongressData = filtro.filter(members => members.state == STATE.value)

    } else {
        app.CongressData = filtro
    }
}

function filtro_estados (){ 
    
    array_state.forEach(state => {
        var option = document.createElement('option')
        option.innerText= state;
        option.value = state;
            
        document.getElementById("filterstate2").appendChild(option);
        
    })
}

function prueba(){
    if (document.getElementById("boton").innerHTML == "Read less"){
        document.getElementById("boton").innerHTML = "Read more";
    } else {
        document.getElementById("boton").innerHTML = "Read less";
    }
}