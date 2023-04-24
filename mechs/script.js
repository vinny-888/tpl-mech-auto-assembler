let pageSize = 100;
let filteredData = null;
let loadedCount = 0;
let currentMech = null;
let currentRes = '1k';
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
                    <span class="label">${title}:</span>
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
    const image = document.createElement("img");
    const attributes = document.createElement("div");
  
    // Set the content of the elements
    name.textContent = mech.name;
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
    modal.innerHTML += '<iframe src="/3d/viewer/index.html?id='+mech.tokenId+'&res='+res+'" title="" style="width: 100%; height: 100%;border: 0px;"></iframe>';

    
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
    showModal(currentMech, res.value)
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

  const createFilterCheckboxes = (attribute, container) => {
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

    sorted_values.forEach((value) => {
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

  const applyFilters = (evt) => {
    // debugger;
    // selected[evt.currentTarget.value] = evt.currentTarget.checked == '' ? 0 : 1;
    pageSize = 100;
    loadedCount = 0;
    const modelFilters = document.querySelectorAll("#model-filters input:checked");
    const styleFilters = document.querySelectorAll("#style-filters input:checked");

    const models = Array.from(modelFilters).map((filter) => filter.value);
    const styles = Array.from(styleFilters).map((filter) => filter.value);

    filteredData = metadata.filter((mech) => {
        let style = mech.attributes.find((att)=>att.trait_type == 'Engine').value;
        let model = mech.attributes.find((att)=>att.trait_type == 'Model').value;
        return (
            (!models.length || models.includes(model)) &&
            (!styles.length || styles.includes(style))
        );
    });

    displayMechs();
  };

  function displayMechs(){
    let container = document.querySelector("#mech-container"); 
    container.innerHTML = '';
    filteredData.splice(loadedCount,Math.min(filteredData.length, pageSize)).forEach((mech)=>{
      container.appendChild(createMechCard(mech));
    })
    loadedCount = Math.min(filteredData.length, pageSize);
    addEventListeners();
  }

  function loadMore(){
    pageSize += 100;
    displayMechs();
  }

  window.addEventListener('DOMContentLoaded',()=>{
    createFilterCheckboxes("Model", "model-filters");
    createFilterCheckboxes("Engine", "style-filters");
    filteredData = [].concat(metadata);
    displayMechs();
  })
