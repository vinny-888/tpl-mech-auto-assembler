function partsImage(part, model) {
    return '<a target="_blank" href="'+buildOpenSeaModelPartURL(model, part)+'"><img height="60px" src="./images/parts/' + model + '_' + part + '.png" title="'+[part, model].join(' ')+'" /></a>';
}

function partsRevealedImage(part, model, style) {
    if(part == 'Leg'){
        part = 'legs';
    }
    return '<a target="_blank" href="'+buildOpenSeaModelPartURL(model, part)+'"><img height="60px" src="https://cb-media.sfo3.cdn.digitaloceanspaces.com/parts/' + model.toLowerCase() + '/' + style.toLowerCase().replaceAll(' ', '-').replaceAll('.', '') + '/' + part.toLowerCase() + '.webp" title="'+[part, model].join(' ')+'" /></a>';
}

function fullRevealedImage(style) {
    if(style == 'CAMM-E'){
        return '<img height="60px" src="https://cb-media.sfo3.cdn.digitaloceanspaces.com/mechs/templates/' + style.toLowerCase().replaceAll(' ', '-') + '.webp" title="'+[style].join(' ')+'" />';
    } else {
        return '<img height="60px" src="https://cb-media.sfo3.cdn.digitaloceanspaces.com/mechs/templates/' + style.toLowerCase().replaceAll(' ', '-').replaceAll('-', '_') + '.webp" title="'+[style].join(' ')+'" />';
    }
}



function partModelImageMissing(part, model) {
    return '<a target="_blank" href="'+buildOpenSeaModelPartURL(model, part)+'"><img height="60px" src="./images/parts/' + model + '_' + part + '_missing.png" title="Missing ' + model + ' Head" /></a>';
}

function partImageMissing(part) {
    return '<a target="_blank" href="'+buildOpenSeaPartURL(part)+'"><img height="60px" src="./images/parts/missing_' + part + '.png" title="Missing ' + part + '" /></a>';
}

function afterglowImageUrl(color) {
    return '<a target="_blank" href="'+buildOpenSeaAfterglowURL(color)+'"><img height="60px" src="./images/afterglows/' +color+ '.avif" title="' + color + '" /></a>';
}

function buildOpenSeaAfterglowURL(color){
    return 'https://opensea.io/collection/tpl-mech-afterglow?search[stringTraits][0][name]=Color&search[stringTraits][0][values][0]='+encodeURIComponent(color);
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
    parts.forEach((part)=>count+= part ? part.count : 0);
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

function getAttributeValue(attributes, trait){
    let val = '';
    attributes.forEach((attribute)=>{
        if(attribute.trait_type == trait){
            val = attribute.value;
        }
    });
    return val;
}

function getNextMech(fullMechs, mixedMechs, mixedMechsNoAfterglow){
    let modelUsed = '';
    for(let i=0;i<RARITY_ORDER.length; i++){
        let model = RARITY_ORDER[i];
        if(fullMechs[model] && fullMechs[model].length > 0){
            fullMechs[model].splice(fullMechs[model].length-1, 1);
            modelUsed = model;
            break;
        } else if(mixedMechs[model] && mixedMechs[model].length > 0){
            mixedMechs[model].splice(mixedMechs[model].length-1, 1);
            modelUsed = model;
            break;
        } else if(mixedMechsNoAfterglow[model] && mixedMechsNoAfterglow[model].length > 0){
            mixedMechsNoAfterglow[model].splice(mixedMechsNoAfterglow[model].length-1, 1);
            modelUsed = model;
            break;
        }
    }
    return modelUsed;
}

function getNextAfterglow(afterglows){
    let afterglowUsed = '';
    for(let i=0; i<afterglows.length; i++){
        let afterglow = afterglows[i];
        if(afterglow.count > 0){
            afterglow.count--;
            afterglowUsed = afterglow.name;
            break;
        }
    }
    return afterglowUsed;
}

function toggleTable(id){
    let table = document.getElementById(id);
    let tableToggle = document.getElementById(id+'Toggle');
    if(table.style.display == 'none'){
        table.style.display = 'block';
        tableToggle.innerHTML = '&#8212';
    } else {
        table.style.display = 'none';
        tableToggle.innerHTML = '&#43';
    }
}