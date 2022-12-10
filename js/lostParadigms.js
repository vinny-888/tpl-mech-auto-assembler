let lostParadigmData = [];
async function getAllMetadata(){
    let url = 'https://metadata.lostparadigms.xyz/metadata/';
    for(let i=0; i<3333; i++){
        try {
            let res = await fetch(url + i + '.json');
            let metadata = await res.json();
            lostParadigmData.push(metadata);
            console.log('Got', i);
        } catch (error) {
            console.log(error);
        }
    }
    console.log('done', lostParadigmData);
}