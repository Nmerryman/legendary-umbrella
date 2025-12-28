var numButtons = 4;     // Remove this later
var buttonNames = ['r16', 'r19', 'r26', 'r29'];
var buttonText = {'r16': 'Round 1\n6 Card', 
    'r19': 'Round 1\n9 Card', 
    'r26': 'Round 2\n6 Card', 
    'r29': 'Round 2\n9 Card'};

var prices = {'r16': 10, 'r19': 14, 'r26': 10, 'r29': 14};
var counts = {};
var mode = "normal";

resetCounts();
setMode("normal");


function setMode(name) {
    mode = name;
    const main_body = document.getElementById("main_body");
    main_body.className = "main_body_" + name;
    buildSite();
    renderCounts();
    fetchStats();
}

function buildSite() {
    const gridContainer = document.getElementById("main_body"); 
    gridContainer.innerHTML = "";

    // reset button
    if (mode == "normal" || mode == "negative") {
        const temp = document.createElement("div");
        temp.className = "button reset_button";
        temp.style = "grid-area: reset;"
        temp.onclick = resetCounts;
        temp.innerText = "Reset Cart";
        gridContainer.append(temp);
    }

    // default round buttons
    if (mode == "normal") {
        let temp = document.createElement("div");
        temp.id = "counter_r16";
        temp.className = "button r1_button";
        temp.style = "grid-area: r16;";
        temp.onclick = () => {increment("r16")};
        gridContainer.append(temp);

        temp = document.createElement("div");
        temp.id = "counter_r19";
        temp.className = "button r1_button";
        temp.style = "grid-area: r19;";
        temp.onclick = () => {increment("r19")};
        gridContainer.append(temp);

        temp = document.createElement("div");
        temp.id = "counter_r26";
        temp.className = "button r2_button";
        temp.style = "grid-area: r26;";
        temp.onclick = () => {increment("r26")};
        gridContainer.append(temp);

        temp = document.createElement("div");
        temp.id = "counter_r29";
        temp.className = "button r2_button";
        temp.style = "grid-area: r29;";
        temp.onclick = () => {increment("r29")};
        gridContainer.append(temp);

    }

    // negative mode round buttons
    if (mode == "negative") {
        let temp = document.createElement("div");
        temp.id = "counter_r16";
        temp.className = "button r1_button";
        temp.style = "grid-area: r16;";
        temp.onclick = () => {decrement("r16")};
        gridContainer.append(temp);

        temp = document.createElement("div");
        temp.id = "counter_r19";
        temp.className = "button r1_button";
        temp.style = "grid-area: r19;";
        temp.onclick = () => {decrement("r19")};
        gridContainer.append(temp);

        temp = document.createElement("div");
        temp.id = "counter_r26";
        temp.className = "button r2_button";
        temp.style = "grid-area: r26;";
        temp.onclick = () => {decrement("r26")};
        gridContainer.append(temp);

        temp = document.createElement("div");
        temp.id = "counter_r29";
        temp.className = "button r2_button";
        temp.style = "grid-area: r29;";
        temp.onclick = () => {decrement("r29")};
        gridContainer.append(temp);

    }

    // Total money in cart text field
    if (mode == "normal" || mode == "negative") {
        let temp = document.createElement("div");
        temp.className = "money_style";
        temp.style = "grid-area: total;";
        temp.innerHTML = `
            <div style="font-size: xx-large;">
                In cart:<br/>
            </div>
            $
        `
        let total_money_element = document.createElement("span");
        total_money_element.id = "money_total_text";
        total_money_element.innerText = "1234";
        temp.append(total_money_element);

        gridContainer.append(temp);
    }

    // Round stat counter fields
    if (mode == "normal" || mode == "negative") {
        let temp = document.createElement("div");
        temp.id = "r1stat";
        temp.className = "stat_style";
        temp.style = "grid-area: r1stat;";
        gridContainer.append(temp);

        temp = document.createElement("div");
        temp.id = "r2stat";
        temp.className = "stat_style";
        temp.style = "grid-area: r2stat;";
        gridContainer.append(temp);
    }

    // Pay button
    if (mode == "normal" || mode == "negative") {
        let temp = document.createElement("div");
        temp.id = "checkout";
        temp.className = "button submit_button";
        temp.style = "grid-area: checkout;";
        temp.onclick = submitAction;
        temp.innerText = "Checkout"
        gridContainer.append(temp);
    }

}

function getButtonId(index) {
    return 'button_' + index;
}

function getCountId(index) {
    return 'count_' + index;
}

function increment(name) {
    counts[name] += 1;
    renderCounts();
}

function decrement(name) {
    counts[name] -= 1;
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
    for (let name of buttonNames) {
        const buttonCount = counts[name];
        const buttonElement = document.getElementById("counter_" + name);
        if (buttonElement) {    // Skip ones that don't exist
            buttonElement.innerText = buttonText[name] + ": " + buttonCount;
            sum += buttonCount * prices[name];
        }
    }

    const totalElement = document.getElementById('money_total_text');
    if (totalElement) {
        totalElement.innerText = sum;
    }
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
    let r16 = data['r16'];
    let r19 = data['r19'];
    let r26 = data['r26'];
    let r29 = data['r29'];

    const r1_stat = document.getElementById("r1stat");
    if (r1_stat) {
        let responseText = "Round 1 Stats:\n";
        responseText += `6 Card: ${r16} * $${prices['r16']} = $${r16 * prices['r16']}\n`;
        responseText += `9 Card: ${r19} * $${prices['r19']} = $${r19 * prices['r19']}\n`;
        responseText += ' = $' + (r16 * prices['r16'] + r19 * prices['r19']) + '\n\n';
        r1_stat.innerText = responseText
    }


    const r2_stat = document.getElementById("r2stat");
    if (r2_stat) {
        responseText = "Round 2 Stats:\n";
        responseText += `6 Card: ${r26} * $${prices['r26']} = $${r26 * prices['r26']}\n`;
        responseText += `9 Card: ${r29} * $${prices['r29']} = $${r29 * prices['r29']}\n`;
        responseText += ' = $' + (r26 * prices['r26'] + r29 * prices['r29']) + '\n';
    
        let total = (r16 * prices['r16']) + (r19 * prices['r19']) + (r26 * prices['r26']) + (r29 * prices['r29']);
        responseText += `Grand Total: $${total}`;
        r2_stat.innerText = responseText
    }
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


function toggle_mode() {
    if (mode == "normal") {
        setMode("negative");
    } else {
        setMode("normal");
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
    .then(response => response.json())
    .then(result => {
        updateGlobalStats(result);
    })
    .catch(error => {
        console.error('Error:', error);
    });

}
