function buildPartialMixedMechs(mixedModelMechCountParts, allowPartial){
    let mixedMechs = [];

    rarityOrder.forEach((model)=>{
        let tempRemainingParts = JSON.parse(JSON.stringify(dataModel.remainingParts));
        let baseParts = mixedModelMechCountParts[model];
        if(baseParts.length > 0){

        baseParts.forEach((mech)=>{
            let fullMech = {
                Engine: model
            };
            tempRemainingParts[model]['Engine']--;
            let remainingPartNames = ['Head', 'Body', 'Legs', 'Arm', 'Arm'];
            mech.forEach((modelPart)=>{
            var index = remainingPartNames.indexOf(modelPart.part);
            if (index !== -1) {
                remainingPartNames.splice(index, 1);
                if(modelPart.part == 'Arm' && !fullMech['left_arm']){
                    fullMech['left_arm'] = model;
                    tempRemainingParts[model]['Arm']--;
                } else if(modelPart.part == 'Arm' && fullMech['left_arm']){
                    fullMech['right_arm'] = model;
                    tempRemainingParts[model]['Arm']--;
                } else if(modelPart.part != 'Arm'){
                    fullMech[modelPart.part] = model;
                    tempRemainingParts[model][modelPart.part]--;
                }
            }
            })
            console.log('remainingPartNames:', remainingPartNames);
            for(let j=0; j < remainingPartNames.length; j++){
            let part = remainingPartNames[j];
            // Remove part from inventory
            for(let i=0; i < rarityOrder.length; i++){
                let model = rarityOrder[i];
                if(tempRemainingParts[model][part] > 0){
                    tempRemainingParts[model][part]--;
                    // Still need a left arm
                    if(part == 'Arm' && !fullMech['left_arm']){
                        fullMech['left_arm'] = model
                        break;
                    }
                    // already got the left arm
                    else if(part == 'Arm' && fullMech['left_arm']){
                        fullMech['right_arm'] = model;
                        break;
                    }
                    // Not an arm
                    else if(part != 'Arm') {
                        fullMech[part] = model;
                        break;
                    }
                    console.log('Using part: ', model + ' ' + part);
                }
            }
            }
            if((allowPartial && (!fullMech.Head || !fullMech.Body
            || !fullMech.Legs || !fullMech.left_arm
            || !fullMech.right_arm || !fullMech.Engine))
            || (!allowPartial && (fullMech.Head && fullMech.Body
                && fullMech.Legs && fullMech.left_arm
                && fullMech.right_arm && fullMech.Engine))){
                mixedMechs.push(fullMech);
                dataModel.remainingParts = tempRemainingParts;
            }
        });
        }
    });

    return mixedMechs;
}
  

function buildFullMixedMechs(){
    let totalMixed = 0;
    rarityOrder.forEach((model)=>{
        let fullMechParts = dataModel.fullModelMechs[model];
        let partCounts = {
            Arm: 0,
            Legs: 0,
            Head: 0,
            Body: 0,
            Engine: 0
        };
        Object.keys(fullMechParts).forEach((part)=>{
            let count = parseInt(fullMechParts[part]);
            if(part != 'Arm'){
                partCounts[part] = count - dataModel.fullModelMechCounts[model];
            } else {
                partCounts[part] = count - dataModel.fullModelMechCounts[model]*2;
            }
        });

        let engineCount = partCounts['Engine'];
        for(let i=0; i< engineCount; i++){
            let partOne = '';
            let partTwo = '';
            Object.keys(partCounts).forEach((part)=>{
                if(part != 'Engine'){
                if(partOne == '' && partCounts[part] > 0){
                    partOne = part;
                } else if(partTwo == ''  && partCounts[part] > 0){
                    if(partOne != part || (partOne == partTwo && partCounts[part] > 1)){
                    partTwo = part;
                    }
                }
                }
            })

            if(partOne != '' && partTwo != ''){
                if(!dataModel.mixedModelMechCountParts[model]){
                    dataModel.mixedModelMechCountParts[model] = [];
                }
                if(!dataModel.mixedModelMechCountPartsNoAfterglow[model]){
                    dataModel.mixedModelMechCountPartsNoAfterglow[model] = [];
                }
                partCounts[partOne]--;
                partCounts[partTwo]--;
                if(dataModel.remainingAfterglows == 0){
                    dataModel.mixedModelMechCountPartsNoAfterglow[model].push([
                        {
                            model: model,
                            part: partOne
                        },
                        {
                            model: model,
                            part: partTwo
                        },
                    ]);
                } else {
                    dataModel.mixedModelMechCounts[model]++;
                    dataModel.mixedModelMechCountParts[model].push([
                        {
                            model: model,
                            part: partOne
                        },
                        {
                            model: model,
                            part: partTwo
                        },
                    ]);
                    dataModel.remainingAfterglows--;
                }
            }
        }
        // Build Table
        if(dataModel.mixedModelMechCounts[model] > 0){
            const clone = templateMixed.content.cloneNode(true);
            clone.querySelector(".image").innerHTML = partsImage("Engine", model);
            clone.querySelector(".model").textContent = model;
            clone.querySelector(".count").textContent = dataModel.mixedModelMechCounts[model];
            mixedContainer.appendChild(clone);
        }

        totalMixed += dataModel.mixedModelMechCounts[model];
    })

    if(totalMixed == 0){
        const clone = templateEmpty.content.cloneNode(true);
        mixedContainer.appendChild(clone);
    }
}