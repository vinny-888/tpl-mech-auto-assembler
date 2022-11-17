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
    rarityOrder.forEach((model)=>{
        const clone = templateCounts.content.cloneNode(true);
        clone.querySelector(".model").textContent = model;
        partOrder.forEach((part)=>{
            clone.querySelector("."+part).textContent = dataModel.fullModelMechs[model][part];
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

function buildFullMechTable(){
    let totalFullParts = 0;
    dataModel.remainingAfterglows = dataModel.totalAfterglows;
    rarityOrder.forEach((model)=>{
        let mechParts = Object.keys(dataModel.fullModelMechs[model]);
        let min = 99999;
        mechParts.forEach((part)=>{
            let count = parseInt(dataModel.fullModelMechs[model][part]);
            if(part == 'Arm'){
                count = Math.floor(count/2);
            }
            if(count < min){
                min = count;
            }
        });
        if(dataModel.remainingAfterglows > min){
            dataModel.fullModelMechCounts[model] = min;
            dataModel.remainingAfterglows -= min;
        } else {
            dataModel.fullModelMechCounts[model] = dataModel.remainingAfterglows;
            dataModel.remainingAfterglows = 0;
        }
        // Build Table
        if(min > 0){
            const clone = templateFull.content.cloneNode(true);
            clone.querySelector(".image").innerHTML = partsImage("Engine", model);
            clone.querySelector(".model").textContent = model;
            clone.querySelector(".count").textContent = min;
            fullContainer.appendChild(clone);
        }
        totalFullParts += min;
    })

    if(totalFullParts == 0){
        const clone = templateEmpty.content.cloneNode(true);
        fullContainer.appendChild(clone);
    }
    document.querySelector("#full_count").innerHTML = '('+totalFullParts+')';
}


function buildMixedModelMechsSummaryTable(){
    let totalMixed = 0;
    rarityOrder.forEach((model)=>{
        if(dataModel.mixedModelMechCounts[model] > 0){
            const clone = templateMixed.content.cloneNode(true);
            clone.querySelector(".image").innerHTML = partsImage("Engine", model);
            clone.querySelector(".model").textContent = model;
            clone.querySelector(".count").textContent = dataModel.mixedModelMechCounts[model];
            mixedContainer.appendChild(clone);
            totalMixed += dataModel.mixedModelMechCounts[model];
        }
    });
    if(totalMixed == 0){
        const clone = templateEmpty.content.cloneNode(true);
        mixedContainer.appendChild(clone);
    }
}

function buildMixedMechsTable(mixedMechs){
    if(mixedMechs.length == 0){
        const clone = templateEmpty.content.cloneNode(true);
        mixedmechContainer.appendChild(clone);
    }
    mixedMechs.forEach((mech)=>{
        const clone = templateMixedMech.content.cloneNode(true);

        clone.querySelector(".engine").innerHTML = partsImage('Engine', mech.Engine);
        clone.querySelector(".head").innerHTML = partsImage('Head', mech.Head);
        clone.querySelector(".body").innerHTML = partsImage('Body', mech.Body);
        clone.querySelector(".legs").innerHTML = partsImage('Legs', mech.Legs);
        clone.querySelector(".left_arm").innerHTML = partsImage('Arm', mech.left_arm);
        clone.querySelector(".right_arm").innerHTML = partsImage('Arm', mech.right_arm);

        mixedmechContainer.appendChild(clone);
    })
    document.querySelector("#mixed_count2").innerHTML = '('+mixedMechs.length+')';
    document.querySelector("#mixed_count").innerHTML = '('+mixedMechs.length+')';
}

function buildMixedMechNoAfterglowTable(mixedMechsNoAfterglow){
    if(mixedMechsNoAfterglow.length == 0){
        const clone = templateEmpty.content.cloneNode(true);
        mixedmechNoAfterglowContainer.appendChild(clone);
      }
      mixedMechsNoAfterglow.forEach((mech)=>{
        const clone = templateMixedMech.content.cloneNode(true);
    
        clone.querySelector(".engine").innerHTML = partsImage('Engine', mech.Engine);
        clone.querySelector(".head").innerHTML = partsImage('Head', mech.Head);
        clone.querySelector(".body").innerHTML = partsImage('Body', mech.Body);
        clone.querySelector(".legs").innerHTML = partsImage('Legs', mech.Legs);
        clone.querySelector(".left_arm").innerHTML = partsImage('Arm', mech.left_arm);
        clone.querySelector(".right_arm").innerHTML = partsImage('Arm', mech.right_arm);
    
        mixedmechNoAfterglowContainer.appendChild(clone);
      })
      document.querySelector("#noafterglow_count").innerHTML = '('+mixedMechsNoAfterglow.length+')';
}

function buildPartialMechTable(mixedMechsPartial){
    if(mixedMechsPartial.length == 0){
        const clone = templateEmpty.content.cloneNode(true);
        mixedmechPartialContainer.appendChild(clone);
    }
    mixedMechsPartial.forEach((mech)=>{
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
    })
    let mixedPartialTotal = mixedMechsPartial.length;
    document.querySelector("#partial_count").innerHTML = '('+mixedPartialTotal+')';
}

function buildRemainingPartsTable(){
    let remainingCount = 0;
    rarityOrder.forEach((model)=>{
        if(dataModel.remainingParts[model]){
            Object.keys(dataModel.remainingParts[model]).forEach((part)=>{
            if(dataModel.remainingParts[model][part] > 0){
                const clone = templateRemainingMech.content.cloneNode(true);

                clone.querySelector(".image").innerHTML = partsImage(part, model);
                clone.querySelector(".part").textContent = part;
                clone.querySelector(".model").textContent = model;
                clone.querySelector(".count").textContent = dataModel.remainingParts[model][part];
                remainingContainer.appendChild(clone);
                remainingCount += dataModel.remainingParts[model][part];
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