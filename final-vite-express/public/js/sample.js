function sayHi() {
    console.log('Hi, this is a static page')
    document.getElementById('welcome').innerText = 'This is a static page'
}

window.onload = function () {
    sayHi()
}