var key = 'q9Kgiv1nwlKrrbwApgeEGKIYUeWb9A9WCsSKEk4m'
var url_senate = "https://api.propublica.org/congress/v1/113/senate/members.json"
var url_house = "https://api.propublica.org/congress/v1/113/house/members.json"

var app = new Vue({  
    el: '#app',  
    data: {    
      partyInfo: [],
      partyInfo2: [],
      partyInfo3: [],
      partyInfo4: [],
      statistics: {}
    }
})

var statistics = {
    Democrats: 0,
    Republicans: 0,
    Independents: 0,
    prom_democrats: 0,
    prom_republic: 0,
    prom_indep: 0,
    missed_democrats: 0,
    missed_republicans: 0,
    missed_indep: 0
}
var bottom_votes = []
var bottom_missed_votes = []
var top_votes = []
var top_missed_votes = []

async function traerMiembros() {

    if(document.title == "Senate attendance" || document.title == "Senate loyalty"){
        let resp = await fetch(url_senate, {
            method: "GET",
            headers: { 'X-API-KEY': key }
        })

        let data = await resp.json();

        return data;
    } else if(document.title == "House attendance" || document.title == "House loyalty"){
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

    var members = array_API.results[0].members;

    console.log(members)

    quantity_members()

    loyalty()

    attendance()

    app.partyInfo = bottom_missed_votes
    
    app.partyInfo2 = top_missed_votes

    app.statistics = statistics

    app.partyInfo3 = bottom_votes

    app.partyInfo4 = top_votes
}

carga_api()

function quantity_members (){
    let members = array_API.results[0].members;
    let suma_democrats = 0
    let suma_indep = 0
    let suma_republic = 0
    let republic = []
    let democrat = []
    let indep = []

    members.forEach(member => {
        if (member.party=="R"){
            republic.push(member)
            suma_republic = suma_republic + member.votes_with_party_pct
        }
        if (member.party == "D"){
            democrat.push(member)
            suma_democrats = suma_democrats + member.votes_with_party_pct
        }
        if (member.party=="ID"){
            indep.push(member)
            suma_indep = suma_indep + member.votes_with_party_pct
        }
    })
    
    statistics.Republicans = republic.length
    statistics.Democrats = democrat.length
    statistics.Independents = indep.length
    statistics.prom_democrats = parseFloat((suma_democrats/democrat.length).toFixed(2))
    statistics.prom_republic = parseFloat ((suma_republic/republic.length).toFixed(2))
    if (indep == 0){
        statistics.prom_indep = 0
    }else{
        statistics.prom_indep = parseFloat ((suma_indep/indep.length).toFixed(2))
    }
}

function loyalty (){
    let members = array_API.results[0].members;
    let order_members = [] 
    let bottom_members = []
    let top_members = []
    members.forEach(member => {
        order_members.push(member) 
    });
    top_members = order_members.sort((a,b) => {return b.votes_with_party_pct - a.votes_with_party_pct;});
    top_members = top_members.filter(member => member.total_votes > 0)
    for (let i = 0; i < Math.round(top_members.length*0.1); i++) {
        top_votes.push(top_members[i])
    }
    bottom_members = top_members.reverse()
    for (let i = 0; i < Math.round(bottom_members.length*0.1); i++) {
        bottom_votes.push(bottom_members[i])
    }
}

function attendance (){
    let members = array_API.results[0].members; 
    let order_members = [] 
    let bottom_members = []
    let top_members = []
    members.forEach(member => {
        order_members.push(member)
    });
    bottom_members = order_members.sort((a,b) => {return b.missed_votes_pct - a.missed_votes_pct;});
    bottom_members = bottom_members.filter(member => member.total_votes > 0)
    for (let i = 0; i < Math.round(bottom_members.length*0.1); i++) {
        bottom_missed_votes.push(bottom_members[i])
    }
    top_members = bottom_members.reverse()
    for (let i = 0; i < Math.round(top_members.length*0.1); i++) {
        top_missed_votes.push(top_members[i])
    }
}







