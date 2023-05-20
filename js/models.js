let mechs = [443, 428, 140, 452, 540, 660, 531, 150, 341, 539, 326, 553, 549, 182, 16, 66, 158, 532, 522, 224, 709, 349, 161, 525, 430, 328, 163, 472, 338, 23, 424, 155, 487, 458, 492, 456, 629, 348, 106, 47, 448, 555, 314, 478, 640, 682, 172, 636, 61, 389];

const dataContainer = document.getElementById('data-container');
const downloadButton = document.getElementById('download-button');
let mechData = [];


let div = document.createElement('div');
div.className = 'data-item';
let html = `
<div class="data-item">
    <div class="check" style="width: 126px;">
        &nbsp;
    </div>
    <div class="card columnDiv" style="width: 270px;margin-right: 56px;">
        Bulk Downloads
    </div>
    <div class="files columnDiv">
        <ul>
            <li>glb: <a target="_blank" href="https://mechs-usdz.s3.us-west-1.amazonaws.com/1K_glb.zip">1K_glb.zip</a></li>
            <li>glb: <a target="_blank" href="https://mechs-usdz.s3.us-west-1.amazonaws.com/1K_glb.zip">2K_glb.zip</a></li>
            <li>glb: <a target="_blank" href="https://mechs-usdz.s3.us-west-1.amazonaws.com/1K_glb.zip">4K_glb.zip</a></li>
        </ul>
    </div>
    <div class="files columnDiv">
        <ul>
            <li>vrm: <a target="_blank" href="https://mechs-usdz.s3.us-west-1.amazonaws.com/1K_vrm.zip">1K_vrm.zip</a></li>
            <li>vrm: <a target="_blank" href="https://mechs-usdz.s3.us-west-1.amazonaws.com/1K_vrm.zip">2K_vrm.zip</a></li>
            <li>vrm: <a target="_blank" href="https://mechs-usdz.s3.us-west-1.amazonaws.com/1K_vrm.zip">4K_vrm.zip</a></li>
        </ul>
    </div>
   
</div>`;

/*
 <div class="files columnDiv">
        <ul>
            <li>fbx: <a target="_blank" href="https://mechs-usdz.s3.us-west-1.amazonaws.com/1K_fbx.zip">1K_fbx.zip</a></li>
            <li>fbx: <a target="_blank" href="https://mechs-usdz.s3.us-west-1.amazonaws.com/2K_fbx.zip">2K_fbx.zip</a></li>
        </ul>
    </div>
*/

div.innerHTML = html;
dataContainer.appendChild(div);

// Fetch data
mechs.forEach(id => {
    fetch(`https://m.cyberbrokers.com/eth/mech/${id}`)
    .then(response => response.json())
    .then(data => {
        mechData.push(data);
        let div = document.createElement('div');
        div.className = 'data-item';

        let files = '';

        Object.entries(data.files).forEach(([key, values]) => {
            if(key != 'fbx'){
                if(typeof values == 'object'){
                    files += '<div class="files columnDiv"><ul>';
                    values.forEach((value)=>{
                        files += `<li>${key}: <a target="_blank" href="${value}" >${value.split('/')[7]}</a></li>`;
                    })
                    files += '</ul></div>';
                } else {

                    let url = 'https://opensea.io/assets/ethereum/0xb286ac8eff9f44e2c377c6770cad5fc78bff9ed6/';

                    files += '<div class="columnDiv" style="display: inline-block;"><ul>';
                    files += `<li>OpenSea: <a target="_blank" href="${url+key}">${id}</a></li>`;

                    files += `<li>${key}: <a target="_blank" href="${values}">${values.split('/')[7]}</a></li>`;
                    files += '</ul></div>';
                }
            }
        });

        // <div class="check">
        //         <input type="checkbox" id="${data.tokenId}" />
        //     </div>

        div.innerHTML = `
            
            <div class="card columnDiv">
              <img crossorigin="anonymous" src="${data.image}" />
              <br>
              
              <label for="${data.tokenId}">${data.name}</label>
            </div>
            ${files}
        `;
        dataContainer.appendChild(div);
    });
});

// Download Selected Files
downloadButton.addEventListener('click', () => {
    let selectedMechs = mechData.filter(mech => document.getElementById(mech.tokenId).checked);
    selectedMechs.forEach(mech => {
        Object.values(mech.files).flat().forEach(file => {
            let a = document.createElement('a');
            a.href = file;
            a.download = '';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    });
});
