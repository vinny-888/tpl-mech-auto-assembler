function partsImage(part, model) {
    return '<img height="60px" src="./images/parts/' + model + '_' + part + '.png" title="'+[part, model].join(' ')+'" />';
}

function afterglowImage(afterglow) {
    return '<img height="60px" src="./images/afterglows/' +afterglow+ '.avif" title="'+afterglow+'" />';
}