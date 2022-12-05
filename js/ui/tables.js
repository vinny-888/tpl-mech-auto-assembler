function buildPartsTable(){
    let partCount = 0;
    // All Parts
    dataModel.walletParts.forEach((part)=>{
        if(part.count > 0){
            // Build Table
            const clone = template.content.cloneNode(true);
            clone.querySelector(".image").innerHTML = partsImage(part.part, part.model);
            clone.querySelector(".part").textContent = part.part;
            clone.querySelector(".model").textContent = part.model;
            clone.querySelector(".count").textContent = part.count;
            accountContainer.appendChild(clone);
            partCount++;
        }
    });

    if(partCount == 0){
        const clone = templateEmpty.content.cloneNode(true);
        accountContainer.appendChild(clone);
    }
}

function buildCyberbrokerTable(){
    cyberbrokerCountsContainer.innerHTML = '';
    let brokerCount = 0;
    // All Parts
    dataModel.cyberBrokers.forEach((broker)=>{
        // Build Table
        const clone = templateCyberbrokerCounts.content.cloneNode(true);
        clone.querySelector(".image").innerHTML = '<div><img src="https://ipfs.io/ipfs/QmcsrQJMKA9qC9GcEMgdjb9LPN99iDNAg8aQQJLJGpkHxk/'+broker.tokenId+'.svg" /></div><div>'+broker.uri.name+'</div';
        let mech = broker.mech ? broker.mech : 'missing';
        clone.querySelector(".mech").innerHTML = '<div><img src="./images/parts/'+mech+'_Engine.png" /></div><div>'+mech+'</div';
        let afterglowSrc = broker.afterglow ? broker.afterglow+'.avif' : 'missing.png';
        let afterglow = broker.afterglow ? broker.afterglow : 'missing';
        clone.querySelector(".afterglow").innerHTML = '<div><img src="./images/afterglows/'+afterglowSrc+'" /></div><div>'+afterglow+'</div';
        clone.querySelector(".talent").textContent = getAttributeValue(broker.uri.attributes, 'Talent');
        clone.querySelector(".species").textContent = getAttributeValue(broker.uri.attributes, 'Species');
        clone.querySelector(".class").textContent = getAttributeValue(broker.uri.attributes, 'Class');
        clone.querySelector(".mind").textContent = getAttributeValue(broker.uri.attributes, 'Mind');
        clone.querySelector(".body").textContent = getAttributeValue(broker.uri.attributes, 'Body');
        clone.querySelector(".soul").textContent = getAttributeValue(broker.uri.attributes, 'Soul');

        clone.childNodes[1].addEventListener("click", ()=>{selectCyberbroker(broker.tokenId)});
        clone.childNodes[1].id = 'cyberbroker_'+broker.tokenId;
        // clone.querySelector(".count").textContent = part.count;
        cyberbrokerCountsContainer.appendChild(clone);
        brokerCount++;
    });

    document.getElementById('cyberbroker_count').innerHTML = brokerCount;
    if(brokerCount == 0){
        const clone = templateEmpty.content.cloneNode(true);
        cyberbrokerCountsContainer.appendChild(clone);
    }
}

function buildPartCountsTable(){
    RARITY_ORDER.forEach((model)=>{
        const clone = templateCounts.content.cloneNode(true);
        clone.querySelector(".model").textContent = model;
        PARTS_ORDER.forEach((part)=>{
            clone.querySelector("."+part).textContent = dataModel.modelParts[model][part];
        });
        countsContainer.appendChild(clone);
    })
}

function buildAfterglowTable(){
    let afterglowCount = 0;
    // All Afterglows
    dataModel.walletAfterglows.forEach((afterglow)=>{
        if(afterglow.count > 0){
        // Build Table
        const clone = templateAfterglow.content.cloneNode(true);
        clone.querySelector(".image").innerHTML = afterglowImage(afterglow.name);
        clone.querySelector(".name").textContent = afterglow.name;
        clone.querySelector(".count").textContent = afterglow.count;
        afterglowContainer.appendChild(clone);
        afterglowCount++;
        }
    });

    if(afterglowCount == 0){
        const clone = templateEmpty.content.cloneNode(true);
        afterglowContainer.appendChild(clone);
    }
}

function buildFullMechTable(fullMechs){
    let count = 0;
    RARITY_ORDER.forEach((model)=>{
        let fullModelMechs = fullMechs[model];
        // Build Table
        let allowedDismantle = 'disabled';
        let allowedAssemble = dataModel.dismantled[model] > 0 ? '' : 'disabled';
        let countOfMechs = 0;
        if(fullModelMechs){
            allowedDismantle = fullModelMechs.length > 0 ? '' : 'disabled';
            countOfMechs = fullModelMechs.length;
        }
        const clone = templateFull.content.cloneNode(true);
        clone.querySelector(".image").innerHTML = partsImage("Engine", model);
        clone.querySelector(".model").textContent = model;
        clone.querySelector(".count").textContent = countOfMechs;

        clone.querySelector(".dismantle").innerHTML = `<div style="text-align: center;">
            <button class="btn btn-dismantle${allowedDismantle}" id="btn-query" onclick="dismantle('${model}')" ${allowedDismantle}>-</button>
            <button class="btn btn-assemble${allowedAssemble}"" id="btn-query" onclick="assemble('${model}')" ${allowedAssemble}>+</button>
        </div>`;
        fullContainer.appendChild(clone);
        count += countOfMechs;
    })

    document.querySelector("#full_count").innerHTML = '('+count+')';
}

function buildMixedModelMechsSummaryTable(mixedMechs){
    let totalMixed = 0;
    let modelCounts = {};
    // Count the mixed mechs for each models
    RARITY_ORDER.forEach((model)=>{
        if(mixedMechs[model]){
            mixedMechs[model].forEach((mech)=>{
                if(mech['Engine'] == model){
                    if(!modelCounts[model]){
                        modelCounts[model] = 0;
                    }
                    modelCounts[model]++;
                    totalMixed++;
                }
            })
        }
    });
    Object.keys(modelCounts).forEach((model)=>{
        const clone = templateMixed.content.cloneNode(true);
        clone.querySelector(".image").innerHTML = partsImage("Engine", model);
        clone.querySelector(".model").textContent = model;
        clone.querySelector(".count").textContent = modelCounts[model];
        mixedContainer.appendChild(clone);
    })
    if(totalMixed == 0){
        const clone = templateEmpty.content.cloneNode(true);
        mixedContainer.appendChild(clone);
    }
    document.querySelector("#mixed_count").innerHTML = '('+totalMixed+')';
}

function buildMixedMechsTable(mixedMechs){
    let count = 0;
    RARITY_ORDER.forEach((model)=>{
        if(mixedMechs[model]){
            mixedMechs[model].forEach((mech)=>{
                const clone = templateMixedMech.content.cloneNode(true);

                clone.querySelector(".engine").innerHTML = partsImage('Engine', mech.Engine);
                clone.querySelector(".head").innerHTML = partsImage('Head', mech.Head);
                clone.querySelector(".body").innerHTML = partsImage('Body', mech.Body);
                clone.querySelector(".legs").innerHTML = partsImage('Leg', mech.Leg);
                clone.querySelector(".left_arm").innerHTML = partsImage('Arm', mech.left_arm);
                clone.querySelector(".right_arm").innerHTML = partsImage('Arm', mech.right_arm);

                mixedmechContainer.appendChild(clone);
                count++;
            })
        }
    });

    if(count == 0){
        const clone = templateEmpty.content.cloneNode(true);
        mixedmechContainer.appendChild(clone);
    }
    document.querySelector("#mixed_count2").innerHTML = '('+count+')';
}

function buildMixedMechNoAfterglowTable(mixedMechsNoAfterglow){
    let count = 0;
    RARITY_ORDER.forEach((model)=>{
        if(mixedMechsNoAfterglow[model]){
            mixedMechsNoAfterglow[model].forEach((mech)=>{
                const clone = templateMixedMech.content.cloneNode(true);

                clone.querySelector(".engine").innerHTML = partsImage('Engine', mech.Engine);
                clone.querySelector(".head").innerHTML = partsImage('Head', mech.Head);
                clone.querySelector(".body").innerHTML = partsImage('Body', mech.Body);
                clone.querySelector(".legs").innerHTML = partsImage('Leg', mech.Leg);
                clone.querySelector(".left_arm").innerHTML = partsImage('Arm', mech.left_arm);
                clone.querySelector(".right_arm").innerHTML = partsImage('Arm', mech.right_arm);

                mixedmechNoAfterglowContainer.appendChild(clone);
                count++;
            })
        }
    });

    if(count == 0){
        const clone = templateEmpty.content.cloneNode(true);
        mixedmechNoAfterglowContainer.appendChild(clone);
    }
    document.querySelector("#noafterglow_count").innerHTML = '('+count+')';
}

function buildPartialMechTable(mixedMechsPartial){
    let count = 0;
    RARITY_ORDER.forEach((model)=>{
        if(mixedMechsPartial[model]){
            mixedMechsPartial[model].forEach((mech)=>{
                const clone = templateMixedMech.content.cloneNode(true);

                if(mech.Engine){
                    clone.querySelector(".engine").innerHTML = partsImage('Engine', mech.Engine);
                }else{
                    clone.querySelector(".engine").innerHTML = partImageMissing('Engine', 'missing');
                }

                if(mech.Head){
                    clone.querySelector(".head").innerHTML = partsImage('Head', mech.Head);
                }else{
                    clone.querySelector(".head").innerHTML = partImageMissing('Head', 'missing');
                }

                if(mech.Body){
                    clone.querySelector(".body").innerHTML = partsImage('Body', mech.Body);
                }else{
                    clone.querySelector(".body").innerHTML = partImageMissing('Body', 'missing');
                }

                if(mech.Leg){
                    clone.querySelector(".legs").innerHTML = partsImage('Leg', mech.Leg);
                }else{
                    clone.querySelector(".legs").innerHTML = partImageMissing('Leg', 'missing');
                }

                if(mech.left_arm){
                    clone.querySelector(".left_arm").innerHTML = partsImage('Arm', mech.left_arm);
                }else{
                    clone.querySelector(".left_arm").innerHTML = partImageMissing('Arm', 'missing');
                }

                if(mech.right_arm){
                    clone.querySelector(".right_arm").innerHTML = partsImage('Arm', mech.right_arm);
                }else{
                    clone.querySelector(".right_arm").innerHTML = partImageMissing('Arm', 'missing');
                }
                mixedmechPartialContainer.appendChild(clone);
                count++;
            })
        }
    });

    if(count == 0){
        const clone = templateEmpty.content.cloneNode(true);
        mixedmechPartialContainer.appendChild(clone);
    }
    document.querySelector("#partial_count").innerHTML = '('+count+')';
}

function buildPartialMechNoModelTable(mixedMechsPartial){
    let count = 0;
    RARITY_ORDER.forEach((model)=>{
        if(mixedMechsPartial[model]){
            mixedMechsPartial[model].forEach((mech)=>{
                const clone = templateMixedMech.content.cloneNode(true);
                let model = getMostMatchingParts(mech);

                if(mech.Engine){
                    clone.querySelector(".engine").innerHTML = partsImage('Engine', mech.Engine);
                }else{
                    clone.querySelector(".engine").innerHTML = partModelImageMissing('Engine', model, 'Missing ' + model + ' Engine');
                }

                if(mech.Head){
                    clone.querySelector(".head").innerHTML = partsImage('Head', mech.Head);
                }else{
                    clone.querySelector(".head").innerHTML = partModelImageMissing('Head', model, 'Missing ' + model + ' Head');
                }

                if(mech.Body){
                    clone.querySelector(".body").innerHTML = partsImage('Body', mech.Body);
                }else{
                    clone.querySelector(".body").innerHTML = partModelImageMissing('Body', model, 'Missing ' + model + ' Body');
                }

                if(mech.Leg){
                    clone.querySelector(".legs").innerHTML = partsImage('Leg', mech.Leg);
                }else{
                    clone.querySelector(".legs").innerHTML = partModelImageMissing('Leg', model, 'Missing ' + model + ' Leg');
                }

                if(mech.left_arm){
                    clone.querySelector(".left_arm").innerHTML = partsImage('Arm', mech.left_arm);
                }else{
                    clone.querySelector(".left_arm").innerHTML = partModelImageMissing('Arm', model, 'Missing ' + model + ' Arm');
                }

                if(mech.right_arm){
                    clone.querySelector(".right_arm").innerHTML = partsImage('Arm', mech.right_arm);
                }else{
                    clone.querySelector(".right_arm").innerHTML = partModelImageMissing('Arm', model, 'Missing ' + model + 'Arm');
                }
                mixedmechPartialNoModelContainer.appendChild(clone);
                count++;
            })
        }
    });

    if(count == 0){
        const clone = templateEmpty.content.cloneNode(true);
        mixedmechPartialNoModelContainer.appendChild(clone);
    }
    document.querySelector("#partial_no_model_count").innerHTML = '('+count+')';
}

function buildRemainingPartsTable(){
    let remainingCount = 0;
    RARITY_ORDER.forEach((model)=>{
        if(dataModel.modelParts[model]){
            Object.keys(dataModel.modelParts[model]).forEach((part)=>{
            if(dataModel.modelParts[model][part] > 0){
                const clone = templateRemainingMech.content.cloneNode(true);

                clone.querySelector(".image").innerHTML = partsImage(part, model);
                clone.querySelector(".part").textContent = part;
                clone.querySelector(".model").textContent = model;
                clone.querySelector(".count").textContent = dataModel.modelParts[model][part];
                remainingContainer.appendChild(clone);
                remainingCount += dataModel.modelParts[model][part];
            }
            });
        }
    });

    if(remainingCount == 0){
        const clone = templateEmpty.content.cloneNode(true);
        remainingContainer.appendChild(clone);
    }
    document.querySelector("#remaining_count").innerHTML = '('+remainingCount+')';
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