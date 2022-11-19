function partsImage(part, model) {
    return '<img height="60px" src="./images/parts/' + model + '_' + part + '.png" title="'+[part, model].join(' ')+'" />';
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