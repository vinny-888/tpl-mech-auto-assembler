let pageSize = 100;
let loadedCount = 0;
let filteredData = data;
let selected = {};
let openState = {
    "layer-filters-face":1
};
const uniqueAttributes = (attr) => {
    return [...new Set(filteredData.map((item) => item[attr]))];
};

function toggle(elm){
    let el = document.getElementById(elm);
    el.style.display = el.style.display == 'none' ? 'block' : 'none';
    openState[elm] = el.style.display == 'none' ? 0 : 1;
}
function loadMore(){
    pageSize += 100;
    displayGallery();
}

const createFilterCheckboxes = (attribute, container) => {
    const values = uniqueAttributes(attribute);
    const filterContainer = document.getElementById(container);
    filterContainer.innerHTML = '';
    values.forEach((value) => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = value;
        checkbox.checked = selected[value] ? 'checked' : '';
        checkbox.addEventListener("change", applyFilters);
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' '+value));
        filterContainer.appendChild(label);
    });
};

const createFilterCheckboxes2 = (attribute, container, type) => {
    const values = uniqueAttributes(attribute);
    let filteredLayers = {};
    values.forEach((layers)=>{
        layers.forEach((layer)=>{
            filteredLayers[layer] = 1;
        })
    })
    const filterContainer = document.getElementById(container);
    filterContainer.innerHTML = '';
    let used = {};
    values.forEach((values) => {
        values.forEach((value)=>{
            let layer = layer_data.find((val)=>val.layerNum==value);
            let layerName = layer.traitValue != '' ? layer.traitValue : layer.tagText;
            let layerType = layer.layerType;
            if (!(value in used)){//} && (value in filteredLayers)) {
                used[value] = 1;
                if(type == layerType){
                    const label = document.createElement("label");
                    const checkbox = document.createElement("input");
                    const div0 = document.createElement("div");
                    const div1 = document.createElement("div");
                    const div2 = document.createElement("div");
                    const div3 = document.createElement("div");
                    div0.classList.add('card_div');
                    div1.classList.add('card_title');
                    div2.classList.add('card_row');
                    div3.classList.add('card_row');

                    // Top
                    div1.appendChild(document.createTextNode(' '+layerName));

                    // Middle
                    const image = document.createElement("img");
                    image.src = './layers/cb-layer-'+value.padStart(4, '0') +'.png';
                    image.classList.add('layer');
                    div2.appendChild(image);

                    // Bottom
                    checkbox.type = "checkbox";
                    checkbox.value = value;
                    checkbox.checked = selected[value] ? 'checked' : '';
                    checkbox.addEventListener("change", applyFilters);
                    div3.appendChild(checkbox);
                    
                    div0.appendChild(div1);
                    div0.appendChild(div2);
                    div0.appendChild(div3);
                    filterContainer.appendChild(div0);
                }
            }
        })
    });
};

const applyFilters = (evt) => {
    // debugger;
    selected[evt.currentTarget.value] = evt.currentTarget.checked == '' ? 0 : 1;
    pageSize = 100;
    loadedCount = 0;
    const talentFilters = document.querySelectorAll("#talent-filters input:checked");
    const layerFilters = document.querySelectorAll("#layer-filters input:checked");
    const speciesFilters = document.querySelectorAll("#species-filters input:checked");
    const genderFilters = document.querySelectorAll("#gender-filters input:checked");

    const talents = Array.from(talentFilters).map((filter) => filter.value);
    const layers = Array.from(layerFilters).map((filter) => filter.value);
    const species = Array.from(speciesFilters).map((filter) => filter.value);
    const genders = Array.from(genderFilters).map((filter) => filter.value);

    filteredData = data.filter((item) => {
        return (
            (!talents.length || talents.includes(item.talent)) &&
            (!layers.length || layers.some(r=> item.layers.includes(r))) &&
            (!species.length || species.includes(item.species)) &&
            (!genders.length || genders.includes(item.gender))
        );
    });

    // let filteredLayers = {};
    // filteredData.forEach((data)=>{
    //     data.layers.forEach((layer)=>filteredLayers[layer.layerNum] = 1);
    // });

    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";
    updateCheckboxes();
    displayGallery();
};

const displayGallery = () => {
    const gallery = document.getElementById("gallery");
    
    [].concat(filteredData).splice(loadedCount,Math.min(filteredData.length, pageSize)).forEach((image) => {
        const link = document.createElement("a");
        link.setAttribute('href', 'https://opensea.io/assets/ethereum/0x892848074ddea461a15f337250da3ce55580ca85/'+image.nftId)
        link.setAttribute('target', '_blank')
        const img = document.createElement("img");
        img.src = image.imageAws;
        img.alt = image.name;
        img.title = image.name;
        link.appendChild(img);
        gallery.appendChild(link);
    });
    loadedCount = Math.min(filteredData.length, pageSize);
    document.getElementById('load_more').style.display = filteredData.length > pageSize ? 'block' : 'none'; 
};

function updateCheckboxes(){
    createFilterCheckboxes("talent", "talent-filters");
    createFilterCheckboxes("species", "species-filters");
    createFilterCheckboxes("gender", "gender-filters");
    createLayerCheckboxes();
}

function createLayerCheckboxes(){
    var result = [];
    var lookup = {};
    for (var item, i = 0; item = layer_data[i++];) {
        var name = item.layerType;

        if (!(name in lookup)) {
            lookup[name] = 1;
            result.push(name);
        }
    }

    let layerElm = document.getElementById("layer-filters");
    layerElm.innerHTML = '';
    //result
    ['face', 'body', 'background', 'trait', 'other', 'back', 'icon'].forEach((layerType)=>{
        let display = openState['layer-filters-'+layerType] ? 'block' : 'none';
        layerElm.innerHTML += `<span class="clickable" onclick="toggle('layer-filters-${layerType}')">&#8964; ${layerType}:</span>
                            <div class="layer-filters filter_div" id="layer-filters-${layerType}" style="display: ${display};"></div>`
        setTimeout(()=>{createFilterCheckboxes2("layers", "layer-filters-"+layerType, layerType)}, 0);
    })
}

updateCheckboxes();
displayGallery(data);