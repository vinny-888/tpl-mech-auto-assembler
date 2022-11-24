function partsImage(part, model) {
    return '<img height="60px" src="./images/parts/' + model + '_' + part + '.png" title="'+[part, model].join(' ')+'" />';
}

function partModelImageMissing(part, model) {
    return '<a target="_blank" href="'+buildOpenSeaModelPartURL(model, part)+'"><img height="60px" src="./images/parts/' + model + '_' + part + '_missing.png" title="Missing ' + model + ' Head" /></a>';
}

function partImageMissing(part) {
    return '<a target="_blank" href="'+buildOpenSeaPartURL(part)+'"><img height="60px" src="./images/parts/missing_' + part + '.png" title="Missing ' + part + '" /></a>';
}

function buildOpenSeaModelPartURL(model, part){
    return 'https://opensea.io/collection/tpl-mecha-part?search[stringTraits][0][name]=Model&search[stringTraits][0][values][0]=' + model + '&search[stringTraits][1][name]=Part&search[stringTraits][1][values][0]=' + part;
}

function buildOpenSeaPartURL(part){
    return 'https://opensea.io/collection/tpl-mecha-part?search[sortAscending]=true&search[sortBy]=UNIT_PRICE&search[stringTraits][0][name]=Part&search[stringTraits][0][values][0]=' + part;
}

function afterglowImage(afterglow) {
    return '<img height="60px" src="./images/afterglows/' +afterglow+ '.avif" title="'+afterglow+'" />';
}

function getAddressArr(address, count){
    let addresses = [];
    for(let i=1; i<=count; i++){
        addresses.push(address);
    }
    return addresses;
}

function getCardArr(count){
    let cards = [];
    for(let i=1; i<=count; i++){
        cards.push(i);
    }
    return cards;
}

function countParts(parts){
    let count = 0;
    parts.forEach((part)=>count+=part.count);
    return count
}

function countMechs(model){
    return dataModel.modelParts[model].length;
}

function getMostMatchingParts(mech){
    let max = 0;
    let counts = {};
    let model = '';
    Object.keys(mech).forEach((part)=>{
        if(!counts[mech[part]]){
            counts[mech[part]] = 0;
        }
        counts[mech[part]]++;
    });

    Object.keys(counts).forEach((part)=>{
        if(counts[part] > max){
            max = counts[part];
            model = part;
        }
    });

    return model;
}