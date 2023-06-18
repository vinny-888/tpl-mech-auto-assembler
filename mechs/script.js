let pageSize = 100;
let filteredData = null;
let loadedCount = 0;
let currentMech = null;
let currentRes = '1k';
let currentEnv = 1;
let minEndurance = 0;
let minSpeed = 0;
let minPower = 0;
let maxStyleDiversity = 6;
let imageScores = {};

async function getScores(){
  let url = 'https://mech-models.glitch.me/mech-scores';
  const response = await fetch(url);
  const jsonData = await response.json();
  return jsonData;
}

async function loadScores(){
  let scores = await getScores();
  imageScores = {};
  // let total = 0;
  scores.forEach((score)=>{
      imageScores[score.token_id] = score.score;
      // total += score.score;
  })
  // document.getElementById('total_votes').innerHTML = total + ' Total Votes!';
  // document.getElementById('total_scores').innerHTML = scores.length + ' Mechs Scored!';
}

// Fetch the JSON data from the API
const fetchMechs = async (token) => {
    const url = `https://m.cyberbrokers.com/eth/mech/${token}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };
  
  const addSegment = (title, value) => {
    const activeSegments = Math.round((value / 30) * 6);
    let html = `<div class="bar-container" id="${title}">
                    <span class="label">${title} (${value}):</span>
                    <div class="bar">`;
    for(let i=0; i<6; i++){
      let opacity = 0;
      if (i < activeSegments) {
        opacity = 1;
      }
      html += '<div class="segment" style="opacity: '+opacity+'"></div>';
    }
    html += `</div>
    </div>`;
    return html;
  }

  // Create a card for a given mech object
  const createMechCard = (mech, res) => {
    // Create the elements for the card
    const card = document.createElement("div");
    card.classList.add('card');
    
    const name = document.createElement("h2");
    // name.className = 'card-heading';

    const icon = document.createElement('a');
    icon.setAttribute('href', 'https://opensea.io/assets/ethereum/0xb286ac8eff9f44e2c377c6770cad5fc78bff9ed6/'+mech.tokenId);
    icon.setAttribute('target', '_blank');
    icon.onclick = (e) => {e.stopPropagation();};
    const img = document.createElement('img');
    img.src = './opensea.png';
    img.className = 'card-heading-icon';
    icon.appendChild(img);

    const nameLabel = document.createElement('div');
    nameLabel.className = 'card-heading';
    nameLabel.textContent = mech.name;
    name.appendChild(nameLabel);
    name.appendChild(icon);


    const image = document.createElement("img");
    const attributes = document.createElement("div");
  
    // Set the content of the elements
    // name.textContent = mech.name;
    image.setAttribute('crossOrigin', "anonymous");
    image.src = mech.image;

    let speed = mech.attributes.find(attr => attr.trait_type === "Speed").value;
    let endurance = mech.attributes.find(attr => attr.trait_type === "Endurance").value;
    let power = mech.attributes.find(attr => attr.trait_type === "Power").value;

    let html = `
      <p style="display: none;">${mech.clean_description}</p>
      <div class="stats">
    `;

    html += addSegment('Speed', speed);
    html += addSegment('Endurance', endurance);
    html += addSegment('Power', power);

    html += '<div style="text-align: center;width: 100%;">'+imageScores[mech.tokenId-1]+' Votes!</div>';

    html += '</div>';

    attributes.innerHTML = html;
  
    // Add the elements to the card
    card.appendChild(name);
    card.appendChild(image);
    card.appendChild(attributes);

  
    // Add a click event listener to show the modal
    card.addEventListener("click", () => showModal(mech, currentRes));

      
  
    return card;
  };
  
  // Create a modal for a given mech object
  const createMechModal = (mech, res) => {
    // Create the elements for the modal
    const modal = document.createElement("div");
    modal.classList.add('modal-viewer');
    const name = document.createElement("h2");
    const div = document.createElement("div");
    const description = document.createElement("p");
    const attributes = document.createElement("div");
    const closeButton = document.createElement("button");
  
    // Set the content of the elements
    name.textContent = mech.name;
    div.innerHTML += `<label>Resolution: </label><select id="res" onchange="changeRes()">
    <option value="1k" ${!currentRes || currentRes == '1k' ? 'selected' : ''}>1k</option>
    <option value="2k"  ${currentRes == '2k' ? 'selected' : ''}>2k</option>
    <option value="4k"  ${currentRes == '4k' ? 'selected' : ''}>4k</option>
    </select>`;
    div.innerHTML += `<label>  Enviroment: </label><select id="env" onchange="changeEnv()">
    <option value="1" ${!currentEnv || currentRes == '1' ? 'selected' : ''}>Space</option>
    <option value="2"  ${currentEnv == '2' ? 'selected' : ''}>Garden</option>
    <option value="3"  ${currentEnv == '3' ? 'selected' : ''}>Town</option>
    <option value="4"  ${currentEnv == '4' ? 'selected' : ''}>Beach</option>
    <option value="5"  ${currentEnv == '5' ? 'selected' : ''}>Snow</option>
    <option value="6"  ${currentEnv == '6' ? 'selected' : ''}>Sci Fi - 1</option>
    <option value="7"  ${currentEnv == '7' ? 'selected' : ''}>Sci Fi - 2</option>
    <option value="8"  ${currentEnv == '8' ? 'selected' : ''}>Sci Fi - 3</option>
    <option value="9"  ${currentEnv == '9' ? 'selected' : ''}>Sci Fi - 4</option>
    <option value="10"  ${currentEnv == '10' ? 'selected' : ''}>Sci Fi - 5</option>
    <option value="11"  ${currentEnv == '11' ? 'selected' : ''}>Sci Fi - 6</option>
    <option value="12"  ${currentEnv == '12' ? 'selected' : ''}>Sci Fi - 7</option>
    <option value="13"  ${currentEnv == '13' ? 'selected' : ''}>Sci Fi - 8</option>
    <option value="14"  ${currentEnv == '14' ? 'selected' : ''}>Sci Fi - 9</option>
    <option value="15"  ${currentEnv == '15' ? 'selected' : ''}>Sci Fi - 10</option>
    </select>`;
    modal.appendChild(div);
    // image.src = mech.image;
    // description.textContent = mech.description;
    // attributes.innerHTML = `
    //   <h3>Attributes</h3>
    //   <ul>
    //     ${mech.attributes.map(attr => `<li><strong>${attr.trait_type}:</strong> ${attr.value}${attr.display_type === "number" ? "" : ` (${attr.max_value})`}</li>`).join("")}
    //   </ul>
    // `;
    // closeButton.textContent = "Close";
  
    // Add the elements to the modal
    // modal.appendChild(name);

    // modal.innerHTML += '<iframe src="/tpl-mech-auto-assembler/3d/viewer/index.html?id='+mech.tokenId+'" title="" style="width: 100%; height: 100%;border: 0px;"></iframe>';
    modal.innerHTML += '<iframe src="/tpl-mech-auto-assembler/3d/viewer/index.html?id='+mech.tokenId+'&res='+res+'&env='+currentEnv+'" title="" style="width: 100%; height: 100%;border: 0px;"></iframe>';

    
    // modal.appendChild(description);
    // modal.appendChild(attributes);
    // modal.appendChild(closeButton);
    
    

  
    // Add a click event listener to the close button to hide the modal
    closeButton.addEventListener("click", hideModal);
  
    return modal;
  };

  function changeRes(){
    let res = document.getElementById('res');
    currentRes = res.value;
    showModal(currentMech, currentRes, currentEnv)
  }
  currentEnv
  function changeEnv(){
    let env = document.getElementById('env');
    currentEnv = env.value;
    showModal(currentMech, currentRes, currentEnv)
  }

  function toggle(elm){
    let el = document.getElementById(elm);
    el.style.display = el.style.display == 'none' ? 'block' : 'none';
    // openState[elm] = el.style.display == 'none' ? 0 : 1;
  }
  
  // Show the modal for a given mech object
  const showModal = (mech, res) => {
    currentMech = mech;
    // Create the modal element
    const modal = createMechModal(mech, res);
  
    // Add the modal element to the page
    let modalDiv = document.getElementById('modal-inner');
    
    modalDiv.innerHTML = '';
    modalDiv.appendChild(modal);


    document.getElementById('modal').style.display = '';
  
    // Add a class to the body to disable scrolling
    document.body.classList.add("no-scroll");
  };
  
  function hideModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
    document.body.classList.remove("no-scroll");
  
    // Remove the event listener for the escape key
    document.removeEventListener("keydown", escapeKeyListener);
  }

  function addEventListeners(){
    // Add click event listener to each card
    // const cards = document.querySelectorAll(".card");
    // cards.forEach(card => {
    //   card.addEventListener("click", () => {
    //     const modal = document.querySelector(".modal");
    //     modal.querySelector(".name").textContent = card.dataset.name;
    //     modal.querySelector(".description").textContent = card.dataset.description;
    //     modal.querySelector(".attributes").innerHTML = card.dataset.attributes;
    //     modal.querySelector(".image").setAttribute('crossOrigin', "anonymous");
    //     modal.querySelector(".image").src = card.dataset.image;
    //     modal.style.display = "block";
    //     document.body.classList.add("no-scroll");
    //   });
    // });

    // Add click event listener to close modal
    const modal = document.querySelector(".modal");
    const closeModal = modal.querySelector(".modal-close");
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
      document.body.classList.remove("no-scroll");
    });
  }

  function filterMechs(){
    const modelFilters = document.querySelectorAll("#model-filters input:checked");
    const styleFilters = document.querySelectorAll("#style-filters input:checked");


  }

  const createFilterCheckboxesModels = (attribute, container) => {
    const values = uniqueAttributes(attribute);
    const filterContainer = document.getElementById(container);
    filterContainer.innerHTML = '';

    let stats = {};
    values.forEach((value) => {
        if(!stats[value]){
            stats[value] = 0;
        }
        stats[value]++;
    });
    let sorted_values = getSortedKeys(stats);

    RARITY_ORDER.forEach((value) => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = value;
        // checkbox.checked = selected[value] ? 'checked' : '';
        checkbox.addEventListener("change", applyFilters);
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' '+value));
        filterContainer.appendChild(label);
    });
  };

  const createFilterCheckboxesStyles = (attribute, container) => {
    const values = uniqueAttributes(attribute);
    const filterContainer = document.getElementById(container);
    filterContainer.innerHTML = '';

    let stats = {};
    values.forEach((value) => {
        if(!stats[value]){
            stats[value] = 0;
        }
        stats[value]++;
    });
    let sorted_values = getSortedKeys(stats);

    RARITY_ORDER.reverse().forEach((model) => {
      const label = document.createElement("label");
      label.textContent = model;
      filterContainer.appendChild(label);

      STYLE_ORDER[model].forEach((value) => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = value;
        checkbox.className = 'style_filters';
        // checkbox.checked = selected[value] ? 'checked' : '';
        checkbox.addEventListener("change", applyFilters);
        label.appendChild(checkbox);
        const label2 = document.createElement("label");
        label2.textContent = value;
        label2.style.fontWeight = 400;
        label.appendChild(label2);
        filterContainer.appendChild(label);
      });

      const br = document.createElement("br");
      filterContainer.appendChild(br);
    });
  };

  // const createOtherFilters = (container) => {
  //   const filterContainer = document.getElementById(container);
  //   filterContainer.appendChild(br);
  // };

  const uniqueAttributes = (attr) => {
    let uniueAtts = {};

    metadata.forEach((mech)=>{
      let val = mech.attributes.find((att)=>att.trait_type == attr);
      if(val){
        uniueAtts[val.value] = 1;
      }
    })
    return Object.keys(uniueAtts);
  };

  function getSortedKeys(obj) {
    var keys = Object.keys(obj);
    return keys.sort(function(a,b){return obj[a]-obj[b]});
  }

  function getCheckedCheckboxesByClassName(className) {
    const checkboxes = document.getElementsByClassName(className);
    const checkedCheckboxes = [];
  
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].type === 'checkbox' && checkboxes[i].checked) {
        checkedCheckboxes.push(checkboxes[i]);
      }
    }
  
    return checkedCheckboxes;
  }

  const applyFilters = (evt) => {
    // debugger;
    // selected[evt.currentTarget.value] = evt.currentTarget.checked == '' ? 0 : 1;
    pageSize = 100;
    loadedCount = 0;
    const modelFilters = document.querySelectorAll("#model-filters input:checked");
    const styleFilters = getCheckedCheckboxesByClassName('style_filters');
    // const styleFilters = document.querySelectorAll('.style_filters input[type="checkbox"]:checked');

    const models = Array.from(modelFilters).map((filter) => filter.value);
    const styles = Array.from(styleFilters).map((filter) => filter.value);

    filteredData = metadata.filter((mech) => {
        let style = mech.attributes.find((att)=>att.trait_type == 'Engine').value;
        let model = mech.attributes.find((att)=>att.trait_type == 'Model').value;
        let speed = mech.attributes.find(attr => attr.trait_type === "Speed").value;
        let endurance = mech.attributes.find(attr => attr.trait_type === "Endurance").value;
        let power = mech.attributes.find(attr => attr.trait_type === "Power").value;
        let styleDiversity = mech.attributes.find(attr => attr.trait_type === "Style Diversity").value;
        return (
            (!models.length || models.includes(model)) &&
            (!styles.length || styles.includes(style)) &&
            endurance >= minEndurance &&
            speed >= minSpeed &&
            power >= minPower &&
            styleDiversity <= maxStyleDiversity
        );
    });
    let container = document.querySelector("#mech-container"); 
    container.innerHTML = '';
    displayMechs();
  };

  function getSortedKeys2(obj) {
    var keys = Object.keys(obj);
    return keys.sort(function(a,b){return obj[b].score-obj[a].score});
}

  function displayMechs(){
    let container = document.querySelector("#mech-container"); 
    container.innerHTML = '';

    let mapping = {};
    filteredData.forEach((item)=>{
      mapping[item.tokenId] = {
        mech: item,
        score: imageScores[item.tokenId-1]
      }
    });

    let mechIds = getSortedKeys2(mapping);
    
    [].concat(mechIds).splice(0,Math.min(mechIds.length, pageSize)).forEach((mech)=>{
      container.appendChild(createMechCard(mapping[mech].mech));
    })
    // loadedCount = Math.min(filteredData.length, pageSize);


    document.getElementById('results').innerHTML = filteredData.length + ' Results';
    
    addEventListeners();
  }

  function loadMore(){
    pageSize += 100;
    displayMechs();
  }

  window.addEventListener('DOMContentLoaded',async ()=>{
    createFilterCheckboxesModels("Model", "model-filters");
    createFilterCheckboxesStyles("Engine", "style-filters");
    // createOtherFilters();
    filteredData = [].concat(metadata);
    await loadScores();
    displayMechs();
  })

  let timeout_clear1 = null;
  function updateEndurance(){
      let value = parseInt(document.getElementById('endurance').value);
      document.getElementById('endurance_label').innerHTML = 'Min Endurance: '+value;

      clearTimeout(timeout_clear1);
      timeout_clear1 = setTimeout(()=>{
          minEndurance = value;
          applyFilters();
      }, 1000)
  }

  let timeout_clear2 = null;
  function updateSpeed(){
      let value = parseInt(document.getElementById('speed').value);
      document.getElementById('speed_label').innerHTML = 'Min Speed: '+value;

      clearTimeout(timeout_clear2);
      timeout_clear2 = setTimeout(()=>{
          minSpeed = value;
          applyFilters();
      }, 1000)
  }

  let timeout_clear3 = null;
  function updatePower(){
      let value = parseInt(document.getElementById('power').value);
      document.getElementById('power_label').innerHTML = 'Min Power: '+value;

      clearTimeout(timeout_clear3);
      timeout_clear3 = setTimeout(()=>{
          minPower = value;
          applyFilters();
      }, 1000)
  }

  let timeout_clear4 = null;
  function updateStyleDiversity(){
      let value = parseInt(document.getElementById('style').value);
      document.getElementById('style_label').innerHTML = 'Max Style Diversity: '+value;

      clearTimeout(timeout_clear4);
      timeout_clear4 = setTimeout(()=>{
          maxStyleDiversity = value;
          applyFilters();
      }, 1000)
  }