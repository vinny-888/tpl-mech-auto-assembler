const templateDeals = document.querySelector("#template-deals");
const dealsContainer = document.querySelector("#deals");

const templateOffers = document.querySelector("#template-offers");
const offersContainer = document.querySelector("#offers");

const templateUser = document.querySelector("#template-deals");
const userContainer = document.querySelector("#users");
const BASE_URL = 'https://cb-tpl.glitch.me/';

let selectedDealId = 0;
let user = {};
function init() {
    createMetadataLookup();
    displayTables();
    update();
    if(window.localStorage.getItem('cb-tpl-user') == null){
        document.getElementById('new_deal').style.display = 'none';
        document.getElementById('new_user').style.display = 'inline-block';
    } else {
        user = JSON.parse(window.localStorage.getItem('cb-tpl-user'));
        getUser(user.discord_id, user.wallet).then((user)=>{
            updateLoginUI(user);
        }).catch((err)=>{
            window.localStorage.removeItem('cb-tpl-user');
            document.getElementById('welcome').innerHTML = '';
            document.getElementById('new_deal').style.display = 'none';
            document.getElementById('new_user').style.display = 'inline-block';
            document.getElementById('logout').style.display = 'none';
            alert('User Not Found! Please Login or Sign Up...');
        });
    }
}

function updateLoginUI(user){
    document.getElementById('welcome').innerHTML = 'Welcome '+user.discord_id;
    document.getElementById('new_deal').style.display = 'inline-block';
    document.getElementById('new_user').style.display = 'none';
    document.getElementById('logout').style.display = 'inline-block';
}
function logout(){
    window.localStorage.removeItem('cb-tpl-user');
    document.getElementById('welcome').innerHTML = '';
    document.getElementById('new_deal').style.display = 'none';
    document.getElementById('new_user').style.display = 'inline-block';
    document.getElementById('logout').style.display = 'none';
}

function update(){
    getDeals().then((deals)=>{
        console.log('Deals:', deals);
        buildDealsTable(deals);
        if(selectedDealId >= deals.length){
            selectDeal(selectedDealId);
        } else if(deals.length > 0) {
            selectDeal(0);
        }
    })
}

function selectDeal(dealId){
    selectedDealId = dealId;
    Array.from(document.getElementById('deals').children).forEach((row)=>{
        row.classList.remove("selected");
    })
    let firstDeal = document.getElementById('deal_'+dealId);
    if(firstDeal){
        firstDeal.classList.add("selected");
        getOffersForDeal(dealId).then((offers)=>{
            console.log('Offers:', offers);
            buildOffersTable(offers);
        });
    }
}

function signupUser(){
    let discord_id = document.getElementById('user_discord').value;
    let wallet = document.getElementById('user_wallet').value;
    addUser(discord_id, wallet);
}

function loginUser(){
    let discord_id = document.getElementById('user_discord').value;
    let wallet = document.getElementById('user_wallet').value;
    getUser(encodeURIComponent(discord_id), wallet)
    .then((user)=>{
        saveUserToLocalStorage(user);
        document.getElementById('welcome').innerHTML = 'Welcome '+user.discord_id;
        document.getElementById('new_deal').style.display = 'inline-block';
        document.getElementById('new_user').style.display = 'none';
        document.getElementById('logout').style.display = 'inline-block';
        hideUserModal();
    })
    .catch((err)=>{
        alert('User Not Found! Please Login or Sign Up...');
    });
}

function submitDeal(){
    let wants_model = document.getElementById('modelSelect_wants').value;
    let wants_style = document.getElementById('styleSelect_wants').value;
    let wants_part = document.getElementById('partSelect_wants').value;
    let wants = {
        model: wants_model,
        style: wants_style,
        part: wants_part
    }

    let has_model = document.getElementById('modelSelect_has').value;
    let has_style = document.getElementById('styleSelect_has').value;
    let has_part = document.getElementById('partSelect_has').value;

    let has = {
        model: has_model,
        style: has_style,
        part: has_part
    }
    if(wants_model && wants_style && wants_part && has_model && has_style && has_part){
        addDeal(has, wants);
    } else {
        alert('You must choose each selection to submit a new deal!');
    }
}

function submitOffer(){
    let model = document.getElementById('modelSelect').value;
    let style = document.getElementById('styleSelect').value;
    let part = document.getElementById('partSelect').value;
    if(model && style && part){
        addOffer(selectedDealId, model, style, part);
    } else {
        alert('You must choose each selection to submit a new deal!');
    }
}

function showUserModal(){
    document.getElementById('addUser').style.display = 'block';
}

function hideUserModal(){
    document.getElementById('addUser').style.display = 'none';
}

function showOfferModal(){
    if(!user.wallet){
        showUserModal();
        return; 
    }
    onOfferModelChange();
    document.getElementById('addOffer').style.display = 'block';
}

function hideOfferModal(){
    document.getElementById('addOffer').style.display = 'none';
}

function showDealModal(){
    onDealHasModelChange();
    onDealWantsModelChange();
    document.getElementById('addDeal').style.display = 'block';
}

function hideDealModal(){
    document.getElementById('addDeal').style.display = 'none';
}

function addUser(discord_id, wallet){
    addUserReq({
        discord_id: discord_id,
        wallet
    }).then((user)=>{
        console.log('addUser Post:', user);
        window.user = user;
        window.localStorage.setItem('cb-tpl-user', JSON.stringify(user))
        updateLoginUI(user);
        update();
        hideUserModal();
        saveUserToLocalStorage(user);
    }).catch((err)=>{
        console.log('addUser Error:', err);
    })
}

function saveUserToLocalStorage(user){
    window.localStorage.setItem('cb-tpl-user', JSON.stringify(user));
}

function addOffer(dealId, model, style, part){
    addOfferForDeal(dealId, {
        type: 'offer',
        from_discord_id: user.discord_id,
        from_wallet: user.wallet, 
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

function removeOffer(dealId){
    removeOfferForDeal(dealId)
    .then((data)=>{
        console.log('removeOfferForDeal Delete:', dealId);
        update();
    })
}

function removeDeal(dealId){
    removeDeal(dealId)
    .then((data)=>{
        console.log('removeDeal Delete:', dealId);
        update();
    })
}

function addDeal(has, wants){
    addDealReq({
        type: 'deal',
        from_discord_id: user.discord_id,
        from_wallet: user.wallet, 
        has,
        wants
    }).then((data)=>{
        console.log('addDeal Post:', data);
        update();
        hideDealModal();
    })
}

function displayTables(){
    document.querySelector("#connected").style.display = "block";
}

// Users
function getUsers(){
    return get(BASE_URL+'users');
}

function getUser(discord_id, wallet){
    return get(BASE_URL+'users/'+wallet+'?discord_id='+discord_id);
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

function addUserReq(user){
    return post(BASE_URL+'users', user);
}

function addOfferForDeal(dealId, offer){
    return post(BASE_URL+'offers/'+dealId, offer);
}

function removeOfferForDeal(dealId){
    return deleteReq(BASE_URL+'offers/'+dealId);
}

function removeDeal(dealId){
    return deleteReq(BASE_URL+'deals/'+dealId);
}

function addDealReq(deal){
    return post(BASE_URL+'deals', deal);
}

function get(url){
   return fetch(url)
    .then((response) => response.json())
}

function deleteReq(url){
    return fetch(url,{method: 'DELETE'})
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
        clone.querySelector(".style").innerHTML = fixStyle(deal.has.style) + '<br><br>' + fixStyle(deal.wants.style);

        let allowedOffer = deal.from_discord_id != user.discord_id ? '' : 'disabled';

        clone.querySelector(".offer").innerHTML = `<div style="text-align: center;">
            <button class="btn btn-assemble${allowedOffer}"" id="btn-query" onclick="showOfferModal()" ${allowedOffer}>+</button>
        </div>`;

        let allowedRemove = deal.from_discord_id == user.discord_id ? '' : 'disabled';
        clone.querySelector(".remove").innerHTML = `<div style="text-align: center;">
            <button class="btn btn-dismantle${allowedRemove}" id="btn-query" onclick="removeDeal('${deal.id}')" ${allowedRemove}>-</button>
        </div>`;
        // clone.querySelector(".count").textContent = deal.has.count;
        dealsContainer.appendChild(clone);
    })
    document.getElementById('deal_count').innerHTML = deals.length;
}

function fixStyle(style){
    return style == 'CAMM-E' ? 'camm-e' : style;
}

function buildOffersTable(offers){
    offersContainer.innerHTML = '';
    offers.forEach((offer)=>{
        const clone = templateOffers.content.cloneNode(true);
        clone.querySelector(".user").textContent = '@'+offer.from_discord_id;
        clone.querySelector(".image").innerHTML = partsRevealedImage(offer.part, offer.model, offer.style);
        clone.querySelector(".model").textContent = offer.model;
        clone.querySelector(".part").textContent = offer.part;
        clone.querySelector(".style").textContent = fixStyle(offer.style);

        let allowedRemove = offer.from_discord_id == user.discord_id ? '' : 'disabled';

        clone.querySelector(".remove").innerHTML = `<div style="text-align: center;">
            <button class="btn btn-dismantle${allowedRemove}" id="btn-query" onclick="removeOffer('${offer.id}')" ${allowedRemove}>-</button>
        </div>`;
        // clone.querySelector(".count").textContent = deal.has.count;
        offersContainer.appendChild(clone);
    })
    document.getElementById('offer_count').innerHTML = offers.length;
}

function onOfferModelChange(){
    var e = document.getElementById("modelSelect");
    var model = e.value;
    console.log('onModelChange', model);
    if(model){
        var stylesSelect = document.getElementById("styleSelect");

        let html = '<select id="styleSelect">';
        html += '<option value="">Select Model...</option>';
        STYLE_ORDER[model].forEach((style)=>{
            html += '<option value="'+style+'">'+style+'</option>';
        });
        html += '</select>';

        let select = document.getElementById("style-custom-select");
        select.innerHTML = html;
    }

    let selects = document.getElementsByClassName("custom-select");
    Array.from(selects).forEach((select)=>{
        Array.from(select.children).forEach((elm, index)=>{
            if(index > 0){
                select.removeChild(elm);
            }
        });
    })
    updateSelects();
}

function onDealHasModelChange(){
    var e = document.getElementById("modelSelect_has");
    var model = e.value;
    console.log('onModelChange', model);
    if(model){
        var stylesSelect = document.getElementById("styleSelect");

        let html = '<select id="styleSelect_has">';
        html += '<option value="">Select Model...</option>';
        STYLE_ORDER[model].forEach((style)=>{
            html += '<option value="'+style+'">'+style+'</option>';
        });
        html += '</select>';

        let select = document.getElementById("style-custom-select-has");
        select.innerHTML = html;
    }

    let selects = document.getElementsByClassName("custom-select");
    Array.from(selects).forEach((select)=>{
        Array.from(select.children).forEach((elm, index)=>{
            if(index > 0){
                select.removeChild(elm);
            }
        });
    })
    updateSelects();
}

function onDealWantsModelChange(){
    var e = document.getElementById("modelSelect_wants");
    var model = e.value;
    console.log('onModelChange', model);
    if(model){
        var stylesSelect = document.getElementById("styleSelect_wants");

        let html = '<select id="styleSelect_wants">';
        html += '<option value="">Select Model...</option>';
        STYLE_ORDER[model].forEach((style)=>{
            html += '<option value="'+style+'">'+style+'</option>';
        });
        html += '</select>';

        let select = document.getElementById("style-custom-select-wants");
        select.innerHTML = html;
    }

    let selects = document.getElementsByClassName("custom-select");
    Array.from(selects).forEach((select)=>{
        Array.from(select.children).forEach((elm, index)=>{
            if(index > 0){
                select.removeChild(elm);
            }
        });
    })
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
                s.selected = true;
                h.innerHTML = this.innerHTML;
                y = this.parentNode.getElementsByClassName("same-as-selected");
                yl = y.length;
                for (k = 0; k < yl; k++) {
                  y[k].removeAttribute("class");
                }
                this.setAttribute("class", "same-as-selected");
                if(s.onchange){
                    s.onchange();
                }
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
          if(this.nextSibling){
            this.nextSibling.classList.toggle("select-hide");
          }
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
