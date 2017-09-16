var board = new Array();  //4x4 格子，用数组存储数据
var score = 0;  //记录分数
var hasConflicted = new Array();

$(document).ready(function () {
  //移动设备设置
  prepareForMobile();

  newgame();
});

  //移动设备设置 函数
  function prepareForMobile () {
    if (documentWidth > 500) {
      gridContainerWidth = 500;
      cellSideLength = 100;
      cellSpace = 20;
    }

    $("#grid-container").css({"width": gridContainerWidth - 2*cellSpace,
                              "height": gridContainerWidth - 2*cellSpace,
                              "padding": cellSpace,
                              "border-radius": 0.02*gridContainerWidth
                            });
    $(".grid-cell").css({"width": cellSideLength,
                         "height": cellSideLength,
                         "border-radius": 0.02*cellSideLength
                            });
    
  }


function newgame () {
  // 初始化棋盘格
  init();

  //在随机两个格子里面生成数字
  //运行两次generateOneNumber偶尔会生成同一坐标的数字，有待优化
  generateOneNumber();
  generateOneNumber();

}

function init () {
  //双重循环构建16个格子
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var gridCell = $("#grid-cell-" + i + "-" + j);   //获取每一个格子

      gridCell.css({"top": getPosTop(i, j),     //获取每一个格子的top值
                    "left": getPosLeft(i, j)  //获取每一个格子的left值
                  });

    }
  }

  //将board变为二维数组, 存储变化的数字
  for (var i = 0; i < 4; i++) {
    board[i] = new Array();
    hasConflicted[i] = new Array();
    for (var j = 0; j < 4; j++) {
        board[i][j] = 0;
        hasConflicted[i][j] = false;
    }
  }

  updateBoardView();  //该方法根据二维数组board 的值对前端 number-cell 元素进行操作

  //
  score = 0;  
  updateScore(score);
}


//通过这个方法通知前端页面更新number-cell的值
function updateBoardView () {
  $(".number-cell").remove();  //如果当前number-cell  已经存有值，则删除掉

  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      //创建显示数字内容的网格，定义为number-cell
      //append最好不要在for循环里重复调用，可以字符串拼接后，在for循环之后append  待改进?
      $("#grid-container").append("<div class='number-cell' id='number-cell-" + i + "-" + j + "'></div>");
      var theNumberCell = $("#number-cell-" + i + "-" + j);   //获取新创建的number-cell

      if (board[i][j] == 0) {
        theNumberCell.css({"width": "0px",
                          "height": "0px",
                          // "top": getPosTop(i, j) + 50,    //+50 动画显示在网格中间开始显示，效果好看一点
                          // "left": getPosLeft(i, j) + 50
                          "top": getPosTop(i, j) + cellSideLength/2,    //移动设备设置
                          "left": getPosLeft(i, j) + cellSideLength/2   //移动设备设置
                          });
      } else {
        theNumberCell.css({
                          // "width": "100px",
                          // "height": "100px",
                          "width": cellSideLength,   //移动设备设置
                          "height": cellSideLength,   //移动设备设置
                          "top": getPosTop(i, j),
                          "left": getPosLeft(i, j),
                          "background-color": getNumberBackgroundColor(board[i][j]),   //给number-cell添加背景色
                          "color": getNumberColor(board[i][j])   //给number-cell添加字体颜色
                          });
        theNumberCell.text(board[i][j]);  //
      }
      hasConflicted[i][j] = false;
    }
  }

  //给移动设备补上样式
  $(".number-cell").css({
    "line-height": cellSideLength + "px",
    "font-size": 0.6*cellSideLength + "px"
  });
}


//在随机两个格子里面生成数字
//这个函数 generateOneNumber偶尔会生成同一坐标的数字，有待优化
function generateOneNumber () {
  //先判断是否还可以生成数字，4x4棋盘格没有空间了就不可以生成数字了
  if (nospace(board)) {
    return false;
  }

  //随机生成一个位置 索引为0-3
  var randX = parseInt(Math.floor(Math.random() * 4));
  var randY = parseInt(Math.floor(Math.random() * 4));

  //随机生成一个位置后，这个位置不一定可用，如果这个位置上面已经有数字了，就不能用这个位置了。所以要做一个判断
  //下面这个while判断有待优化
  //应该在查找是否有可用格子的函数，返回可用格子的数组，然后在随机抽选一个可用格子。后面的whie再随机去找，效率太低了。??
  /*while (true) {
    if (board[randX][randY] == 0) {
      break;
    }
    randX = Math.floor(Math.random() * 4);
    randY = Math.floor(Math.random() * 4);
  }*/

  //优化后的循环(其实这个优化对于这个例子作用不明显，原来的循环耗费时间相对于电脑来说也可忽略)
  var time  = 0;
  while (time<50) {  //设置最大50次循环
    if (board[randX][randY] == 0) {
      break;
    }
    randX = Math.floor(Math.random() * 4);
    randY = Math.floor(Math.random() * 4);
    time++;
  }
  //如果50次循环后还没有生成随机的位置，就人工生成
  if (time == 50) {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (board[i][j] == 0) {
          randX = i;
          randY = j;
        }
      }
    }
  }

  //随机生成一个数字 2 或 4
  var randNumber = Math.random() < 0.5 ? 2 : 4;

  //在随机的额位置上显示数字，并通知前端页面显示这个randNumber
  board[randX][randY] = randNumber;
  //用动画显示 
  showNumberWithAnimation(randX, randY, randNumber);

  return true;

}

//玩家按向左向上向右向下四个按键进行操作
$(document).keydown(function(event) {
  switch (event.keyCode) {
    case 37:   //key left
      event.preventDefault();  //阻止鼠标的默认事件，按向上下按键，滚动条不会跟着滚动
      //要注意一点：如果当前棋盘格不允许向左移动数字，则不能移动，所以要做一个判断
      if (moveLeft()) {
        setTimeout("generateOneNumber()", 210); //向左移动成功后，要在随机两个格子里面生成数字
        // setTimeout("generateOneNumber()" , 400) ;//调用随机生成两个数字
        setTimeout("isgameover()", 300);   //判断游戏是否结束了
      }
      break;
    case 38:   //key up
      event.preventDefault();
      if (moveUp()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
      break;
    case 39:   //key right
      event.preventDefault();
      if (moveRight()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
      break;
    case 40:   //key down
      event.preventDefault();
      if (moveDown()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
      break;
    default:
      // statements_def
      break;
  }
});

//移动设备手指滑动
//数组touches，多点触控时，该数组就存储多个手指触控的信息。
document.addEventListener("touchstart", function (event) {
  startX = event.touches[0].pageX;
  startY = event.touches[0].pageY;
})

//安卓4.0机的一个bug，当事件touchstart或touchmove 不使用event.preventDefault();，touchevents不会触发
document.addEventListener("touchmove", function (event) {
  event.preventDefault();
})

//移动设备手指滑动
//数组changedTouches, 储存的是当触摸状态发生改变时的信息
document.addEventListener("touchend", function (event) {
  endX = event.changedTouches[0].pageX;
  endY = event.changedTouches[0].pageY;

  var deltaX = endX - startX;
  var deltaY = endY - startY;

  //如果不做下面的判断，移动端点击new game时会出现三个数字，并且手指触摸但不滑动时，仍然会执行滑动事件
  if (Math.abs(deltaX) < 0.1*documentWidth && Math.abs(deltaY) < 0.1*documentWidth) {
    return;
  }
  //上面的判断可以改为如下
  /*x轴和y轴分开写一个if判断，然后将方向判断改为
  *if （deltax > 0）{ //right}else if（deltax < 0）{ // left}...就不会产生这个bug了
  */

  //判断在X轴进行的滑动
  if (Math.abs(deltaX) >= Math.abs(deltaY)) {
    //如果deltaX 大于0，则在X轴的正方向滑动，即向右滑动，反之向左
    if (deltaX > 0) {
      if (moveRight()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    }else {
      if (moveLeft()) {
        setTimeout("generateOneNumber()", 210); 
        setTimeout("isgameover()", 300);   
      }
    }
  }
  //判断在Y轴进行的滑动
  //注意：对于手机屏幕，Y轴正方向是向下的
  else{
    //如果deltaY 大于0，则在Y轴的正方向滑动，即向下滑动，反之向上
    if (deltaY > 0) {
      if (moveDown()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    }else {
      if (moveUp()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    }
  }

});


//判断游戏是否结束
//判断条件： 所有网格都没有空间了
function isgameover () {
  if (nospace(board) && nomove(board)) {
    gameover();
  }
}

//游戏结束
function gameover () {
  alert("game over!");
}

//向左移动数字
function moveLeft () {
  if (!canMoveLeft(board)) {
    return false;
  }
  //向左移动数字的条件是： 落脚位置是否为空？ 落脚位置数字是否和待判定元素数字相等？ 移动路径中是否有障碍物？
  for (var i = 0; i < 4; i++) {
    for (var j = 1; j < 4; j++) {   //j 初始化 为1
      if (board[i][j] != 0) {
        //当前网格数字不为空，就要对当前元素左侧所有网格数字进行一次考察。 

        //moveLeft里面第三层循环如果遍历的时候是先从靠近待移动元素的元素开始遍历，
        //那就不用写noBlockHorizontal判断移动过程是否有障碍物这个函数了。。
        //改成for（var k=j-1;j>=0;j--）开始遍历，判断左侧第一个（不行就第二个、第三个等）元素是否为0或者相等。。
        for (var k = 0; k < j; k++) {
          if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
            //可以移动, 使用动画进行移动
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          }else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
            //可以移动，并且执行数字叠加操作
            showMoveAnimation(i, j, i, k);
            //数字叠加操作
            board[i][k] += board[i][j];
            board[i][j] = 0;
            //累计分数
            score += board[i][k];
            //更新前端页面分数
            updateScore(score);

            hasConflicted[i][k] = true;
            continue;
          }
        }
      }
    }
  }
  setTimeout("updateBoardView()", 200);
  return true;
}


//向右移动数字
function moveRight () {
  if (!canMoveRight(board)) {
    return false;
  }
  //向右移动数字的条件是： 落脚位置是否为空？ 落脚位置数字是否和待判定元素数字相等？ 移动路径中是否有障碍物？
  for (var i = 0; i < 4; i++) {
    for (var j = 2; j >= 0; j--) {   //j 初始化 为2
      if (board[i][j] != 0) {
        //当前网格数字不为空，就要对当前元素右侧所有网格数字进行一次考察。 

        for (var k = 3; k > j; k--) {
          if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
            //可以移动, 使用动画进行移动
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          }else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
            //可以移动，并且执行数字叠加操作
            showMoveAnimation(i, j, i, k);
            //add
            board[i][k] += board[i][j];
            board[i][j] = 0;
            //累计分数
            score += board[i][k];
            //更新前端页面分数
            updateScore(score);

            hasConflicted[i][k] = true;
            continue;
          }
        }
      }
    }
  }
  setTimeout("updateBoardView()", 200);
  return true;
}


//向上移动数字
function moveUp () {
  if (!canMoveUp(board)) {
    return false;
  }
  //向上移动数字的条件是： 落脚位置是否为空？ 落脚位置数字是否和待判定元素数字相等？ 移动路径中是否有障碍物？
  for (var j = 0; j < 4; j++) {   //i 初始化 为1
    for (var i = 1; i < 4; i++) {   
      if (board[i][j] != 0) {
        //当前网格数字不为空，就要对当前元素上侧所有网格数字进行一次考察。 

        for (var k = 0; k < i; k++) {
          if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
            //可以移动, 使用动画进行移动
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          }else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
            //可以移动，并且执行数字叠加操作
            showMoveAnimation(i, j, k, j);
            //add
            board[k][j] += board[i][j];
            board[i][j] = 0;
            //累计分数
            score += board[k][j];
            //更新前端页面分数
            updateScore(score);
            
            hasConflicted[k][j] = true;
            continue;
          }
        }
      }
    }
  }
  setTimeout("updateBoardView()", 200);
  return true;
}


//向下移动数字
function moveDown () {
  if (!canMoveDown(board)) {
    return false;
  }
  //向下移动数字的条件是： 落脚位置是否为空？ 落脚位置数字是否和待判定元素数字相等？ 移动路径中是否有障碍物？
  for (var j = 0; j < 4; j++) {   //i 初始化 为1
    for (var i = 2; i >= 0; i--) {   
      if (board[i][j] != 0) {
        //当前网格数字不为空，就要对当前元素下侧所有网格数字进行一次考察。 

        for (var k = 3; k > i; k--) {
          if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
            //可以移动, 使用动画进行移动
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          }else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
            //可以移动，并且执行数字叠加操作
            showMoveAnimation(i, j, k, j);
            //add
            board[k][j] += board[i][j];
            board[i][j] = 0;
            //累计分数
            score += board[k][j];
            //更新前端页面分数
            updateScore(score);
            
            hasConflicted[k][j] = true;
            continue;
          }
        }
      }
    }
  }
  setTimeout("updateBoardView()", 200);
  return true;
}