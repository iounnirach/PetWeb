
window.onload = pageload;
function pageload() {
    const toggleButton = document.getElementsByClassName('toggle-button')[0]
    const nav = document.getElementsByClassName('navbar-links')[0]

    toggleButton.addEventListener('click', () => {
        nav.classList.toggle('active');
    })
   
}
function ShowInfo() {
    document.getElementById("bgShow").style.display = "block";
}
function CloseInfo() {
    document.getElementById("bgShow").style.display = "none";
}
