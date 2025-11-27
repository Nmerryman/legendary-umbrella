var numButtons = 3;
var buttonNames = ['button_0', 'type_1', 'option_2'];
var prices = [5, 10, 15];
var counts = {};

buttonNames.forEach(name => {
    counts[name] = 0;
});

function getButtonId(index) {
    return 'button_' + index;
}

function getCountId(index) {
    return 'count_' + index;
}

function toggle(id) {
    const buttonName = getButtonId(id);
    const button = document.getElementById(buttonName);
    if (button.classList.contains('clicked_button')) {
        button.classList.remove('clicked_button');
        button.classList.add('unclicked_button');
    } else {
        button.classList.add('clicked_button');
        button.classList.remove('unclicked_button');
        counts[buttonNames[id]] += 1;

    }
    renderCounts();
}


function resetCounts() {
    buttonNames.forEach(name => {
        counts[name] = 0;
    });
    for (let i = 0; i < numButtons; i++) {
        const button = document.getElementById(getButtonId(i));
        button.classList.remove('clicked_button');
        button.classList.add('unclicked_button');
    }
    renderCounts();
}


function renderCounts() {
    let sum = 0;
    for (let i = 0; i < numButtons; i++) {
        const buttonCount = counts[buttonNames[i]];
        const countElement = document.getElementById(getCountId(i));
        countElement.innerText = buttonCount;
        sum += buttonCount * prices[i];
    }

    const totalElement = document.getElementById('money_text');
    totalElement.innerText = sum;
}


function submitAction() {
    for (let i = 0; i < numButtons; i++) {
        const buttonElement = document.getElementById(getButtonId(i));
        buttonElement.classList.remove('clicked_button');
        buttonElement.classList.add('unclicked_button');
    }

    counts['timestamp'] = new Date().toUTCString();

    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(counts),
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

    resetCounts();
}

