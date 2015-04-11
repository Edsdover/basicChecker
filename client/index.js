'use strict';

//waits for the document to load before running JS
$(document).ready(init);

var current = 'nick';
var $source;
var $spaceBetween;

//
function init() {
  initBoard();
  switchUser();
//on gameBoard the .on function calls a mouseover  function to select the element with the css .active.
  $('#gameBoard').on('mouseover', '.active', select);
  $('#gameBoard').on('click', '.empty', move);
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
      $spaceBetween.removeClass('nick chyld');
      switchUser();
  }
}

//passing in source target compass and isKing
function moveType(src, tgt, compass, isKing){
  if(isMove(src, tgt, compass, isKing)){
    return 'move';
  }
  if(isJump(src, tgt, compass, isKing)){
    return 'jump';
  }
}

function isMove(src, tgt, compass, isKing){
  return ((src.x + compass.east === tgt.x) || (src.x + compass.west === tgt.x)) && ((src.y + compass.north === tgt.y) || (src.y + compass.south === tgt.y));

}

function isJump(src, tgt, compass, isKing){
  var spaceBetweenX = (src.x + tgt.x) / 2;
  var spaceBetweenY = (src.y + tgt.y) / 2;
  $spaceBetween = $('td[data-x=' + spaceBetweenX + '][data-y=' + spaceBetweenY + ']');
  return $spaceBetween.hasClass('player inactive');
}

function isOpponent(src, tgt, compass, isKing){
 var opponent = inactive;
}

function movePiece($source, $target){
  var sourceClassses = $source.attr('class');
  var targetClassses = $target.attr('class');

  $target.attr('class', sourceClassses);
  $source.attr('class', targetClassses);
}

function select() {
  $source = $(this);
  $('.valid').removeClass('selected');
  $source.addClass('selected');
}

//calls functions after initBoard is called.
function initBoard(){
  $('#gameBoard tr:lt(3) .valid').addClass('nick player');
  $('#gameBoard tr:gt(4) .valid').addClass('chyld player');
  $('td.valid:not(.player').addClass('empty');
}

//checks the current player and applies a turnery
function switchUser(){
  current = (current === 'chyld') ? 'nick' : 'chyld';
  $('.valid').removeClass('active selected').addClass('inactive');
  $('.' + current).addClass('active').removeClass('inactive');
}
