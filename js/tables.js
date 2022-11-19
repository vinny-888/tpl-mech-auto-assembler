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
    Object.keys(fullMechs).forEach((model)=>{
        let fullModelMechs = fullMechs[model];
        // Build Table
        if(fullModelMechs.length > 0){
            const clone = templateFull.content.cloneNode(true);
            clone.querySelector(".image").innerHTML = partsImage("Engine", model);
            clone.querySelector(".model").textContent = model;
            clone.querySelector(".count").textContent = fullModelMechs.length;
            fullContainer.appendChild(clone);
        }
        count += fullModelMechs.length;
    })

    if(count == 0){
        const clone = templateEmpty.content.cloneNode(true);
        fullContainer.appendChild(clone);
    }
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
                clone.querySelector(".legs").innerHTML = partsImage('Legs', mech.Legs);
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
                clone.querySelector(".legs").innerHTML = partsImage('Legs', mech.Legs);
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
                    clone.querySelector(".engine").innerHTML = partsImage('Engine', 'missing');
                }

                if(mech.Head){
                    clone.querySelector(".head").innerHTML = partsImage('Head', mech.Head);
                }else{
                    clone.querySelector(".head").innerHTML = partsImage('Head', 'missing');
                }

                if(mech.Body){
                    clone.querySelector(".body").innerHTML = partsImage('Body', mech.Body);
                }else{
                    clone.querySelector(".body").innerHTML = partsImage('Body', 'missing');
                }

                if(mech.Legs){
                    clone.querySelector(".legs").innerHTML = partsImage('Legs', mech.Legs);
                }else{
                    clone.querySelector(".legs").innerHTML = partsImage('Legs', 'missing');
                }

                if(mech.left_arm){
                    clone.querySelector(".left_arm").innerHTML = partsImage('Arm', mech.left_arm);
                }else{
                    clone.querySelector(".left_arm").innerHTML = partsImage('Arm', 'missing');
                }

                if(mech.right_arm){
                    clone.querySelector(".right_arm").innerHTML = partsImage('Arm', mech.right_arm);
                }else{
                    clone.querySelector(".right_arm").innerHTML = partsImage('Arm', 'missing');
                }
                mixedmechPartialContainer.appendChild(clone);
                count++;
            })
        }
    });

    if(mixedMechsPartial.length == 0){
        const clone = templateEmpty.content.cloneNode(true);
        mixedmechPartialContainer.appendChild(clone);
    }
    document.querySelector("#partial_count").innerHTML = '('+count+')';
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