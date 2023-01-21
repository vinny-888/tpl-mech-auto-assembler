function getMostPartsStyles(mech){
    let max = 0;
    Object.keys(mech).forEach((part)=>{
        Object.keys(mech[part]).forEach((style)=>{
            if(mech[part][style] > max){
                max = mech[part][style];
            }
        });
    })
    return max;
}

function buildFullModelMechStyles(){
    let fullMechs = {};
    RARITY_ORDER.forEach((model)=>{
        STYLE_ORDER[model].forEach((style)=>{
            let min = 99999;
            // Find the lowest count part - taking arms in 2s
            PARTS_ORDER.forEach((part)=>{
                if(dataModel.modelParts[model] && dataModel.modelParts[model][part] && dataModel.modelParts[model][part][style]){
                    let count = parseInt(dataModel.modelParts[model][part][style]);
                    if(!isNaN(count)){
                        if(part == 'Arm'){
                            count = Math.floor(count/2);
                        }
                        if(count < min){
                            min = count;
                        }
                    } else {
                        min = 0;
                    }
                } else {
                    min = 0;
                }
            });
            if(min != 99999){
                for(let i=0; i<min-dataModel.dismantled[model]; i++){
                    // if(dataModel.remainingAfterglows > 0){
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
                        // dataModel.remainingAfterglows--;
                    // }
                }
            }
        });
    })
    return fullMechs;
}

function buildMixedMechsStyles(afterglowRequired, allowPartial, allowNoModel){
    let mixedMechs = {};
    RARITY_ORDER.forEach((model)=>{
        STYLE_ORDER[model].forEach((style)=>{
            if(dataModel.modelParts[model] && dataModel.modelParts[model]['Engine'] && dataModel.modelParts[model]['Engine'][style]){
                let partCount = dataModel.modelParts[model]['Engine'][style];
                for(let i=0; i< partCount; i++){
                    let tempRemainingParts = JSON.parse(JSON.stringify(dataModel.modelParts));
                    let partOne = '';
                    let partTwo = '';
                    let remainingParts = Object.keys(tempRemainingParts[model]);

                    remainingParts = changePartOrderBasedOnAvailability(model, remainingParts);
                    remainingParts.forEach((part)=>{
                        if((part != 'Engine' || allowNoModel) && (tempRemainingParts[model] && tempRemainingParts[model][part] && tempRemainingParts[model][part][style])){
                            if(partOne == '' && tempRemainingParts[model][part][style] > 0){
                                partOne = part;
                                if(part == 'Arm' && tempRemainingParts[model][part][style] > 1){
                                    partTwo = part;
                                }
                            } else if(partTwo == ''  && tempRemainingParts[model][part][style] > 0){
                                partTwo = part;
                            }
                        }
                    })

                    // Engine + 2 part available
                    if(allowNoModel || (partOne != '' && partTwo != '')){
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
                        if(tempRemainingParts[model]['Engine'][style] > 0){
                            mixedMech['Engine'] = {
                                model,
                                style
                            };
                            tempRemainingParts[model]['Engine'][style]--;
                        }
                        let remainingPartNames = ['Head', 'Body', 'Leg', 'Arm', 'Arm'];
                        mech.forEach((modelPart)=>{
                            var index = remainingPartNames.indexOf(modelPart.part);
                            if (index !== -1) {
                                remainingPartNames.splice(index, 1);
                                if(modelPart.part == 'Arm' && !mixedMech['left_arm']){
                                    if(tempRemainingParts[model]['Arm'][style] > 0){
                                        mixedMech['left_arm'] = {
                                            model,
                                            style
                                        };
                                        tempRemainingParts[model]['Arm'][style]--;
                                    }
                                } else if(modelPart.part == 'Arm' && mixedMech['left_arm']){
                                    if(tempRemainingParts[model]['Arm'][style] > 0){
                                        mixedMech['right_arm'] = {
                                            model,
                                            style
                                        };
                                        tempRemainingParts[model]['Arm'][style]--;
                                    }
                                } else if(modelPart.part != 'Arm'){
                                    if(tempRemainingParts[model][modelPart.part][style] > 0){
                                        mixedMech[modelPart.part] = {
                                            model,
                                            style
                                        };
                                        tempRemainingParts[model][modelPart.part][style]--;
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
                                if(tempRemainingParts[model2] && tempRemainingParts[model2][part] && tempRemainingParts[model2][part][style] && tempRemainingParts[model2][part][style] > 0){
                                    // Still need a left arm
                                    if(part == 'Arm' && !mixedMech['left_arm']){
                                        mixedMech['left_arm'] = {
                                            model: model2,
                                            style
                                        };
                                        tempRemainingParts[model2][part][style]--;
                                        break;
                                    }
                                    // already got the left arm
                                    else if(part == 'Arm' && mixedMech['left_arm']){
                                        mixedMech['right_arm'] = {
                                            model: model2,
                                            style
                                        };
                                        tempRemainingParts[model2][part][style]--;
                                        break;
                                    }
                                    // Not an arm
                                    else if(part != 'Arm') {
                                        mixedMech[part] = {
                                            model: model2,
                                            style
                                        };
                                        tempRemainingParts[model2][part][style]--;
                                        break;
                                    }
                                }
                            }
                        }
                        if(allowNoModel && !hasTwoMatchingParts(mixedMech, mixedMech.Engine.model) && isFullMech(mixedMech)){
                            tempRemainingParts[model]['Engine'][style]++;
                            delete mixedMech.Engine;
                        }
                        if(!allowNoModel || (allowNoModel && countMechParts(mixedMech) >= 2)){
                            if( (allowPartial && isPartialMech(mixedMech))
                                || (!allowPartial && isFullMech(mixedMech))){
                                // if(!afterglowRequired || (afterglowRequired && dataModel.remainingAfterglows > 0) ){
                                    if(!mixedMechs[model]){
                                        mixedMechs[model] = [];
                                    }
                                    mixedMechs[model].push(mixedMech);
                                    dataModel.modelParts = tempRemainingParts;

                                    if(afterglowRequired){
                                        dataModel.remainingAfterglows--;
                                    }
                                // }
                            }
                        }
                    }
                }
            }
        })
    })
    return mixedMechs;
}

function buildNoModelMixedMechsStyles(afterglowRequired, allowPartial, allowNoModel){
    let mixedMechs = {};
    RARITY_ORDER.forEach((model)=>{
        let order = sortByHighestCountFirst(model);
        order.forEach((style)=>{
            if(dataModel.modelParts[model]){
                let partCount = 0;
                if(allowNoModel){
                    partCount = getMostPartsStyles(dataModel.modelParts[model]);
                } else {
                    if(dataModel.modelParts[model]['Engine'] && dataModel.modelParts[model]['Engine'][style]){
                        partCount = dataModel.modelParts[model]['Engine'][style];
                    }
                }
                for(let i=0; i< partCount; i++){
                    let tempRemainingParts = JSON.parse(JSON.stringify(dataModel.modelParts));
                    let partOne = '';
                    let partTwo = '';
                    let remainingParts = Object.keys(tempRemainingParts[model]);

                    // remainingParts = changePartOrderBasedOnAvailability(model, remainingParts);
                    remainingParts.forEach((part)=>{
                        if((part != 'Engine' || allowNoModel) && (tempRemainingParts[model] && tempRemainingParts[model][part] && tempRemainingParts[model][part][style])){
                            if(partOne == '' && tempRemainingParts[model][part][style] > 0){
                                partOne = part;
                                if(part == 'Arm' && tempRemainingParts[model][part][style] > 1){
                                    partTwo = part;
                                }
                            } else if(partTwo == ''  && tempRemainingParts[model][part][style] > 0){
                                partTwo = part;
                            }
                        }
                    })

                    // Engine + 2 part available
                    if(allowNoModel || (partOne != '' && partTwo != '')){
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
                        let hasEngine = false;

                        if(tempRemainingParts[model] && tempRemainingParts[model]['Engine']){
                            Object.keys(tempRemainingParts[model]['Engine']).forEach((style2)=>{
                                if(!hasEngine && tempRemainingParts[model] && tempRemainingParts[model]['Engine'] && tempRemainingParts[model]['Engine'][style2] && tempRemainingParts[model]['Engine'][style2] > 0){
                                    mixedMech['Engine'] = {
                                        model,
                                        style: style2
                                    };
                                    tempRemainingParts[model]['Engine'][style2]--;
                                    hasEngine = true;
                                }
                            })
                        }
                        let remainingPartNames = ['Head', 'Body', 'Leg', 'Arm', 'Arm'];
                        mech.forEach((modelPart)=>{
                            var index = remainingPartNames.indexOf(modelPart.part);
                            if (index !== -1) {
                                remainingPartNames.splice(index, 1);
                                if(modelPart.part == 'Arm' && !mixedMech['left_arm']){
                                    if(tempRemainingParts[model]['Arm'][style] > 0){
                                        mixedMech['left_arm'] = {
                                            model,
                                            style
                                        };
                                        tempRemainingParts[model]['Arm'][style]--;
                                    }
                                } else if(modelPart.part == 'Arm' && mixedMech['left_arm']){
                                    if(tempRemainingParts[model]['Arm'][style] > 0){
                                        mixedMech['right_arm'] = {
                                            model,
                                            style
                                        };
                                        tempRemainingParts[model]['Arm'][style]--;
                                    }
                                } else if(modelPart.part != 'Arm'){
                                    if(tempRemainingParts[model][modelPart.part][style] > 0){
                                        mixedMech[modelPart.part] = {
                                            model,
                                            style
                                        };
                                        tempRemainingParts[model][modelPart.part][style]--;
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
                                // let order = [].concat(STYLE_ORDER[model]);
                                // // let newOrder = [];//sortByLowestCountFirst(order);

                                // order.sort(function(styleA, styleB){  
                                //     return (tempRemainingParts[model2][part] ? tempRemainingParts[model2][part][styleA] : 0) - (tempRemainingParts[model2][part] ? tempRemainingParts[model2][part][styleB] : tempRemainingParts[model2][part]);
                                // });

                                let order = sortByLowestCountFirst(model);

                                //STYLE_ORDER[model]
                                // order.splice(order.indexOf(style), 1);
                                // order.unshift(style);
                                order.forEach((style2)=>{
                                    let done = false;
                                    if(!done && tempRemainingParts[model2] && tempRemainingParts[model2][part] && tempRemainingParts[model2][part][style2] && tempRemainingParts[model2][part][style2] > 0){
                                        // Still need a left arm
                                        if(part == 'Arm' && !mixedMech['left_arm']){
                                            mixedMech['left_arm'] = {
                                                model: model2,
                                                style: style2
                                            };
                                            tempRemainingParts[model2][part][style2]--;
                                            done = true;
                                        }
                                        // already got the left arm
                                        else if(part == 'Arm' && mixedMech['left_arm']){
                                            mixedMech['right_arm'] = {
                                                model: model2,
                                                style: style2
                                            };
                                            tempRemainingParts[model2][part][style2]--;
                                            done = true;
                                        }
                                        // Not an arm
                                        else if(part != 'Arm') {
                                            mixedMech[part] = {
                                                model: model2,
                                                style: style2
                                            };
                                            tempRemainingParts[model2][part][style2]--;
                                            done = true;
                                        }
                                    }
                                });
                            }
                        }
                        // let hasTwoMatchingPartsBool = false;
                        // if(mixedMech.Engine){
                        //     hasTwoMatchingPartsBool = hasTwoMatchingParts(mixedMech, mixedMech.Engine.model)
                        // }
                        // if(allowNoModel && !hasTwoMatchingPartsBool){
                        //     tempRemainingParts[model]['Engine'][style]++;
                        //     delete mixedMech.Engine;
                        // }
                        if(!allowNoModel || (allowNoModel && countMechParts(mixedMech) >= 2)){
                            if( allowPartial ){ //&& isPartialMech(mixedMech))
                                // || (!allowPartial && isFullMech(mixedMech))){
                                // if(!afterglowRequired || (afterglowRequired && dataModel.remainingAfterglows > 0) ){
                                    if(!mixedMechs[model]){
                                        mixedMechs[model] = [];
                                    }
                                    mixedMechs[model].push(mixedMech);
                                    dataModel.modelParts = tempRemainingParts;

                                    // if(afterglowRequired){
                                    //     dataModel.remainingAfterglows--;
                                    // }
                                // }
                            }
                        }
                    }
                }
            }
        })
    })
    return mixedMechs;
}