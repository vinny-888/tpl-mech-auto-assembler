const templateDeals = document.querySelector("#template-deals");
const dealsContainer = document.querySelector("#deals");

const templateOffers = document.querySelector("#template-offers");
const offersContainer = document.querySelector("#offers");

const templateUser = document.querySelector("#template-deals");
const userContainer = document.querySelector("#users");
const BASE_URL = 'https://cb-tpl.glitch.me/';

let selectedDealId = 1;

function init() {
    createMetadataLookup();
    displayTables();
    update();
    onModelChange();
}

function update(){
    getDeals().then((deals)=>{
        console.log('Deals:', deals);
        buildDealsTable(deals);
        selectDeal(selectedDealId);
    })
}

function selectDeal(dealId){
    selectedDealId = dealId;
    Array.from(document.getElementById('deals').children).forEach((row)=>{
        row.classList.remove("selected");
    })
    document.getElementById('deal_'+dealId).classList.add("selected");

    getOffersForDeal(dealId).then((offers)=>{
        console.log('Offers:', offers);
        buildOffersTable(offers);
    });
}

function submitOffer(){
    let model = document.getElementById('modelSelect').value;
    let style = document.getElementById('styleSelect').value;
    let part = document.getElementById('partSelect').value;
    addOffer(selectedDealId, model, style, part);
}

function showOfferModal(){
    document.getElementById('addOffer').style.display = 'block';
}

function hideOfferModal(){
    document.getElementById('addOffer').style.display = 'none';
}

function addOffer(dealId, model, style, part){
    addOfferForDeal(dealId, {
        type: 'offer',
        from_discord_id: 'user_4',
        from_wallet: '0xe4089f48091E2102b2F0678d03dA24d78174989C', 
        deal_id: parseInt(dealId),
        model: model,
        style: style,
        part: part
    }).then((data)=>{
        console.log('addOfferForDeal Post:', data);
        update();
        hideOfferModal();
    })
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

function addOfferForDeal(dealId, offer){
    return post(BASE_URL+'offers/'+dealId, offer);
}

function get(url){
   return fetch(url)
    .then((response) => response.json())
}

function post(url, body){
    return fetch(url,
        {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
     .then((response) => response.json())
 }
  
window.addEventListener('load', async () => {
    init();
});

function buildDealsTable(deals){
    dealsContainer.innerHTML = '';
    deals.forEach((deal)=>{
        const clone = templateDeals.content.cloneNode(true);
        let tr = clone.children[0];
        tr.id = 'deal_'+deal.id;
        tr.onclick = ()=>{selectDeal(deal.id)};

        clone.querySelector(".user").innerHTML = '@'+deal.from_discord_id;
        clone.querySelector(".text").innerHTML = 'Has:<br><br>Wants:';
        clone.querySelector(".image").innerHTML = partsRevealedImage(deal.has.part, deal.has.model, deal.has.style);
        clone.querySelector(".model").innerHTML = deal.has.model + '<br><br>' + deal.wants.model;
        clone.querySelector(".part").innerHTML = deal.has.part + '<br><br>' + deal.wants.part;
        clone.querySelector(".style").innerHTML = deal.has.style + '<br><br>' + deal.wants.style;

        let allowedOffer = '';

        clone.querySelector(".offer").innerHTML = `<div style="text-align: center;">
            <button class="btn btn-assemble${allowedOffer}"" id="btn-query" onclick="showOfferModal()" ${allowedOffer}>+</button>
        </div>`;
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

        let allowedRemove = '';

        clone.querySelector(".remove").innerHTML = `<div style="text-align: center;">
            <button class="btn btn-dismantle${allowedRemove}" id="btn-query" onclick="removeOffer('${offer.id}')" ${allowedRemove}>-</button>
        </div>`;
        // clone.querySelector(".count").textContent = deal.has.count;
        offersContainer.appendChild(clone);
    })
    document.getElementById('offer_count').innerHTML = offers.length;
}

function onModelChange(){
    var e = document.getElementById("modelSelect");
    var model = e.value;
    console.log('onModelChange', model);

    var stylesSelect = document.getElementById("styleSelect");

    let html = ''
    STYLE_ORDER[model].forEach((style)=>{
        html += '<option value="'+style+'">'+style+'</option>';
    });
    stylesSelect.innerHTML = html;

    updateSelects();
}

function updateSelects(){
    var x, i, j, l, ll, selElmnt, a, b, c;
    /*look for any elements with the class "custom-select":*/
    x = document.getElementsByClassName("custom-select");
    l = x.length;
    for (i = 0; i < l; i++) {
      selElmnt = x[i].getElementsByTagName("select")[0];
      ll = selElmnt.length;
      /*for each element, create a new DIV that will act as the selected item:*/
      a = document.createElement("DIV");
      a.setAttribute("class", "select-selected");
      a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
      x[i].appendChild(a);
      /*for each element, create a new DIV that will contain the option list:*/
      b = document.createElement("DIV");
      b.setAttribute("class", "select-items select-hide");
      for (j = 1; j < ll; j++) {
        /*for each option in the original select element,
        create a new DIV that will act as an option item:*/
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function(e) {
            /*when an item is clicked, update the original select box,
            and the selected item:*/
            var y, i, k, s, h, sl, yl;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            sl = s.length;
            h = this.parentNode.previousSibling;
            for (i = 0; i < sl; i++) {
              if (s.options[i].innerHTML == this.innerHTML) {
                s.selectedIndex = i;
                h.innerHTML = this.innerHTML;
                y = this.parentNode.getElementsByClassName("same-as-selected");
                yl = y.length;
                for (k = 0; k < yl; k++) {
                  y[k].removeAttribute("class");
                }
                this.setAttribute("class", "same-as-selected");
                break;
              }
            }
            h.click();
        });
        b.appendChild(c);
      }
      x[i].appendChild(b);
      a.addEventListener("click", function(e) {
          /*when the select box is clicked, close any other select boxes,
          and open/close the current select box:*/
          e.stopPropagation();
          closeAllSelect(this);
          this.nextSibling.classList.toggle("select-hide");
          this.classList.toggle("select-arrow-active");
        });
    }
    function closeAllSelect(elmnt) {
      /*a function that will close all select boxes in the document,
      except the current select box:*/
      var x, y, i, xl, yl, arrNo = [];
      x = document.getElementsByClassName("select-items");
      y = document.getElementsByClassName("select-selected");
      xl = x.length;
      yl = y.length;
      for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
          arrNo.push(i)
        } else {
          y[i].classList.remove("select-arrow-active");
        }
      }
      for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
          x[i].classList.add("select-hide");
        }
      }
    }
    /*if the user clicks anywhere outside the select box,
    then close all select boxes:*/
    document.addEventListener("click", closeAllSelect);
  }