
function toggle(id) {
    const button = document.getElementById(id);
    if (button.classList.contains('clicked_button')) {
        button.classList.remove('clicked_button');
        button.classList.add('unclicked_button');
    } else {
        button.classList.add('clicked_button');
        button.classList.remove('unclicked_button');
    }
}


function submitAction(...trackingIds) {
    const data = {};
    trackingIds.forEach(id => {
        const element = document.getElementById(id);
        data[id] = element.classList.contains('clicked_button');
        element.classList.remove('clicked_button');
        element.classList.add('unclicked_button');
    });

    data['timestamp'] = new Date().toISOString();

    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.text())
    .then(result => {
        console.log('Success:', result);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    const statusText = document.getElementById('status_text');
    statusText.innerText = 'Submitted!';
    setTimeout(() => {
        statusText.innerText = '';
    }, 2000);

}

