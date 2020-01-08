$(document).ready(function() {
    const SPEED = 25;
    const DISTANCE = 100;
    const STEP = 10;
    var button1 = document.getElementById('slide');
    var button2 = document.getElementById('slide2');
    var button3 = document.getElementById('slide3');

    var container1 = document.getElementById('container');
    var container2 = document.getElementById('container2');
    var container3 = document.getElementById('container3');

    button1.onclick = function () {
        sideScroll(container1,'right');
    };
    var back1 = document.getElementById('slideBack');
    back1.onclick = function () {
        sideScroll(container1,'left');
    };

    button2.onclick = function () {
        sideScroll(container2,'right');
    };
    var back2 = document.getElementById('slideBack2');
    back2.onclick = function () {
        sideScroll(container2,'left');
    };

    button3.onclick = function () {
        sideScroll(container3,'right');
    };
    var back3 = document.getElementById('slideBack3');
    back3.onclick = function () {
        sideScroll(container3,'left');
    };

    function sideScroll(element,direction){
        scrollAmount = 0;
        var slideTimer = setInterval(function(){
            if(direction == 'left'){
                element.scrollLeft -= STEP;
            } else {
                element.scrollLeft += STEP;
            }
            scrollAmount += STEP;
            if(scrollAmount >= DISTANCE){
                window.clearInterval(slideTimer);
            }
        }, SPEED);
    }

});