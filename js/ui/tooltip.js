function initTooltip(){
    Array.from(document.querySelectorAll('[tip]')).forEach(el => {
        let tip = document.createElement('div');
        tip.classList.add('tooltip');
        tip.innerText = el.getAttribute('tip');
        let delay = el.getAttribute('tip-delay');
        if (delay) {
            tip.style.transitionDelay = delay + 's';
        }
        tip.style.transform =
            'translate(' +
            (el.hasAttribute('tip-left') ? 'calc(-100% - 5px)' : '15px') + ', ' +
            (el.hasAttribute('tip-top') ? '-100%' : '0') +
            ')';
        el.appendChild(tip);
        el.onmousemove = e => {
            tip.style.left = (e.clientX-140) + 'px'
            tip.style.top = (e.clientY+20) + 'px';
        };
    });
}