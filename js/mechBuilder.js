function buildFullMechs(){
    let fullMechs = {};
    RARITY_ORDER.forEach((model)=>{
        let min = 99999;
        // Find the lowest count part - taking arms in 2s
        PARTS_ORDER.forEach((part)=>{
            let count = parseInt(dataModel.modelParts[model][part]);
            if(part == 'Arm'){
                count = Math.floor(count/2);
            }
            if(count < min){
                min = count;
            }
        });
        for(let i=0; i<min-dataModel.dismantled[model]; i++){
            if(dataModel.remainingAfterglows > 0){
                let fullMech = {
                    Engine: model,
                    Head: model,
                    Body: model,
                    Legs: model,
                    left_arm: model,
                    right_arm: model
                }
                if(!fullMechs[model]){
                    fullMechs[model] = [];
                }
                // Remove the parts from the inventory
                Object.keys(dataModel.modelParts[model]).forEach((part)=>{
                    if(part == 'Arm'){
                        dataModel.modelParts[model][part]-=2;
                    }else {
                        dataModel.modelParts[model][part]--;
                    }
                });
                fullMechs[model].push(fullMech);
                dataModel.remainingAfterglows--;
            }
        }
    })
    return fullMechs;
}

function buildFullModelMechStyles(){
    let fullMechs = {};
    RARITY_ORDER.forEach((model)=>{
        STYLE_ORDER.forEach((style)=>{
            let min = 99999;
            // Find the lowest count part - taking arms in 2s
            PARTS_ORDER.forEach((part)=>{
                if(dataModel.modelParts[model][part][style]){
                    let count = parseInt(dataModel.modelParts[model][part][style]);
                    if(part == 'Arm'){
                        count = Math.floor(count/2);
                    }
                    if(count < min){
                        min = count;
                    }
                }
            });
            for(let i=0; i<min-dataModel.dismantled[model]; i++){
                if(dataModel.remainingAfterglows > 0){
                    let fullMech = {
                        Engine: {
                            model,
                            style
                        },
                        Head: {
                            model,
                            style
                        },
                        Body: {
                            model,
                            style
                        },
                        Legs: {
                            model,
                            style
                        },
                        left_arm: {
                            model,
                            style
                        },
                        right_arm: {
                            model,
                            style
                        }
                    }
                    if(!fullMechs[model]){
                        fullMechs[model] = {};
                    }
                    if(!fullMechs[model][style]){
                        fullMechs[model][style] = [];
                    }
                    // Remove the parts from the inventory
                    Object.keys(dataModel.modelParts[model]).forEach((part)=>{
                        if(part == 'Arm'){
                            dataModel.modelParts[model][part][style]-=2;
                        }else {
                            dataModel.modelParts[model][part][style]--;
                        }
                    });
                    fullMechs[model][style].push(fullMech);
                    dataModel.remainingAfterglows--;
                }
            }
        });
    })
    return fullMechs;
}

function buildMixedMechs(afterglowRequired, allowPartial){
    let mixedMechs = {};
    RARITY_ORDER.forEach((model)=>{
        let engineCount = dataModel.modelParts[model]['Engine'];
        for(let i=0; i< engineCount; i++){
            let tempRemainingParts = JSON.parse(JSON.stringify(dataModel.modelParts));
            let partOne = '';
            let partTwo = '';
            let remainingParts = Object.keys(tempRemainingParts[model]);

            remainingParts = changePartOrderBasedOnAvailability(model, remainingParts);
            remainingParts.forEach((part)=>{
                if(part != 'Engine'){
                    if(partOne == '' && tempRemainingParts[model][part] > 0){
                        partOne = part;
                        if(part == 'Arm' && tempRemainingParts[model][part] > 1){
                            partTwo = part;
                        }
                    } else if(partTwo == ''  && tempRemainingParts[model][part] > 0){
                        partTwo = part;
                    }
                }
            })

            // Engine + 2 part available
            if(partOne != '' && partTwo != ''){
                let mech = [
                    {
                        model: model,
                        part: partOne
                    },
                    {
                        model: model,
                        part: partTwo
                    }
                ];
                
                let mixedMech = {};
                if(tempRemainingParts[model]['Engine'] > 0){
                    mixedMech['Engine'] = model;
                    tempRemainingParts[model]['Engine']--;
                }
                let remainingPartNames = ['Head', 'Body', 'Legs', 'Arm', 'Arm'];
                mech.forEach((modelPart)=>{
                    var index = remainingPartNames.indexOf(modelPart.part);
                    if (index !== -1) {
                        remainingPartNames.splice(index, 1);
                        if(modelPart.part == 'Arm' && !mixedMech['left_arm']){
                            if(tempRemainingParts[model]['Arm'] > 0){
                                mixedMech['left_arm'] = model;
                                tempRemainingParts[model]['Arm']--;
                            }
                        } else if(modelPart.part == 'Arm' && mixedMech['left_arm']){
                            if(tempRemainingParts[model]['Arm'] > 0){
                                mixedMech['right_arm'] = model;
                                tempRemainingParts[model]['Arm']--;
                            }
                        } else if(modelPart.part != 'Arm'){
                            if(tempRemainingParts[model][modelPart.part] > 0){
                                mixedMech[modelPart.part] = model;
                                tempRemainingParts[model][modelPart.part]--;
                            }
                        }
                    }
                })
                for(let j=0; j < remainingPartNames.length; j++){
                    let part = remainingPartNames[j];
                    let orderRarityOrder = changeRarityOrderBasedOnModel(model);
                    // Remove part from inventory
                    for(let i=0; i < orderRarityOrder.length; i++){
                        let model2 = orderRarityOrder[i];
                        if(tempRemainingParts[model2][part] > 0){
                            // Still need a left arm
                            if(part == 'Arm' && !mixedMech['left_arm']){
                                mixedMech['left_arm'] = model2;
                                tempRemainingParts[model2][part]--;
                                break;
                            }
                            // already got the left arm
                            else if(part == 'Arm' && mixedMech['left_arm']){
                                mixedMech['right_arm'] = model2;
                                tempRemainingParts[model2][part]--;
                                break;
                            }
                            // Not an arm
                            else if(part != 'Arm') {
                                mixedMech[part] = model2;
                                tempRemainingParts[model2][part]--;
                                break;
                            }
                        }
                    }
                }
                if( (allowPartial && isPartialMech(mixedMech))
                    || (!allowPartial && isFullMech(mixedMech))){
                    if(!afterglowRequired || (afterglowRequired && dataModel.remainingAfterglows > 0) ){
                        if(!mixedMechs[model]){
                            mixedMechs[model] = [];
                        }
                        mixedMechs[model].push(mixedMech);
                        dataModel.modelParts = tempRemainingParts;

                        if(afterglowRequired){
                            dataModel.remainingAfterglows--;
                        }
                    }
                }
            }
        }
    })
    return mixedMechs;
}

function isFullMech(mech){
    return mech.Head && mech.Body
        && mech.Legs && mech.left_arm
        && mech.right_arm && mech.Engine;
}

function isPartialMech(mech){
    return !mech.Head || !mech.Body
        || !mech.Legs || !mech.left_arm
        || !mech.right_arm || !mech.Engine
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

function changePartOrderBasedOnAvailability(modelType, remainingParts){
    let otherPartCountMax = {};
    remainingParts.forEach((part)=>{
        let isOnlyModelPart = false;
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

function getSortedKeys(obj) {
    var keys = Object.keys(obj);
    return keys.sort(function(a,b){return obj[a]-obj[b]});
}
