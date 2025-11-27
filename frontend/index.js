var numButtons = 4;
var buttonNames = ['R1_6', 'R1_9', 'R2_6', 'R2_9'];
var niceNames = ['R1 6 Card', 'R1 9 Card', 'R2 6 Card', 'R2 9 Card'];
var prices = [10, 14, 10, 14];
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
    .then(response => response.json())
    .then(result => {
        updateGlobalStats(result);
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

function updateGlobalStats(data) {
    let r16 = data['R1_6'];
    let r19 = data['R1_9'];
    let r26 = data['R2_6'];
    let r29 = data['R2_9'];

    let responseText = 'Todays Stats:\n';
    // buttonNames.forEach((name, index) => {
    //     responseText += niceNames[index] + ': ' + data[name] + " * " + prices[index] + " = " + (data[name] * prices[index]) + '\n';
    // });
    responseText += `R1 6 Card: ${r16} * $${prices[0]} = $${r16 * prices[0]}\n`;
    responseText += `R1 9 Card: ${r19} * $${prices[1]} = $${r19 * prices[1]}\n`;
    responseText += ' = $' + (r16 * prices[0] + r19 * prices[1]) + '\n';
    responseText += '---------------------\n';
    
    responseText += `R2 6 Card: ${r26} * $${prices[2]} = $${r26 * prices[2]}\n`;
    responseText += `R2 9 Card: ${r29} * $${prices[3]} = $${r29 * prices[3]}\n`;
    responseText += ' = $' + (r26 * prices[2] + r29 * prices[3]) + '\n';
    responseText += '---------------------\n';
    let total = (r16 * prices[0]) + (r19 * prices[1]) + (r26 * prices[2]) + (r29 * prices[3]);
    responseText += `Total: $${total}`;
    const responseElement = document.getElementById('response_text');
    responseElement.innerText = responseText;
}


