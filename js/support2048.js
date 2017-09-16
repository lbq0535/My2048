
//移动设备响应式设置
documentWidth = window.screen.availWidth;  //获取设备屏幕宽度
gridContainerWidth = 0.92 * documentWidth;
cellSideLength = 0.18 * documentWidth;
cellSpace = 0.04 * documentWidth;


//获取每一个格子的top值
function getPosTop (i, j) {
  // return 20 + i*120;
  return cellSpace + i*(cellSpace+cellSideLength);  //移动设备设置
}
//获取每一个格子的left值
function getPosLeft (i, j) {
  // return 20 + j*120;
  return cellSpace + j*(cellSpace+cellSideLength);  //移动设备设置
}

//给数字赋予不同背景色
function getNumberBackgroundColor (number) {
  switch (number) {
    case 2: return "#eee4de"; break;
    case 4: return "#ede0c8"; break;
    case 8: return "#f2b179"; break;
    case 16: return "#f59563"; break;
    case 32: return "#f67c5f"; break;
    case 64: return "#f65e3b"; break;
    case 128: return "#edcf72"; break;
    case 256: return "#edcc61"; break;
    case 512: return "#9c0"; break;
    case 1024: return "#33b5e5"; break;
    case 2048: return "#09c"; break;
    case 4096: return "#g6c"; break;
    case 8192: return "#93c"; break;
  }
  return "black";
}

//给数字赋予不同字体颜色
function getNumberColor (number) {
  if (number<=4) {
    return "#776e65";
  }else {
    return "white";
  }
  
}

//判断是否还可以生成数字，4x4棋盘格没有空间了就不可以生成数字了
//这个判断方法有问题,初始化有可能只生成一个数字
function nospace (board) {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (board[i][j] == 0) {
        return false;
      }
    }
  }
  return true;
}

//向左移动数字
//向左移动数字的条件是： 左边格子没有数字； 左边数字和自己相等。 不必对所有16个格子进行判断，第一列就不用进行判断
function canMoveLeft (board) {
  for (var i = 0; i < 4; i++) {
    for (var j = 1; j < 4; j++) {    //j 初始化 为1
      if (board[i][j] != 0) {
        if (board[i][j-1] == 0 || board[i][j-1] == board[i][j]) {
          return true;
        }
      }
    }
  }
  return false;
}

//向右移动数字
//向右移动数字的条件是： 右边格子没有数字； 右边数字和自己相等。 不必对所有16个格子进行判断，第一列就不用进行判断
function canMoveRight (board) {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 3; j++) {    //j 初始化 为0
      if (board[i][j] != 0) {
        if (board[i][j+1] == 0 || board[i][j+1] == board[i][j]) {
          return true;
        }
      }
    }
  }
  return false;
}


//向上移动数字
//向上移动数字的条件是： 上边格子没有数字； 上边数字和自己相等。 不必对所有16个格子进行判断，第一行就不用进行判断
function canMoveUp (board) {
  for (var j = 0; j < 4; j++) {  //
    for (var i = 1; i < 4; i++) {    
      if (board[i][j] != 0) {
        if (board[i-1][j] == 0 || board[i-1][j] == board[i][j]) {
          return true;
        }
      }
    }
  }
  return false;
}

//向下移动数字
//向下移动数字的条件是： 下边格子没有数字； 下边数字和自己相等。 不必对所有16个格子进行判断，第一行就不用进行判断
function canMoveDown (board) {
  for (var j = 0; j < 4; j++) {  //
    for (var i = 0; i < 3; i++) {    
      if (board[i][j] != 0) {
        if (board[i+1][j] == 0 || board[i+1][j] == board[i][j]) {
          return true;
        }
      }
    }
  }
  return false;
}


//当前网格数字不为空，就要对当前元素左侧或右侧所有网格数字进行一次考察。 
function noBlockHorizontal (row, col1, col2, board ) {
  for (var i = col1 + 1; i < col2; i++) {
    if (board[row][i] != 0) {
      return false;
    }
  }
  return true;
}

//当前网格数字不为空，就要对当前元素上侧或下侧所有网格数字进行一次考察。 
function noBlockVertical (col, row1, row2, board ) {
  for (var i = row1 + 1; i < row2; i++) {
    if (board[i][col] != 0) {
      return false;
    }
  }
  return true;
}


//判断16个网格没有空间时，是否还可以移动
function nomove (board) {
  if (canMoveLeft(board) ||
      canMoveRight(board) ||
      canMoveUp(board) ||
      canMoveDown(board)
    ) {
    return false;
  }
  return true;
}


