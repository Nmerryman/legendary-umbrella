var numButtons = 4;
var buttonNames = ['R1_6', 'R1_9', 'R2_6', 'R2_9'];
var niceNames = ['Round 1\n6 Card', 'Round 1\n9 Card', 'Round 2\n6 Card', 'Round 2\n9 Card'];
var prices = [10, 14, 10, 14];
var counts = {};

resetCounts();
renderCounts();
fetchStats();

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

    // const statusText = document.getElementById('status_text');
    // statusText.innerText = 'Submitted!';
    // setTimeout(() => {
    //     statusText.innerText = '';
    // }, 2000);

    resetCounts();
}


function fetchStats() {
    fetch('/stats')
    .then(response => response.json())
    .then(result => {
        updateGlobalStats(result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function updateGlobalStats(data) {
    let r16 = data['R1_6'];
    let r19 = data['R1_9'];
    let r26 = data['R2_6'];
    let r29 = data['R2_9'];

    let responseText = "Round 1 Stats:\n";
    responseText += `6 Card: ${r16} * $${prices[0]} = $${r16 * prices[0]}\n`;
    responseText += `9 Card: ${r19} * $${prices[1]} = $${r19 * prices[1]}\n`;
    responseText += ' = $' + (r16 * prices[0] + r19 * prices[1]) + '\n\n';
    document.getElementById("R1_stats").innerText = responseText

    responseText = "Round 2 Stats:\n";
    responseText += `6 Card: ${r26} * $${prices[2]} = $${r26 * prices[2]}\n`;
    responseText += `9 Card: ${r29} * $${prices[3]} = $${r29 * prices[3]}\n`;
    responseText += ' = $' + (r26 * prices[2] + r29 * prices[3]) + '\n';

    let total = (r16 * prices[0]) + (r19 * prices[1]) + (r26 * prices[2]) + (r29 * prices[3]);
    responseText += `Grand Total: $${total}`;
    document.getElementById("R2_stats").innerText = responseText
}

function toggle_hidden_buttons() {
    let button_div = document.getElementById("extra_control_buttons");
    if (button_div.hasAttribute("hidden")) {
        button_div.removeAttribute("hidden");
        setTimeout(() => {
            if (!button_div.hasAttribute("hidden")) {
                button_div.setAttribute("hidden", true);
            }
        }, 30000);
    } else {
        button_div.setAttribute("hidden", true);
    }
}


function reset_submissions() {
    const names = ["timestamp", ...buttonNames];
    fetch("/file_reset", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(names),
    })
}
