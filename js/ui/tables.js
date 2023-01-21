function buildPartsTable(){
    let partCount = 0;
    // All Parts
    dataModel.walletParts.forEach((part)=>{
        if(part.count > 0){
            // Build Table
            const clone = template.content.cloneNode(true);
            if(dataModel.useStyles){
                clone.querySelector(".image").innerHTML = partsRevealedImage(part.part, part.model, part.style);
            } else {
                clone.querySelector(".image").innerHTML = partsImage(part.part, part.model);
            }
            
            clone.querySelector(".part").textContent = part.part;
            clone.querySelector(".model").textContent = part.model;
            if(dataModel.useStyles){
                clone.querySelector(".style").textContent = part.style;
            }
            clone.querySelector(".count").textContent = part.count;// + ' of ' + totalParts[part.model][part.part];
            accountContainer.appendChild(clone);
            partCount++;
        }
    });


    dataModel.walletParts.sort((a, b) => {
        return a.count - b.count;
    })

    dataModel.walletParts.forEach((part)=>{
        if(part.count == 0){
            // Build Table
            const clone = template.content.cloneNode(true);
            if(dataModel.useStyles){
                clone.querySelector(".image").innerHTML = partsRevealedImage(part.part, part.model, part.style);
            } else {
                clone.querySelector(".image").innerHTML = partsImage(part.part, part.model);
            }
            clone.querySelector(".part").textContent = part.part;
            clone.querySelector(".model").textContent = part.model;
            if(dataModel.useStyles){
                clone.querySelector(".style").textContent = part.style;
            }
            clone.querySelector(".count").textContent = part.count;// + ' of ' + totalParts[part.model][part.part];
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
        let brokerURL = 'https://github.com/CarTarL/CyberBrokers-assets/raw/main/nfts/png-card/cb-'+pad(broker.tokenId, 5)+'.png';
        clone.querySelector(".image").innerHTML = '<div><img src="'+brokerURL+'" /></div><div>'+broker.uri.name+'</div';
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
    dataModel.walletAfterglows.forEach((afterglow)=>{
        if(afterglow.count > 0){
            // Build Table
            const clone = templateAfterglow.content.cloneNode(true);
            clone.querySelector(".image").innerHTML = afterglowImageUrl(afterglow.name == 'Lost-in-the-Crowd Orange' ? 'Lost-in-the-crowd Orange' : afterglow.name);
            clone.querySelector(".name").textContent = afterglow.name;
            clone.querySelector(".count").textContent = afterglow.count + ' of ' + afterglow.total;
            afterglowContainer.appendChild(clone);
            afterglowCount++;
        }
    });
    // All Afterglows
    dataModel.walletAfterglows.sort((a, b) => {
        return a.count - b.count;
    })
    // dataModel.walletAfterglows.forEach((afterglow)=>{
    //     if(afterglow.count == 0){
    //         // Build Table
    //         const clone = templateAfterglow.content.cloneNode(true);
    //         clone.querySelector(".image").innerHTML = afterglowImageUrl(afterglow.name == 'Lost-in-the-Crowd Orange' ? 'Lost-in-the-crowd Orange' : afterglow.name);
    //         clone.querySelector(".name").textContent = afterglow.name;
    //         clone.querySelector(".count").textContent = afterglow.count + ' of ' + afterglow.total;
    //         afterglowContainer.appendChild(clone);
    //         afterglowCount++;
    //     }
    // });

    if(afterglowCount == 0){
        const clone = templateEmpty.content.cloneNode(true);
        afterglowContainer.appendChild(clone);
    }
}

function buildFullMechTable(fullMechs){
    if(dataModel.useStyles){
        document.getElementById('full_style').display = 'none';
    }
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
        if(dataModel.useStyles){
            clone.querySelector(".style").display = 'none';
        }
        clone.querySelector(".count").textContent = countOfMechs;// + ' of ' + totalFullMechs[model];

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
        clone.querySelector(".count").textContent = modelCounts[model];// + ' of ' + totalMixedMechs[model];
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

function buildFullMechStylesTable(fullMechs){
    if(dataModel.useStyles){
        document.getElementById('full_style').display = 'block';
    }
    let count = 0;
    RARITY_ORDER.forEach((model)=>{
        let order = [].concat(STYLE_ORDER[model]);
        order = order.reverse();
        order.forEach((style)=>{
            if(fullMechs[model] && fullMechs[model][style]){
                let fullModelMechs = fullMechs[model][style];
                // Build Table
                let allowedDismantle = 'disabled';
                let allowedAssemble = dataModel.dismantled[model] > 0 ? '' : 'disabled';
                let countOfMechs = 0;
                if(fullModelMechs){
                    allowedDismantle = fullModelMechs.length > 0 ? '' : 'disabled';
                    countOfMechs = fullModelMechs.length;
                }
                const clone = templateFull.content.cloneNode(true);
                clone.querySelector(".image").innerHTML = fullRevealedImage(style);
                // clone.querySelector(".image").classList.add(style);
                clone.querySelector(".model").textContent = model;
                clone.querySelector(".style").display = 'block';
                clone.querySelector(".style").textContent = style;
                clone.querySelector(".count").textContent = countOfMechs;

                // clone.querySelector(".dismantle").innerHTML = `<div style="text-align: center;">
                //     <button class="btn btn-dismantle${allowedDismantle}" id="btn-query" onclick="dismantle('${model}')" ${allowedDismantle}>-</button>
                //     <button class="btn btn-assemble${allowedAssemble}" id="btn-query" onclick="assemble('${model}')" ${allowedAssemble}>+</button>
                // </div>`;
                fullContainer.appendChild(clone);
                count += countOfMechs;
            }
        });
    })

    if(count == 0){
        const clone = templateEmpty.content.cloneNode(true);
        fullContainer.appendChild(clone);
    }
    document.querySelector("#full_count").innerHTML = '('+count+')';
}

function buildPartialMechStylesTable(mixedMechsPartial){
    let count = 0;
    RARITY_ORDER.forEach((model)=>{
        let order = [].concat(STYLE_ORDER[model]);
        order = order.reverse();
        order.forEach((style)=>{
            if(mixedMechsPartial[model]){
                mixedMechsPartial[model].forEach((mech)=>{
                    if(mech.Engine.style == style){
                        const clone = templateMixedMech.content.cloneNode(true);

                        if(mech.Engine){
                            clone.querySelector(".engine").innerHTML = partsRevealedImage('Engine', mech.Engine.model, mech.Engine.style);
                        }else{
                            clone.querySelector(".engine").innerHTML = partsRevealedImageMissing('Engine', mech.Engine.model, mech.Engine.style);
                        }

                        if(mech.Head){
                            clone.querySelector(".head").innerHTML = partsRevealedImage('Head', mech.Head.model, mech.Head.style);
                        }else{
                            clone.querySelector(".head").innerHTML = partsRevealedImageMissing('Head', mech.Engine.model, mech.Engine.style);
                        }

                        if(mech.Body){
                            clone.querySelector(".body").innerHTML = partsRevealedImage('Body', mech.Body.model, mech.Body.style);
                        }else{
                            clone.querySelector(".body").innerHTML = partsRevealedImageMissing('Body', mech.Engine.model, mech.Engine.style);
                        }

                        if(mech.Leg){
                            clone.querySelector(".legs").innerHTML = partsRevealedImage('Leg', mech.Leg.model, mech.Leg.style);
                        }else{
                            clone.querySelector(".legs").innerHTML = partsRevealedImageMissing('Leg', mech.Engine.model, mech.Engine.style);
                        }

                        if(mech.left_arm){
                            clone.querySelector(".left_arm").innerHTML = partsRevealedImage('Arm', mech.left_arm.model, mech.left_arm.style);
                        }else{
                            clone.querySelector(".left_arm").innerHTML = partsRevealedImageMissing('Arm', mech.Engine.model, mech.Engine.style);
                        }

                        if(mech.right_arm){
                            clone.querySelector(".right_arm").innerHTML = partsRevealedImage('Arm', mech.right_arm.model, mech.right_arm.style);
                        }else{
                            clone.querySelector(".right_arm").innerHTML = partsRevealedImageMissing('Arm', mech.Engine.model, mech.Engine.style);
                        }
                        mixedmechPartialContainer.appendChild(clone);
                        count++;
                    }
                })
            }
        });
    });

    if(count == 0){
        const clone = templateEmpty.content.cloneNode(true);
        mixedmechPartialContainer.appendChild(clone);
    }
    document.querySelector("#partial_count").innerHTML = '('+count+')';
}

function buildPartsStylesTable(address){
    let partCount = 0;
    // All Parts

    RARITY_ORDER.forEach((model)=>{
        PARTS_ORDER.forEach((part)=>{
            STYLE_ORDER[model].forEach((style)=>{
                if(dataModel.modelParts[model] && dataModel.modelParts[model][part] && dataModel.modelParts[model][part][style] && dataModel.modelParts[model][part][style] > 0){
                    // Build Table
                    const clone = template.content.cloneNode(true);
                    if(dataModel.useStyles){
                        clone.querySelector(".image").innerHTML = ownerPartsRevealedImage(address, part, model, style);
                    } else {
                        clone.querySelector(".image").innerHTML = partsImage(part, model);
                    }
                    
                    clone.querySelector(".part").textContent = part;
                    clone.querySelector(".model").textContent = model;
                    if(dataModel.useStyles){
                        clone.querySelector(".style").textContent = style;
                    }
                    clone.querySelector(".count").textContent = dataModel.modelParts[model][part][style];// + ' of ' + totalParts[part.model][part.part];
                    accountContainer.appendChild(clone);
                    partCount+=dataModel.modelParts[model][part][style];
                }
            });
        });
    });


    dataModel.walletParts.sort((a, b) => {
        return a.count - b.count;
    })

    RARITY_ORDER.forEach((model)=>{
        PARTS_ORDER.forEach((part)=>{
            STYLE_ORDER[model].forEach((style)=>{
                if(dataModel.modelParts[model] && dataModel.modelParts[model][part] && dataModel.modelParts[model][part][style] && dataModel.modelParts[model][part][style] == 0){
                    // Build Table
                    const clone = template.content.cloneNode(true);
                    if(dataModel.useStyles){
                        clone.querySelector(".image").innerHTML = partsRevealedImage(part, model, style);
                    } else {
                        clone.querySelector(".image").innerHTML = partsImage(part, model);
                    }
                    clone.querySelector(".part").textContent = part;
                    clone.querySelector(".model").textContent = model;
                    if(dataModel.useStyles){
                        clone.querySelector(".style").textContent = style;
                    }
                    clone.querySelector(".count").textContent = dataModel.modelParts[model][part][style];// + ' of ' + totalParts[part.model][part.part];
                    accountContainer.appendChild(clone);
                }
            });
        });
    });

    if(partCount == 0){
        const clone = templateEmpty.content.cloneNode(true);
        accountContainer.appendChild(clone);
    }
}

function buildRemainingPartsStylesTable(address){
    let remainingCount = 0;
    RARITY_ORDER.forEach((model)=>{
        if(dataModel.modelParts[model]){
            STYLE_ORDER[model].forEach((style)=>{
                Object.keys(dataModel.modelParts[model]).forEach((part)=>{
                    if(dataModel.modelParts[model][part][style] > 0){
                        const clone = templateRemainingMech.content.cloneNode(true);

                        clone.querySelector(".image").innerHTML = ownerPartsRevealedImage(address, part, model, style);
                        clone.querySelector(".model").textContent = model;
                        clone.querySelector(".part").textContent = part;
                        clone.querySelector(".style").textContent = style;
                        clone.querySelector(".count").textContent = dataModel.modelParts[model][part][style];
                        remainingContainer.appendChild(clone);
                        remainingCount += dataModel.modelParts[model][part][style];
                    }
                });
            });
        }
    });

    if(remainingCount == 0){
        const clone = templateEmpty.content.cloneNode(true);
        remainingContainer.appendChild(clone);
    }
    document.querySelector("#remaining_count").innerHTML = '('+remainingCount+')';
}

function buildMixedModelMechsStylesSummaryTable(mixedMechs){
    let totalMixed = 0;
    let modelCounts = {};
    // Count the mixed mechs for each models
    RARITY_ORDER.forEach((model)=>{
        STYLE_ORDER[model].forEach((style)=>{
            if(mixedMechs[model]){
                mixedMechs[model].forEach((mech)=>{
                    if(mech['Engine'] && mech['Engine'].model == model && mech['Engine'].style == style && Object.keys(mech).length == 6){
                        if(!modelCounts[model]){
                            modelCounts[model] = {};
                        }
                        if(!modelCounts[model][style]){
                            modelCounts[model][style] = 0;
                        }
                        modelCounts[model][style]++;
                        totalMixed++;
                    }
                })
            }
        });
    });
    Object.keys(modelCounts).forEach((model)=>{
        Object.keys(modelCounts[model]).forEach((style)=>{
            const clone = templateMixed.content.cloneNode(true);
            clone.querySelector(".image").innerHTML = fullRevealedImage(style);
            clone.querySelector(".model").textContent = model;
            clone.querySelector(".style").textContent = style;
            clone.querySelector(".count").textContent = modelCounts[model][style];// + ' of ' + totalMixedMechs[model];
            mixedContainer.appendChild(clone);
        });
    })
    if(totalMixed == 0){
        const clone = templateEmpty.content.cloneNode(true);
        mixedContainer.appendChild(clone);
    }
    document.querySelector("#mixed_count").innerHTML = '('+totalMixed+')';
}

function buildPartialMechNoModelStylesTable(mixedMechsPartial){
    let count = 0;
    RARITY_ORDER.forEach((model)=>{
        if(mixedMechsPartial[model]){
            mixedMechsPartial[model].forEach((mech)=>{
                const clone = templateMixedMech.content.cloneNode(true);
                let model = getMostMatchingParts(mech);

                let model2 = '';
                let style2 = '';
                if(mech.Head){
                    model2 = mech.Head.model;
                    style2 = mech.Head.style;
                } else if (mech.Body) {
                    model2 = mech.Body.model;
                    style2 = mech.Body.style;
                } else if (mech.Leg) {
                    model2 = mech.Leg.model;
                    style2 = mech.Leg.style;
                } else if (mech.left_arm) {
                    model2 = mech.left_arm.model;
                    style2 = mech.left_arm.style;
                } else if (mech.right_arm) {
                    model2 = mech.right_arm.model;
                    style2 = mech.right_arm.style;
                }
                if(mech.Engine){
                    clone.querySelector(".engine").innerHTML = partsRevealedImage('Engine', mech.Engine.model, mech.Engine.style);
                }else{
                    clone.querySelector(".engine").innerHTML = partsRevealedImageMissing('Engine', model2, style2);
                }

                if(mech.Head){
                    clone.querySelector(".head").innerHTML = partsRevealedImage('Head', mech.Head.model, mech.Head.style);
                }else{
                    clone.querySelector(".head").innerHTML = partsRevealedImageMissing('Head', model2, style2);
                }

                if(mech.Body){
                    clone.querySelector(".body").innerHTML = partsRevealedImage('Body', mech.Body.model, mech.Body.style);
                }else{
                    clone.querySelector(".body").innerHTML = partsRevealedImageMissing('Body',model2, style2);
                }

                if(mech.Leg){
                    clone.querySelector(".legs").innerHTML = partsRevealedImage('Leg', mech.Leg.model, mech.Leg.style);
                }else{
                    clone.querySelector(".legs").innerHTML = partsRevealedImageMissing('Leg', model2, style2);
                }

                if(mech.left_arm){
                    clone.querySelector(".left_arm").innerHTML = partsRevealedImage('Arm', mech.left_arm.model, mech.left_arm.style);
                }else{
                    clone.querySelector(".left_arm").innerHTML = partsRevealedImageMissing('Arm', model2, style2);
                }

                if(mech.right_arm){
                    clone.querySelector(".right_arm").innerHTML = partsRevealedImage('Arm', mech.right_arm.model, mech.right_arm.style);
                }else{
                    clone.querySelector(".right_arm").innerHTML = partsRevealedImageMissing('Arm', model2, style2);
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

function buildMechStats(model, container){
    if(dataModel.modelParts[model]){
        let fullTotal = 0;
        STYLE_ORDER[model].forEach((style)=>{
            const clone = templateMechStats.content.cloneNode(true);
            clone.querySelector(".model").textContent = model;
            clone.querySelector(".style").textContent = style;
            let engine = (dataModel.modelParts[model] && dataModel.modelParts[model]['Engine'] && dataModel.modelParts[model]['Engine'][style]) ? dataModel.modelParts[model]['Engine'][style] : 0;
            clone.querySelector(".Engine").textContent = engine;
            let head = (dataModel.modelParts[model] && dataModel.modelParts[model]['Head'] && dataModel.modelParts[model]['Head'][style]) ? dataModel.modelParts[model]['Head'][style] : 0;
            clone.querySelector(".Head").textContent = head;
            let body = (dataModel.modelParts[model] && dataModel.modelParts[model]['Body'] && dataModel.modelParts[model]['Body'][style]) ? dataModel.modelParts[model]['Body'][style] : 0;
            clone.querySelector(".Body").textContent = body;
            let arm = (dataModel.modelParts[model] && dataModel.modelParts[model]['Arm'] && dataModel.modelParts[model]['Arm'][style]) ? dataModel.modelParts[model]['Arm'][style] : 0;
            clone.querySelector(".Arm").textContent = arm;
            let leg = (dataModel.modelParts[model] && dataModel.modelParts[model]['Leg'] && dataModel.modelParts[model]['Leg'][style]) ? dataModel.modelParts[model]['Leg'][style] : 0;
            clone.querySelector(".Leg").textContent = leg;

            let total = engine + head + body + arm + leg;
            clone.querySelector(".count").textContent = total;
            container.appendChild(clone);
        });

        const clone = templateMechStats.content.cloneNode(true);
        clone.querySelector(".model").textContent = 'Total';
        clone.querySelector(".style").textContent = '';
        PARTS_ORDER.forEach((part)=>{
            let count = 0;
            STYLE_ORDER[model].forEach((style)=>{
                count += (dataModel.modelParts[model] && dataModel.modelParts[model][part] && dataModel.modelParts[model][part][style]) ? dataModel.modelParts[model][part][style] : 0;
            });
            clone.querySelector("."+part+"").textContent = count;
            fullTotal += count;
        })
        document.querySelector("#"+model+"_count").innerHTML = '('+fullTotal+')';
        clone.querySelector(".count").textContent = fullTotal;
        container.appendChild(clone);
    }
}