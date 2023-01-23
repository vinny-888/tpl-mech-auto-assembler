const templateDeals = document.querySelector("#template-deals");
const dealsContainer = document.querySelector("#deals");

const templateOffers = document.querySelector("#template-offers");
const offersContainer = document.querySelector("#offers");

const templateUser = document.querySelector("#template-deals");
const userContainer = document.querySelector("#users");
const BASE_URL = 'https://cb-tpl.glitch.me/';
function init() {
    createMetadataLookup();
    getDeals().then((deals)=>{
        console.log('Deals:', deals);
        buildDealsTable(deals);
        displayTables();
        selectDeal(1);
    })
}

function selectDeal(dealId){
    Array.from(document.getElementById('deals').children).forEach((row)=>{
        row.classList.remove("selected");
    })
    document.getElementById('deal_'+dealId).classList.add("selected");

    getOffersForDeal(dealId).then((offers)=>{
        console.log('Offers:', offers);
        buildOffersTable(offers);
    });
}

function displayTables(){
    document.querySelector("#connected").style.display = "block";
}

// Users
function getUsers(){
    return get(BASE_URL+'users');
}

function getUser(wallet){
    return get(BASE_URL+'user/'+wallet);
}

// Deals
function getDeal(dealId){
    return get(BASE_URL+'deal/'+dealId);
}

function getDeals(){
    return get(BASE_URL+'deals');
}

function getWalletDeals(wallet){
    return get(BASE_URL+'deals/'+wallet);
}

// Offers
function getOffers(){
    return get(BASE_URL+'offers');
}

function getOffersForDeal(dealId){
    return get(BASE_URL+'offers/'+dealId);
}

function get(url){
   return fetch(url)
    .then((response) => response.json())
}
  
window.addEventListener('load', async () => {
    init();
});

function buildDealsTable(deals){
    offersContainer.innerHTML = '';
    deals.forEach((deal)=>{
        const clone = templateDeals.content.cloneNode(true);
        let tr = clone.children[0];
        tr.id = 'deal_'+deal.id;
        tr.onclick = ()=>{selectDeal(deal.id)};

        clone.querySelector(".user").textContent = '@'+deal.from_discord_id;
        clone.querySelector(".image").innerHTML = partsRevealedImage(deal.has.part, deal.has.model, deal.has.style);
        clone.querySelector(".model").textContent = deal.has.model;
        clone.querySelector(".part").textContent = deal.has.part;
        clone.querySelector(".style").textContent = deal.has.style;
        // clone.querySelector(".count").textContent = deal.has.count;
        dealsContainer.appendChild(clone);
    })
    document.getElementById('deal_count').innerHTML = deals.length;
}

function buildOffersTable(offers){
    offersContainer.innerHTML = '';
    offers.forEach((offer)=>{
        const clone = templateOffers.content.cloneNode(true);
        clone.querySelector(".user").textContent = '@'+offer.from_discord_id;
        clone.querySelector(".image").innerHTML = partsRevealedImage(offer.part, offer.model, offer.style);
        clone.querySelector(".model").textContent = offer.model;
        clone.querySelector(".part").textContent = offer.part;
        clone.querySelector(".style").textContent = offer.style;
        // clone.querySelector(".count").textContent = deal.has.count;
        offersContainer.appendChild(clone);
    })
    document.getElementById('offer_count').innerHTML = offers.length;
}