function setEnable(id, isEnabled) {
    if (id == "brandsOne" && selectBox != null) {
        if (isEnabled) {
            selectBox.enable();
        } else {
            selectBox.disable();
        }

    } else if (id == "brandsMulti" && selectBox2 != null) {
        if (isEnabled) {
            selectBox2.enable();
        } else {
            selectBox2.disable();
        }
    }
}

function getValues(id) {
    let result = [];
    let collection = document.querySelectorAll("#" + id + " option");
    collection.forEach(function (x) {
        if (x.selected) {
            result.push(x.value);
        }
    });
    return result;
}

function getNestedValues(id) {
    let results = {};
    
    let optgroups = document.querySelectorAll("#" + id + " optgroup");
    for(let i=0; i<optgroups.length; i++){
        let group = optgroups[i].getAttribute('label');
        results[group] = [];
        let collection = optgroups[i].querySelectorAll("option");

        collection.forEach(function (x) {
            if (x.selected) {
                results[group].push(x.value);
            }
        });
    }
    return results;
}

function disableItems(id,value){
    if (id == "brandsOne" && selectBox != null) {
        selectBox.disableItems(value);
    } 
}

function enableItems(id,value){
    if (id == "brandsOne" && selectBox != null) {
        selectBox.enableItems(value);
    } 
}