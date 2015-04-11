function isJump(src, tgt, compass, isKing){
  var spaceBetweenX = (src.x + tgt.x) / 2;
  var spaceBetweenY = (src.y + tgt.y) / 2;

  var $spaceBetween = $('td[data-x=' + spaceBetweenX + '][data-y=' + spaceBetweenY + ']');
