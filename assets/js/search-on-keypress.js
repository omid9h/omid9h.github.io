document.onkeydown = function (evt) {
    evt = evt || window.event;
    if (evt.key == '/') {
        evt.preventDefault();
        document.getElementById("search-input").focus()
    }
};