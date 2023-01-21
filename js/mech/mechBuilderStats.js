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

function countMechParts(mech){
    return Object.keys(mech).length;
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

function buildFullModelMechStyles(address){
    let fullMechs = {};
    RARITY_ORDER.forEach((model)=>{
        STYLE_ORDER[model].forEach((style)=>{
            let min = 99999;
            // Find the lowest count part - taking arms in 2s
            PARTS_ORDER.forEach((part)=>{
                if(dataModel.owners[address].modelParts[model] && dataModel.owners[address].modelParts[model][part] && dataModel.owners[address].modelParts[model][part][style]){
                    let count = parseInt(dataModel.owners[address].modelParts[model][part][style]);
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
                for(let i=0; i<min; i++){
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
                    Object.keys(dataModel.owners[address].modelParts[model]).forEach((part)=>{
                        if(part == 'Arm'){
                            dataModel.owners[address].modelParts[model][part][style]-=2;
                        }else {
                            dataModel.owners[address].modelParts[model][part][style]--;
                        }
                    });
                    fullMechs[model][style].push(fullMech);
                    // dataModel.owners[address].remainingAfterglows--;
                }
            }
        });
    })
    return fullMechs;
}

function buildMixedMechsStyles(address, afterglowRequired, allowPartial, allowNoModel){
    let mixedMechs = {};
    RARITY_ORDER.forEach((model)=>{
        STYLE_ORDER[model].forEach((style)=>{
            if(dataModel.owners[address].modelParts[model] && dataModel.owners[address].modelParts[model]['Engine'] && dataModel.owners[address].modelParts[model]['Engine'][style]){
                let partCount = dataModel.owners[address].modelParts[model]['Engine'][style];
                for(let i=0; i< partCount; i++){
                    let tempRemainingParts = JSON.parse(JSON.stringify(dataModel.owners[address].modelParts));
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
                                // if(!afterglowRequired){
                                    if(!mixedMechs[model]){
                                        mixedMechs[model] = [];
                                    }
                                    mixedMechs[model].push(mixedMech);
                                    dataModel.owners[address].modelParts = tempRemainingParts;

                                    // if(afterglowRequired){
                                    //     dataModel.owners[address].remainingAfterglows--;
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

function sortByLowestCountFirstAddress(model, address){
    let totalParts = {};
    let newOrder = [].concat(STYLE_ORDER[model]);
    newOrder.forEach((style)=>{
        PARTS_ORDER.forEach((part)=>{
            if(!totalParts[style]){
                totalParts[style] = 0;
            }
            totalParts[style] += (dataModel.owners[address].modelParts[model][part] && dataModel.owners[address].modelParts[model][part][style] ? dataModel.owners[address].modelParts[model][part][style] : 0)
        });
    });
    newOrder.sort(function(styleA, styleB){  
        return totalParts[styleA] - totalParts[styleB];
    });
    return newOrder;
}

function buildNoModelMixedMechsStyles(address, afterglowRequired, allowPartial, allowNoModel){
    let mixedMechs = {};
    RARITY_ORDER.forEach((model)=>{
        let order = sortByHighestCountFirstAddress(model, address);
        order.forEach((style)=>{
            if(dataModel.owners[address].modelParts[model]){
                let partCount = 0;
                if(allowNoModel){
                    partCount = getMostPartsStyles(dataModel.owners[address].modelParts[model]);
                } else {
                    if(dataModel.owners[address].modelParts[model]['Engine'] && dataModel.owners[address].modelParts[model]['Engine'][style]){
                        partCount = dataModel.owners[address].modelParts[model]['Engine'][style];
                    }
                }
                for(let i=0; i< partCount; i++){
                    let tempRemainingParts = JSON.parse(JSON.stringify(dataModel.owners[address].modelParts));
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

                                let order = sortByLowestCountFirstAddress(model, address);

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
                                // if(!afterglowRequired){
                                    if(!mixedMechs[model]){
                                        mixedMechs[model] = [];
                                    }
                                    mixedMechs[model].push(mixedMech);
                                    dataModel.owners[address].modelParts = tempRemainingParts;

                                    // if(afterglowRequired){
                                    //     dataModel.owners[address].remainingAfterglows--;
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