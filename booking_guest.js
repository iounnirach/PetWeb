window.onload = pageLoad;

function pageLoad() {
    const toggleButton = document.getElementsByClassName('toggle-button')[0]
    const nav = document.getElementsByClassName('navbar-links')[0]

    toggleButton.addEventListener('click', () => {
        nav.classList.toggle('active');
    })
    getcatnum();
}

async function getcatnum() {
    const response = await fetch("\chack_numcat");
    const content = await response.json()
    showdata_cat(content);
}

function showdata_cat(data) {
    var catnum = document.getElementById("catnumber");
    catnum.innerHTML = data + " ตัว";
    // catnum.innerHTML = [data[key[0]].hotel_name] + " ตัว";
}