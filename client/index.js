'use strict';

//waits for the document to load before running JS
$(document).ready(init);

var current = '';
var $source;

function init() {
  initBoard();
  switchUser();
  //on gameBoard the .on function calls a mouseover  function to select the element with the css .active.
  $('#gameBoard').on('mouseover', '.active', select);
  $('#gameBoard').on('click', '.empty', move);
  $('td.valid:not(.player)').addClass('empty black');
}

//calls functions after initBoard is called.
function initBoard(){
  $('#gameBoard tr:lt(3) .valid').addClass('nick player');
  $('#gameBoard tr:gt(4) .valid').addClass('chyld player');
  $('td.valid:not(.player').addClass('empty');
  checkWin();
}

//target is the element selected. the if function asks if the element has an active player, return exits if element is active. is king asks if the source has the class .king.
function move() {
if(!$source){
  return;
}

var $target = $(this);
var isKing = $source.is('.king');
var src = {};
var tgt = {};

src.x = $source.data('x') * 1;
src.y = $source.data('y') * 1;
tgt.x = $target.data('x') * 1;
tgt.y = $target.data('y') * 1;

var compass = {};
compass.north = (current === 'chyld') ? -1 : 1;
compass.east = (current === 'chyld') ? 1 : -1;
compass.west = compass.east * -1;
compass.south = compass.north * -1;

//determins if jump or move
switch(moveType(src, tgt, compass, isKing)){
case 'move':
  movePiece($source, $target);
  switchUser();
  break;
  case 'jump':
    movePiece($source, $target);
    var $middle = findMiddleSpace(src, tgt);
    $middle.removeClass('nick chyld player');
    $middle.addClass('empty');
    $('td').each(function(e){
      if ($(this).data('y') === src.y + compass.north * 2 && ($(this).data('x') === src.x + compass.east * 2 || $(this).data('x') === src.x + compass.west * 2)){
        $target = $(this)[0];

        if ($($target).hasClass('empty')){
          switchUser();

          if ($($middle).hasClass('opponent player')){
            switchUser();
          }
        }
      }
    });
    switchUser();
  }
  checkWin();
}

//passing in source target compass and isKing
function moveType(src, tgt, compass, isKing){
  if(isMove(src, tgt, compass, isKing)){
    return 'move';
  }
  var $middle = findMiddleSpace(src, tgt);
  if(isJump(src, tgt, compass, isKing) && isOpponent($middle)){
    return 'jump';
  }
}

function isMove(src, tgt, compass, isKing){
  return (src.x + compass.east === tgt.x || src.x + compass.west === tgt.x) && ((src.y + compass.north === tgt.y) || (isKing && src.y + compass.south === tgt.y));
}

function isJump(src, tgt, compass, isKing){
  var xIsOk = (src.x + 2 === tgt.x || src.x - 2 === tgt.x);
  var yIsOk = (src.y + compass.north * 2 === tgt.y) || (isKing && src.y + compass.south * 2 === tgt.y);
  return (xIsOk && yIsOk && isEmpty(tgt));
}

function isEmpty(tgt) {
  var hasPlayer = $('td[data-x=' + tgt.x + '][data-y=' + tgt.y + ']').hasClass('player');
  var isInactive = $('td[data-x=' + tgt.x + '][data-y=' + tgt.y + ']').hasClass('inactive');
  return (!hasPlayer && isInactive);
}

function findMiddleSpace(src, tgt){
  var checkX = ((src.x + tgt.x) / 2);
  checkX = checkX.toString();
  var checkY = ((src.y + tgt.y) / 2);
  checkY = checkY.toString();
  return $('td[data-x=' + checkX + '][data-y='+ checkY +']');
}

function isOpponent($space){
  var opponent = (current === 'chyld') ? 'nick' : 'chyld';
  if ($space.hasClass('player') && $space.hasClass(opponent)){
    return true;
  }
  return false;
}

function movePiece($source, $target){
  var sourceClassses = $source.attr('class');
  var targetClassses = $target.attr('class');

  $target.attr('class', sourceClassses);
  $source.attr('class', targetClassses);
  if(current === 'chyld' && $target.data('y') === 0){
    $target.addClass('king');
  }else if(current === 'nick' && $target.data('y') === 7){
    $target.addClass('king');
  }
}

function select() {
  $source = $(this);
  $('.valid').removeClass('selected');
  $source.addClass('selected');
}

//checks the current player and applies a turnery
function switchUser(){
  current = (current === 'chyld') ? 'nick' : 'chyld';
  $('.valid').removeClass('active selected').addClass('inactive');
  $('.' + current).addClass('active').removeClass('inactive opponent');
}

function checkWin(){
  if($('.chyld').length === 0){
    alert('Nick Wins');
  }
  else if($('.nick').length === 0){
    alert('Chyld Wins');
  }
}
