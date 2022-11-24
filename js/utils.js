function partsImage(part, model, title) {
    let missing = false;
    if(!title){
        title = [part, model].join(' ');
    } else {
        missing = true;
    }
    return '<img height="60px" src="./images/parts/' + model + '_' + part + (missing ? '_missing' : '') + '.png" title="'+title+'" />';
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