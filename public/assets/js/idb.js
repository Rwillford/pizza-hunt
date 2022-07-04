let db;
const request = indexedDB.open('pizza_hunt', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;

    db.createObjectStore('new_pizza', { autoIncrement: true })
}

request.onsuccess = function(event) {
    db = event.target.result;

    if (navigator.onLine) {
        //add later
        //uploadPizza()
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(['new_pizza'], 'readwrite');
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    pizzaObjectStore.add(record)
}

function uploadPizza() {
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    const pizzaObjectStore = transaction.objectStore('new_pizza');

    const getAll = pizzaObjectStore.getAll();

    getAll.onsuccess = function() {
        if (getAll.results.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Types': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse)
                }
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                const pizzaObjectStore = transaction.objectStore('new_pizza');

                pizzaObjectStore.clear();

                alert('All saved Pizza has been submitted!');
            })
            .catch(err => {
                console.log(err)
            });
        }
    }
}

//listen for app coming back online

window.addEventListener('online', uploadPizza);