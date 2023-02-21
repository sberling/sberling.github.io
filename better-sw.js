//Identifiers
const linnea_id = '8542107';
const sam_id = '8541921';
const GROUP_ID = '39809687';
const AUTH_TOKEN = '00JmOtofBCPFG9lLPRCqTKqKuodTy3wCblcoVfw3';
const sam_cards = ["Blue", "Alaska", "Red", "Ollo", "Apple"];
const linnea_cards = ["WF", "Amazon"];
const forWhomOptions = ["Sam", "Linnea", "Shared"]

const linnea_percentage = 0.4835; // Linnea pays this percentage if 'both' is selected


//read input from hyperlink
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const description = params.get("description");
const amount = params.get("amount");
const forWhom = params.get("split");
const paymentMethod = params.get("paymentMethod");


const payer = sam_cards.includes(paymentMethod) ? sam_id : linnea_id;

let linnea_paid_share = 0;
let sam_paid_share = 0;
let linnea_owed_share = 0;
let sam_owed_share = 0;

if(payer === sam_id){
    sam_paid_share = amount;
}
else{
    linnea_paid_share = amount;
}

switch(forWhom) {
    case forWhomOptions[2]:
        linnea_owed_share = Math.round(amount * linnea_percentage * 100)/100;
        sam_owed_share = amount - linnea_owed_share;
        break;
    case forWhomOptions[1]:
        linnea_owed_share = amount;
        break;
    case forWhomOptions[0]:
        sam_owed_share = amount;
        break;
    default:
        break;
}

const response = fetch('https://secure.splitwise.com/api/v3.0/create_expense', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer ' + AUTH_TOKEN,
        'Content-Type': 'application/json'
    },
    body: {
        description: description,
        group_id: GROUP_ID,
        cost: amount,
        users__0__user_id: linnea_id,
        users__0__paid_share: linnea_paid_share,
        users__0__owed_share: linnea_owed_share,
        users__1__user_id: sam_id,
        users__1__paid_share: sam_paid_share,
        users__1__owed_share: sam_owed_share
    }
});

response.then(result => {
    if(result.ok){
        alert('Expense added succesffully!');
    }
    else {
        alert('Failed to add expense.');
    }
    console.log(result);
    return result.json();
});
