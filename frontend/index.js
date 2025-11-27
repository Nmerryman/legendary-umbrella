var numButtons = 3;
var buttonNames = ['button_0', 'type_1', 'option_2'];
var niceNames = ['Thing 1', 'Thing 2', 'Thing 3'];
var prices = [5, 10, 15];
var counts = {};

resetCounts();
renderCounts();

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
    counts[buttonNames[id]] += 1;
    renderCounts();
}


function resetCounts() {
    buttonNames.forEach(name => {
        counts[name] = 0;
    });
    renderCounts();
}


function renderCounts() {
    let sum = 0;
    for (let i = 0; i < numButtons; i++) {
        const buttonCount = counts[buttonNames[i]];
        const countElement = document.getElementById(getCountId(i));
        const buttonName = niceNames[i];
        countElement.innerText = buttonName + ": " + buttonCount;
        sum += buttonCount * prices[i];
    }

    const totalElement = document.getElementById('money_text');
    totalElement.innerText = sum;
}


function submitAction() {
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

