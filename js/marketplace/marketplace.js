"use strict";
const templateDeals = document.querySelector("#template-deals");
const dealsContainer = document.querySelector("#deals");

const templateOffers = document.querySelector("#template-offers");
const offersContainer = document.querySelector("#offers");

const templateParts = document.querySelector("#template-parts");
const partsContainer = document.querySelector("#parts");

const templateUser = document.querySelector("#template-deals");
const userContainer = document.querySelector("#users");
const BASE_URL = 'https://cb-tpl.glitch.me/';
let selectBoxes = {};
let filters = {};
let filteredDeals = [];

let selectedDealId = 0;
let user = {};
let dealsCache = [];
let offersCache = [];
let styles_flat = [];
let modelParts = [];
function init() {
    initContracts();
    Object.keys(STYLE_ORDER).forEach((model)=>{
        styles_flat = styles_flat.concat(STYLE_ORDER[model]);
    })
    createMetadataLookup();
    // initMultiselects();
    addEventlisteners();
    displayTables();
    updateDeals();
    if(window.localStorage.getItem('cb-tpl-user') == null){
        document.getElementById('new_deal').style.display = 'none';
        document.getElementById('bulk_deal').style.display = 'none';
        document.getElementById('new_user').style.display = 'inline-block';
    } else {
        user = JSON.parse(window.localStorage.getItem('cb-tpl-user'));
        getUser(user.discord_id, user.wallet).then((user)=>{
            updateLoginUI(user);
            getParts();
        }).catch((err)=>{
            window.localStorage.removeItem('cb-tpl-user');
            document.getElementById('welcome').innerHTML = '';
            document.getElementById('new_deal').style.display = 'none';
            document.getElementById('bulk_deal').style.display = 'none';
            document.getElementById('new_user').style.display = 'inline-block';
            document.getElementById('logout').style.display = 'none';
            alert('User Not Found! Please Login or Sign Up...');
        });
    }
    let models = [];
    let styles = [];
    let parts = [];
    Object.keys(meta_parts).forEach((name)=>{
        let meta = meta_parts[name];
        let model = meta.find((att)=> att.trait_type == 'Model').value;
        models.push(model);
        let style = meta.find((att)=> att.trait_type == 'Style').value;
        styles.push(style);
        let part = meta.find((att)=> att.trait_type == 'Part').value;
        parts.push(part);
    });

    getUsers().then((users)=>{
        setTimeout(()=>{

            let userFiltered = [];
            dealsCache.forEach((deal)=>{
                if(userFiltered.indexOf(deal.from_discord_id) == -1){
                    userFiltered.push(deal.from_discord_id);
                }
            })

            makeMultiselect(userFiltered, 'User');
            document.querySelector("#User").addEventListener("change", userChanged);
            Array.from(document.getElementsByClassName('multiselect')).forEach((elm)=>{
                elm.style.display = 'block';
            })
        }, 0);
    }).catch((err)=>{
        console.log('Error');
    })


    makeMultiselect(RARITY_ORDER, 'Model');
    document.querySelector("#Model").addEventListener("change", modelChanged);
    makeMultiselect(styles_flat, 'Style');
    document.querySelector("#Style").addEventListener("change", styleChanged);
    makeMultiselect(PARTS_ORDER, 'Part');
    document.querySelector("#Part").addEventListener("change", partChanged);
    

    Array.from(document.getElementsByClassName('multiselect')).forEach((elm)=>{
        elm.style.display = 'block';
    })
}

async function getParts(){
    let totalSupply = await getRevealedMechTotalSupply();

    let revealedTokenIds = await getRevealedMechTokenBalance(user.wallet, totalSupply);

    revealedTokenIds.forEach((tokenId)=>{
        // let metadata = await getRevealedMechTokenMetadata(tokenId);
        // let model = BODY_PART_MODEL_MAPPING[metadata.model];
        // let part = BODY_PART_MAPPING[metadata.partType];
        let tokenMetadata = revealedMetadata[''+tokenId];
        if(tokenMetadata){
          let model = tokenMetadata.attributes.find((att)=> att.trait_type == 'Model').value;
          let part = tokenMetadata.attributes.find((att)=> att.trait_type == 'Part').value;
          if(part == 'Legs'){
            part = 'Leg';
          }
          let style = tokenMetadata.attributes.find((att)=> att.trait_type == 'Style').value;
          modelParts.push({
            model,
            part,
            style
          });
        }
    })
    buildPartsTable(modelParts);
}

function updateLoginUI(user){
    document.getElementById('welcome').innerHTML = 'Welcome '+user.discord_id;
    document.getElementById('new_deal').style.display = 'inline-block';
    document.getElementById('bulk_deal').style.display = 'inline-block';
    document.getElementById('new_user').style.display = 'none';
    document.getElementById('logout').style.display = 'inline-block';
}
function logout(){
    window.localStorage.removeItem('cb-tpl-user');
    document.getElementById('welcome').innerHTML = '';
    document.getElementById('new_deal').style.display = 'none';
    document.getElementById('bulk_deal').style.display = 'none';
    document.getElementById('new_user').style.display = 'inline-block';
    document.getElementById('logout').style.display = 'none';
}

function updateDeals(){
    getDeals().then((deals)=>{
        dealsCache = deals;
        console.log('Deals:', deals);

        setTimeout(()=>{
            filterData();
            console.log('Filtered Deals:', filteredDeals);
            buildDealsTable(filteredDeals);
            if(filteredDeals.length > 0) {
                selectDeal(filteredDeals[0].id);
            }
        }, 0)
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
        getParts();
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

function showPartsModal(){
    document.getElementById('addParts').style.display = 'block';
}

function hidePartsModal(){
    document.getElementById('addParts').style.display = 'none';
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
        saveUserToLocalStorage(user);
        updateLoginUI(user);
        updateDeals();
        hideUserModal();
        init();
    }).catch((err)=>{
        console.log('addUser Error:', err);
    })
}

function saveUserToLocalStorage(user){
    window.user = user;
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
        updateDeals();
        hideOfferModal();
    })
}

function removeOffer(dealId){
    removeOfferForDeal(dealId)
    .then((data)=>{
        console.log('removeOfferForDeal Delete:', dealId);
        updateDeals();
    })
}

function removeDeal(dealId){
    removeDealReq(dealId)
    .then((data)=>{
        console.log('removeDeal Delete:', dealId);
        updateDeals();
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
        updateDeals();
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

function removeDealReq(dealId){
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
        tr.classList.add('clickable');
        tr.onclick = ()=>{selectDeal(deal.id)};

        clone.querySelector(".user").innerHTML = '<a target="_blank" href="revealed.html?wallet='+deal.from_wallet+'">@'+deal.from_discord_id+'</a>';
        clone.querySelector(".text").innerHTML = 'Has:<br><br>Wants:';
        clone.querySelector(".image").innerHTML = partsRevealedImage(deal.has.part, deal.has.model, deal.has.style);
        clone.querySelector(".model").innerHTML = (deal.has ? deal.has.model : '') + '<br><br>' + (deal.wants ? deal.wants.model : '');
        clone.querySelector(".part").innerHTML = (deal.has ? deal.has.part : '')+ '<br><br>' + (deal.wants ? deal.wants.part : '');
        clone.querySelector(".style").innerHTML = fixStyle(deal.has ? deal.has.style : '' ) + '<br><br>' + fixStyle(deal.wants ? deal.wants.style : '');

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

function selectPart(partId){
    let row = document.getElementById('part_'+partId);
    if(Array.from(row.classList).indexOf('selected') == -1){
        row.classList.add('selected');
    } else {
        row.classList.remove('selected');
    }
}

function addParts(){
    // let selectedParts = [];
    Array.from(partsContainer.children).forEach((row)=>{
        if(Array.from(row.classList).indexOf('selected') != -1){
            row.classList.add('selected');
            // let id = parseInt(row.id.split('_')[1]);
            addDeal({
                model: row.cb_model,
                style: row.cb_style,
                part: row.cb_part
            }, {});
            hidePartsModal();
        }
    })
    // console.log(selectedParts);
}

function buildPartsTable(parts){
    partsContainer.innerHTML = '';
    parts.forEach((part, index)=>{
        const clone = templateParts.content.cloneNode(true);
        let tr = clone.children[0];
        tr.id = 'part_'+index;
        tr.cb_model = part.model;
        tr.cb_style = part.style;
        tr.cb_part = part.part;
        tr.classList.add('clickable');
        tr.onclick = ()=>{selectPart(index)};

        clone.querySelector(".image").innerHTML = partsRevealedImage(part.part, part.model, part.style);
        clone.querySelector(".model").textContent = part.model;
        clone.querySelector(".part").textContent = part.part;
        clone.querySelector(".style").textContent = fixStyle(part.style);

        partsContainer.appendChild(clone);
    })
    document.getElementById('part_count').innerHTML = parts.length;
}


function buildOffersTable(offers){
    offersContainer.innerHTML = '';
    offers.forEach((offer)=>{
        const clone = templateOffers.content.cloneNode(true);
        let tr = clone.children[0];
        tr.id = 'offer_'+offer.id;
        tr.classList.add('clickable');
        clone.querySelector(".user").innerHTML = '<a target="_blank" href="revealed.html?wallet='+offer.from_wallet+'">@'+offer.from_discord_id+'</a>';
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


// SELECTS

function initMultiselects(){
    let columns = ['Destination', 'East', 'West', 'Planet', 'Road', 'Sky', 'Misc'];
    let selectBoxUser = new vanillaSelectBox("#User", {
        "maxHeight": 400, 
        "search": true ,
        "translations": { "all": "User", "items": "items","selectAll":"Check All","clearAll":"Clear All","placeHolder": "User"}
    });

    let selectBoxModel = new vanillaSelectBox("#Model", {
        "maxHeight": 400, 
        "search": true ,
        "translations": { "all": "Model", "items": "items","selectAll":"Check All","clearAll":"Clear All","placeHolder": "Model"}
    });

    let selectBoxStyle = new vanillaSelectBox("#Style", {
        "maxHeight": 400, 
        "search": true ,
        "translations": { "all": "Style", "items": "items","selectAll":"Check All","clearAll":"Clear All","placeHolder": "Style"}
    });

    let selectBoxPart = new vanillaSelectBox("#Part", {
        "maxHeight": 400, 
        "search": true ,
        "translations": { "all": "Part", "items": "items","selectAll":"Check All","clearAll":"Clear All","placeHolder": "Part"}
    });

    Array.from(document.getElementsByClassName('multiselect')).forEach((elm)=>{
        elm.style.display = 'block';
    })
}

function makeMultiselect(data, elm){
    let select = document.getElementById(elm);
    for (var i = 0;i < data.length;i++) {
        if(data[i] != ''){
            var option = document.createElement("option");
            option.value = data[i];
            option.text = data[i];
            option.setAttribute('selected', 'true')
            select.appendChild(option);
        }
    }

    selectBoxes[elm] = new vanillaSelectBox("#"+elm, { "translations": {"all": elm}, "keepInlineStyles":false,"maxHeight": 200,"maxWidth":110,"minWidth":110, "search": true, "placeHolder": elm });
}

function makeNestedMultiselect(data, elm){
    let select = document.getElementById(elm);
    Object.keys(data).forEach((att)=>{
        if(att != 'Destination' && att != 'East Landscape' && att != 'East City Scape' && att != 'West Landscape' && att != 'West City Scape'
        && att != 'Planet' && att != 'Road' && att != 'Sky' ){
            console.log(att);
            var optionGroup = document.createElement("optgroup");
            optionGroup.label = att;
            for (var i = 0;i < data[att].length;i++) {
                if(data[att][i] != ''){
                    var option = document.createElement("option");
                    option.value = data[att][i];
                    option.text = data[att][i];
                    option.setAttribute('selected', 'true')
                    optionGroup.appendChild(option);
                }
            }
            select.appendChild(optionGroup);
        }
    })

    selectBoxes[elm] = new vanillaSelectBox("#"+elm, { "translations": {"all": elm}, "keepInlineStyles":false,"maxHeight": 200,"maxWidth":178,"minWidth":178, "search": true, "placeHolder": elm });
}

function userChanged(){
    console.log('userChanged');
    let users = getValues('User');
    console.log(users);
    filters['from_discord_id'] = users;
    setTimeout(()=>{
        updateDeals();
    }, 0);
}

function modelChanged(){
    console.log('modelChanged');
    let models = getValues('Model');
    console.log(models);
    filters['model'] = models;
    setTimeout(()=>{
        updateDeals();
        document.querySelector("#Style").addEventListener("change", styleChanged);
    }, 0);
}

function partChanged(){
    console.log('partChanged');
    let parts = getValues('Part');
    console.log(parts);
    filters['part'] = parts;
    setTimeout(()=>{
        updateDeals();
    }, 0);
}

function styleChanged(){
    console.log('styleChanged');
    let styles = getValues('Style');
    console.log(styles);
    filters['style'] = styles;
    setTimeout(()=>{
        updateDeals();
    }, 0);
}

function addEventlisteners(){
    // document.querySelector("#sort").addEventListener('change', (event)=>{
    //     sort_type = document.querySelector("#sort").value;
    //     console.log('sort changed', sort_type);
    //     refresh();
    // })
}

function filterData(){
    filteredDeals = [];
    dealsCache.forEach((deal)=>{
        if(!hasExcludedValue(deal, 'from_discord_id', filters['from_discord_id'])
            && !hasExcludedValue(deal.has, 'model', filters['model'])
            && !hasExcludedValue(deal.has, 'style', filters['style'])
            && !hasExcludedValue(deal.has, 'part', filters['part'])){
                filteredDeals.push(deal);
        }
        // if(!hasExcludedAttribute(token, 'Other', filters['Other'])){
        //     filteredData.push(token);
        // }
    })
}

function hasExcludedAttribute(token, name, attributes){
    if(!attributes){
        return false;
    }
    let hasExcludedAtt = false;
    for(let i=0; i<token.attributes.length; i++){
        if(token.attributes[i].trait_type == name){
            hasExcludedAtt = attributes.indexOf(token.attributes[i].value) == -1;
            break;
        }
    }
    return hasExcludedAtt;
}

function hasExcludedValue(token, name, attributes){
    if(!attributes){
        return false;
    }
    return attributes.indexOf(token[name]) == -1;
}