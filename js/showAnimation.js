//动画生成数字
function showNumberWithAnimation (i, j, randNumber) {
  var numberCell = $("#number-cell-" + i + "-" + j);

  numberCell.css("background-color", getNumberBackgroundColor(randNumber));
  numberCell.css("color", getNumberColor(randNumber));
  numberCell.text(randNumber);
  numberCell.animate({
    // width: "100px",
    // height: "100px",
    width: cellSideLength,     //移动设备设置
    height: cellSideLength,    //移动设备设置
    
    top: getPosTop(i, j),
    left: getPosLeft(i, j)
  }, 50);

}


//
function showMoveAnimation (fromX, fromY, toX, toY) {
  var numberCell = $("#number-cell-" + fromX + "-" + fromY);
  numberCell.animate({
    top: getPosTop(toX, toY),
    left: getPosLeft(toX, toY)
  }, 200);
}

//更新前端页面分数
function updateScore (score) {
  $("#score").text(score);
}