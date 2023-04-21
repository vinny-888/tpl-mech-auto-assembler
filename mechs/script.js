// Fetch the JSON data from the API
const fetchMechs = async (token) => {
    const url = `https://m.cyberbrokers.com/eth/mech/${token}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };
  
  // Create a card for a given mech object
  const createMechCard = (mech) => {
    // Create the elements for the card
    const card = document.createElement("div");
    const name = document.createElement("h2");
    const image = document.createElement("img");
    const attributes = document.createElement("div");
  
    // Set the content of the elements
    name.textContent = mech.name;
    image.setAttribute('crossOrigin', "anonymous");
    image.src = mech.image;
    
    attributes.innerHTML = `
      <p>${mech.clean_description}</p>
      <p>Endurance: ${mech.attributes.find(attr => attr.trait_type === "Endurance").value}/${mech.attributes.find(attr => attr.trait_type === "Endurance").max_value}</p>
      <p>Speed: ${mech.attributes.find(attr => attr.trait_type === "Speed").value}/${mech.attributes.find(attr => attr.trait_type === "Speed").max_value}</p>
      <p>Power: ${mech.attributes.find(attr => attr.trait_type === "Power").value}/${mech.attributes.find(attr => attr.trait_type === "Power").max_value}</p>
    `;
  
    // Add the elements to the card
    card.appendChild(name);
    card.appendChild(image);
    card.appendChild(attributes);
  
    // Add a click event listener to show the modal
    card.addEventListener("click", () => showModal(mech));

      
  
    return card;
  };
  
  // Create a modal for a given mech object
  const createMechModal = (mech) => {
    // Create the elements for the modal
    const modal = document.createElement("div");
    const name = document.createElement("h2");
    const image = document.createElement("img");
    const description = document.createElement("p");
    const attributes = document.createElement("div");
    const closeButton = document.createElement("button");
  
    // Set the content of the elements
    name.textContent = mech.name;
    image.src = mech.image;
    description.textContent = mech.description;
    attributes.innerHTML = `
      <h3>Attributes</h3>
      <ul>
        ${mech.attributes.map(attr => `<li><strong>${attr.trait_type}:</strong> ${attr.value}${attr.display_type === "number" ? "" : ` (${attr.max_value})`}</li>`).join("")}
      </ul>
    `;
    closeButton.textContent = "Close";
  
    // Add the elements to the modal
    modal.appendChild(name);
    modal.appendChild(image);
    modal.appendChild(description);
    modal.appendChild(attributes);
    modal.appendChild(closeButton);
  
    // Add a click event listener to the close button to hide the modal
    closeButton.addEventListener("click", hideModal);
  
    return modal;
  };
  
  // Show the modal for a given mech object
  const showModal = (mech) => {
    // Create the modal element
    const modal = createMechModal(mech);
  
    // Add the modal element to the page
    document.body.appendChild(modal);
  
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
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
      card.addEventListener("click", () => {
        const modal = document.querySelector(".modal");
        modal.querySelector(".name").textContent = card.dataset.name;
        modal.querySelector(".description").textContent = card.dataset.description;
        modal.querySelector(".attributes").innerHTML = card.dataset.attributes;
        modal.querySelector(".image").setAttribute('crossOrigin', "anonymous");
        modal.querySelector(".image").src = card.dataset.image;
        modal.style.display = "block";
        document.body.classList.add("no-scroll");
      });
    });

    // Add click event listener to close modal
    const modal = document.querySelector(".modal");
    const closeModal = modal.querySelector(".close-modal");
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
      document.body.classList.remove("no-scroll");
    });
  }
  
  function setupPage() {
    // Add click event listener to filter button
    addEventListeners();
  
    let container = document.querySelector("#mech-container"); 

    let token = 50;
    // Fetch data and display cards
    fetchMechs(token).then((mech)=>{
      container.appendChild(createMechCard(mech));
    });
  }

  window.addEventListener('DOMContentLoaded',()=>{
    setupPage();
  })
