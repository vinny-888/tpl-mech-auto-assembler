let path = '/tpl-mech-auto-assembler/';
// let path = './';
function partsImage(part, model) {
    return '<a target="_blank" href="'+buildOpenSeaModelPartURL(model, part)+'"><img height="60px" src="./images/parts/' + model + '_' + part + '.png" title="'+[part, model].join(' ')+'" /></a>';
}

function partsRevealedImage(part, model, style) {
    if(part == 'Leg'){
        part = 'legs';
    }
    return '<a target="_blank" href="'+buildOpenSeaRevealedModelPartURL(model, part, style)+'"><img height="60px" src="'+path+'images/revealed/small/' + model.toLowerCase() + '-' + style.toLowerCase().replaceAll(' ', '-').replaceAll('.', '') + '-' + part.toLowerCase() + '.webp" title="'+[model, part, style].join(' ')+'" /></a>';
}

function partsRevealedImagePreview(part, model, style, head, body, legs, left_arm, right_arm ,endurance, speed, power, total) {
    if(part == 'Leg'){
        part = 'legs';
    }
    return '<a onmouseover="bigImgMixed(event, this, \'' + head + '\', \'' + body + '\', \'' + legs + '\', \'' + left_arm + '\', \'' + right_arm + '\')"  onmouseout="smallImgMixed()"   target="_blank" href="'+buildOpenSeaRevealedModelPartURL(model, part, style)+'"><img height="60px" src="'+path+'images/revealed/small/' + model.toLowerCase() + '-' + style.toLowerCase().replaceAll(' ', '-').replaceAll('.', '') + '-' + part.toLowerCase() + '.webp" title="'+[model, part, style, 'Endurance: ' +endurance, 'Speed: ' +speed, 'Power: ' +power, 'Total: ' +total].join(' ')+'" /></a>';
}

function ownerPartsRevealedImage(address, part, model, style) {
    if(part == 'Leg'){
        part = 'legs';
    }
    return '<a target="_blank" href="'+buildOwnerOpenSeaRevealedModelPartURL(address, model, part, style)+'"><img height="60px" src="'+path+'images/revealed/small/' + model.toLowerCase() + '-' + style.toLowerCase().replaceAll(' ', '-').replaceAll('.', '') + '-' + part.toLowerCase() + '.webp" title="'+[model, part, style].join(' ')+'" /></a>';
}

function partsRevealedImageMissing(part, model, style) {
    if(part == 'Leg'){
        part = 'legs';
    }
    return '<a  class="redFilter" target="_blank" href="'+buildOpenSeaRevealedModelPartURL(model, part, style)+'"><img height="60px" src="'+path+'images/revealed/small/' + model.toLowerCase() + '-' + style.toLowerCase().replaceAll(' ', '-').replaceAll('.', '') + '-' + part.toLowerCase() + '.webp" title="'+[model, part, style].join(' ')+'" /></a>';
}

function partsRevealedImageMissingAll(part, model, style) {
    if(part == 'Leg'){
        part = 'legs';
    }
    return '<a  class="redFilter" target="_blank" href="'+buildOpenSeaRevealedModelPartURL(model, part)+'"><img height="60px" src="'+path+'images/revealed/small/' + model.toLowerCase() + '-' + style.toLowerCase().replaceAll(' ', '-').replaceAll('.', '') + '-' + part.toLowerCase() + '.webp" title="'+[model, part, style].join(' ')+'" /></a>';
}

function fullRevealedImage(style) {
    if(style == 'CAMM-E'){
        return '<img onmouseover="bigImg(event, this, \'https://cb-media.sfo3.cdn.digitaloceanspaces.com/mechs/templates/camm-e.webp\')"  onmouseout="smallImg()"  height="60px" src="'+path+'images/mechs/small/camm-e.webp" />';
    } else {
        return '<img onmouseover="bigImg(event, this, \'https://cb-media.sfo3.cdn.digitaloceanspaces.com/mechs/templates/' + style.toLowerCase().replaceAll(' ', '-').replaceAll('-', '_') + '.webp\')"  onmouseout="smallImg()"  height="60px" src="'+path+'images/mechs/small/' + style.toLowerCase().replaceAll(' ', '-').replaceAll('-', '_') + '.webp" />';
    }
}

function mixedRevealedImage(head, body, legs, left_arm, right_arm) {
    head = head.toLowerCase().replaceAll(' ', '-').replaceAll('-', '_')
    body = body.toLowerCase().replaceAll(' ', '-').replaceAll('-', '_')
    legs = legs.toLowerCase().replaceAll(' ', '-').replaceAll('-', '_')
    right_arm = right_arm.toLowerCase().replaceAll(' ', '-').replaceAll('-', '_')
    left_arm = left_arm.toLowerCase().replaceAll(' ', '-').replaceAll('-', '_')
    if(head == 'CAMM-E'){
        head = 'camm-e';
    }
    if(body == 'CAMM-E'){
        body = 'camm-e';
    }
    if(legs == 'CAMM-E'){
        legs = 'camm-e';
    }
    if(right_arm == 'CAMM-E'){
        right_arm = 'camm-e';
    }
    if(left_arm == 'CAMM-E'){
        left_arm = 'camm-e';
    }

    return '<img onmouseover="bigImgMixed(event, this, \'' + head + '\', \'' + body + '\', \'' + legs + '\', \'' + left_arm + '\', \'' + right_arm + '\')"  onmouseout="smallImgMixed()"  height="60px" src="'+path+'images/mechs/small/' + style.toLowerCase().replaceAll(' ', '-').replaceAll('-', '_') + '.webp" />';
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

function buildOpenSeaRevealedModelPartURL(model, part, style){
    if(part == 'legs'){
        part = 'Legs';
    }
    if(style){
        return 'https://opensea.io/collection/tpl-revealed-mech-parts?search[sortAscending]=true&search[sortBy]=UNIT_PRICE&search[stringTraits][0][name]=Model&search[stringTraits][0][values][0]=' + model + '&search[stringTraits][1][name]=Part&search[stringTraits][1][values][0]=' + part + '&search[stringTraits][2][name]=Style&search[stringTraits][2][values][0]=' + style 
    } else {
        return 'https://opensea.io/collection/tpl-revealed-mech-parts?search[sortAscending]=true&search[sortBy]=UNIT_PRICE&search[stringTraits][0][name]=Model&search[stringTraits][0][values][0]=' + model + '&search[stringTraits][1][name]=Part&search[stringTraits][1][values][0]=' + part
    }
}

function buildOwnerOpenSeaRevealedModelPartURL(address, model, part, style){
    if(part == 'legs'){
        part = 'Legs';
    }
    return 'https://opensea.io/'+address+'/tpl-revealed-mech-parts?search[sortBy]=LAST_SALE_PRICE&search[stringTraits][0][name]=Model&search[stringTraits][0][values][0]=' + model + '&search[stringTraits][1][name]=Part&search[stringTraits][1][values][0]=' + part + '&search[stringTraits][2][name]=Style&search[stringTraits][2][values][0]=' + style ;
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

function sortByLowestCountFirst(model){
    let totalParts = {};
    let newOrder = [].concat(STYLE_ORDER[model]);
    newOrder.forEach((style)=>{
        PARTS_ORDER.forEach((part)=>{
            if(!totalParts[style]){
                totalParts[style] = 0;
            }
            totalParts[style] += (dataModel.modelParts[model][part] && dataModel.modelParts[model][part][style] ? dataModel.modelParts[model][part][style] : 0)
        });
    });
    newOrder.sort(function(styleA, styleB){  
        return totalParts[styleA] - totalParts[styleB];
    });
    return newOrder;
}

function sortByHighestCountFirst(model){
    let totalParts = {};
    let newOrder = [].concat(STYLE_ORDER[model]);
    newOrder.forEach((style)=>{
        PARTS_ORDER.forEach((part)=>{
            if(!totalParts[style]){
                totalParts[style] = 0;
            }
            totalParts[style] += (dataModel.modelParts[model] && dataModel.modelParts[model][part] && dataModel.modelParts[model][part][style] ? dataModel.modelParts[model][part][style] : 0)
        });
    });
    newOrder.sort(function(styleA, styleB){  
        return totalParts[styleB] - totalParts[styleA];
    });
    return newOrder;
}

function sortByHighestCountFirstAddress(model, address){
    let totalParts = {};
    let newOrder = [].concat(STYLE_ORDER[model]);
    newOrder.forEach((style)=>{
        PARTS_ORDER.forEach((part)=>{
            if(!totalParts[style]){
                totalParts[style] = 0;
            }
            totalParts[style] += (dataModel.owners[address].modelParts[model] && dataModel.owners[address].modelParts[model][part] && dataModel.owners[address].modelParts[model][part][style] ? dataModel.owners[address].modelParts[model][part][style] : 0)
        });
    });
    newOrder.sort(function(styleA, styleB){  
        return totalParts[styleB] - totalParts[styleA];
    });
    return newOrder;
}

function getSortedKeys(obj) {
    var keys = Object.keys(obj);
    return keys.sort(function(a,b){return obj[a]-obj[b]});
}

function hasTwoMatchingParts(mech, model){
    let count = 0;
    Object.keys(mech).forEach((part)=>{
        if(part != 'Engine' && mech[part] == model){
            count++;
        }
    });
    return count >= 2;
}

function getMostParts(parts){
    let max = 0;
    Object.keys(parts).forEach((part)=>{
        if(parts[part] > max){
            max = parts[part];
        }
    });
    return max;
}

function isFullMech(mech){
    return mech.Head && mech.Body
        && mech.Leg && mech.left_arm
        && mech.right_arm && mech.Engine;
}

function isPartialMech(mech){
    return !mech.Head || !mech.Body
        || !mech.Leg || !mech.left_arm
        || !mech.right_arm || !mech.Engine
}

function countMechParts(mech){
    return Object.keys(mech).length;
}

function changePartOrderBasedOnAvailability(modelType, remainingParts){
    let otherPartCountMax = {};
    remainingParts.forEach((part)=>{
        RARITY_ORDER.forEach((model)=>{
            if(modelType != model){
                PARTS_ORDER.forEach((part)=>{
                    if(!otherPartCountMax[part]){
                        otherPartCountMax[part] = dataModel.modelParts[model][part];
                    } else {
                        otherPartCountMax[part] += dataModel.modelParts[model][part];
                    }
                })
            }
        })
    })
    let partNameByOrder = getSortedKeys(otherPartCountMax);
    return partNameByOrder;
}

function changeRarityOrderBasedOnModel(model){
    let newOrder = [].concat(RARITY_ORDER);
    if(dataModel.useLowest){
        newOrder.reverse();
    }
    let indexOfModel = newOrder.indexOf(model);
    newOrder.splice(indexOfModel, 1);
    newOrder.push(model);
    return newOrder;
}

function getMostPartsStyles(modelParts){
    let max = 0;
    Object.keys(modelParts).forEach((part)=>{
        let count = 0;
        Object.keys(modelParts[part]).forEach((style)=>{
            if(part == 'Arm'){
                count += modelParts[part][style]/2;
            } else {
                count += modelParts[part][style];
            }
        });
        if(count > max){
            max = count;
        }
    })
    return Math.floor(max);
}

function getMostPartsStyleName(modelParts){
    let style = '';
    modelParts.forEach((mech)=>{
        let styleCount = {};
        Object.keys(mech).forEach((part)=>{
            if(!styleCount[mech[part].style]){
                styleCount[mech[part].style] = 0
            }
            styleCount[mech[part].style]++;
        });
        let max = 0;
        let maxIndex = 0;
        Object.keys(styleCount).forEach((style, index)=>{
            if(styleCount[style] > max){
                max = styleCount[style];
                maxIndex = index;
            }
        });
        style = Object.keys(styleCount)[maxIndex];
    })
    return style;
}

let meta_parts = {};
function createMetadataLookup(){
  let counts = {
    endurance: {
      '0': 0,
      '1': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5
    },
    speed: {
      '0': 0,
      '1': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5
    },
    power: {
      '0': 0,
      '1': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5
    }
  };
  Object.keys(revealedMetadata).forEach((token)=>{
    let metadata = revealedMetadata[token];
    let metadataEndurance = metadata.attributes.find((att)=> att.trait_type == 'Endurance').value;
    let metadataSpeed = metadata.attributes.find((att)=> att.trait_type == 'Speed').value;
    let metadataPower = metadata.attributes.find((att)=> att.trait_type == 'Power').value;
    counts.endurance[''+metadataEndurance]++;
    counts.speed[''+metadataSpeed]++;
    counts.power[''+metadataPower]++;
    if(!meta_parts[metadata.name.trim()]){
      meta_parts[metadata.name.trim()] = metadata.attributes;
      // console.log(token, metadata.name, metadata.attributes);
    }
  })
  
//   console.log('meta_parts', JSON.stringify(meta_parts));
//   console.log('counts', counts);
  // validateMetadata();
}