var socket = io();
let members = {}

socket.on('updatePlayers', function(players) {
    console.log(players);
    members = players;
})

socket.on('reloadPage', function () {
  // Reload the page when instructed by the server
  window.location.reload();
});

document.addEventListener("DOMContentLoaded", function() {
  let wheel = document.querySelector('.wheel');
  let spinBtn = document.querySelector('.spinBtn');
  var rect = wheel.getBoundingClientRect();

  let selin = document.querySelector('#selin');
  let yavuz = document.querySelector('#yavuz');
  let alper = document.querySelector('#alper');
  let keziban = document.querySelector('#keziban');

  let family = [selin, yavuz, alper, keziban];
  let numbers = document.querySelectorAll('.number');

  let choosenPerson = null;

  changeChart(numbers);


  console.log(rect.top, rect.right, rect.bottom, rect.left);

  spinBtn.onclick = function(){ 
    socket.emit('spinWheel');
  };

  socket.on('updateWheel', function(speed, factor) {
    wheel.style.transform = "rotate(" + speed + "deg)";
    console.log(speed);
    speed += factor;
    wheel.addEventListener('transitionend', function onTransitionEnd() {

      var rect = wheel.getBoundingClientRect();
      console.log(rect.top, rect.right, rect.bottom, rect.left);

      for(var person of family){
        var pos = person.getBoundingClientRect();
        if(rect.top == pos.top){
          choosenPerson = person.id;
          console.log(choosenPerson);
          person.remove();
          numbers = document.querySelectorAll('.number');
          changeChart(numbers);

          members[socket.id] = person.id;
          console.log(members);
          break;
        }

      }
      wheel.removeEventListener('transitionend', onTransitionEnd);
      wheel.style.transition = '';

    });
  });

});


function changeChart(numbers){
  let numberOfElements = numbers.length;
  let angleStep = 360 / numberOfElements;

  numbers.forEach((number, index) => {

    let rotationAngle = index * angleStep;
    number.style.transform = `rotate(${rotationAngle}deg)`;
  });
}
