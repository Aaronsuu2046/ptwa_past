document.addEventListener('DOMContentLoaded', function () {
    // 獲取所有關卡容器
    const levelContainers = document.querySelectorAll('.level-container');
    // 獲取遊戲關卡按鈕容器
    const showGameLevel = document.getElementById('show-game-level');
    // 獲取遊戲控制按鈕容器
    const gameControlBtn = document.getElementById('game-control-btn');
    // 獲取各個控制按鈕
    const gameStartBtn = document.getElementById('game-start-btn');
    const lastLevelBtn = document.getElementById('last-level-btn');
    const nextLevelBtn = document.getElementById('next-level-btn');
    // 獲取遊戲關卡按鈕
    const levelButtons = document.querySelectorAll('#show-game-level .circle');
  
    const resultRight = document.getElementById('result-right');
    const resultWrong = document.getElementById('result-wrong');
    const restartBtn = document.getElementById('restart-btn');
  
    // 設置當前關卡變量
    let currentLevel = 0;
    showDescription();
    // 顯示遊戲說明
    function showDescription() {
      // 將所有關卡容器隱藏
      levelContainers.forEach(container => container.style.display = 'none');
      // 顯示說明容器
      document.getElementById('description').style.display = 'block';
      // 顯示遊戲控制按鈕容器
      gameControlBtn.style.display = 'flex';
      // 顯示遊戲關卡按鈕容器
      showGameLevel.style.display = 'flex';
      // 禁用遊戲關卡按鈕的點擊事件
      showGameLevel.style.pointerEvents = 'none';
      gameStartBtn.disabled = false;
      lastLevelBtn.disabled = true;
      nextLevelBtn.disabled = true;
    }
  
    // 顯示指定關卡
    function showLevel(level) {
      // 將所有關卡容器隱藏
      levelContainers.forEach(container => container.style.display = 'none');
      // 顯示指定關卡容器
      document.getElementById(`level-${level}-container`).style.display = 'block';
      // 顯示遊戲控制按鈕容器
      gameControlBtn.style.display = 'flex';

    }
  
    // 開始遊戲
    function startGame() {
      // 啟用遊戲關卡按鈕的點擊事件
      showGameLevel.style.pointerEvents = 'auto';
      // 重置所有关卡按钮的背景颜色
      levelButtons.forEach((button) => {
      button.style.backgroundColor = ''; // 使用空字符串将按钮背景颜色重置为默认颜色
      });
      // 顯示第一關
      currentLevel = 1;
      showLevel(currentLevel);
      gameStartBtn.disabled = false;
      lastLevelBtn.disabled = false;
      nextLevelBtn.disabled = false;
    }
  
    // 上一關
    function lastLevel() {
      // 如果當前關卡大於1，則回到上一關
      if (currentLevel > 1) {
        currentLevel--;
        showLevel(currentLevel);
      }
    }
  
    // 下一關
    function nextLevel() {
      // 如果當前關卡小於最後一關，則進入下一關
      if (currentLevel === 5 ) {
        showRestart();
        return;
      }
      if (currentLevel < levelContainers.length - 1 ) {
        currentLevel++;
        showLevel(currentLevel);
      }
      
    }
  
    // 為控制按鈕添加事件監聽器
  gameStartBtn.addEventListener('click', startGame);
  lastLevelBtn.addEventListener('click', lastLevel);
  nextLevelBtn.addEventListener('click', nextLevel);

  // 為遊戲關卡按鈕添加事件監聽器
  levelButtons.forEach((button, index) => {
    button.addEventListener('click', function () {
      // 將當前關卡設置為選擇的關卡，然後顯示
      currentLevel = index + 1;
      showLevel(currentLevel);
    });
  });
  
  // 顯示正確或錯誤的結果
  function showResult(isCorrect) {
    // 根據 isCorrect 變量選擇正確或錯誤的結果元素
    const result = isCorrect ? document.getElementById(`result-right-${currentLevel}`) : document.getElementById(`result-wrong-${currentLevel}`);

    // 禁用所有按鈕的函數
    function disableAllButtons() {
      levelContainers.forEach((container) => {
        container.querySelectorAll("button").forEach((button) => {
          button.disabled = true;
        });
      });
    }
  
    // 禁用所有按鈕
    disableAllButtons();
  
    // 顯示結果元素
    result.style.display = 'flex';
  
    // 啟用所有按鈕的函數
    function enableAllButtons() {
      levelContainers.forEach((container) => {
        container.querySelectorAll("button").forEach((button) => {
          button.disabled = false;
        });
      });
    }
  
    // 設置1秒後將結果元素隱藏並恢復按鈕功能
    setTimeout(() => {
      result.style.display = 'none';
      enableAllButtons(); 
  
      // 如果答案正確，則檢查是否是最後一關，如果是，則顯示重新開始按鈕；如果不是，則進入下一關
      if (isCorrect) {
        levelButtons[currentLevel - 1].style.backgroundColor = 'lightgreen';
        if (currentLevel === levelContainers.length - 1) {
          hasPassedLastLevel = true;
          showRestart();
        } else {
          nextLevel();
        }
      }
    }, 1000);
  }
  

  // 顯示重新開始遊戲的按鈕
  function showRestart() {
    // 將所有關卡容器隱藏
    levelContainers.forEach(container => container.style.display = 'none');
    // 顯示重新開始按鈕
    restartBtn.style.display = 'flex';
    // 禁用下一關按鈕的點擊事件
    gameStartBtn.disabled = true;
    lastLevelBtn.disabled = true;
    nextLevelBtn.disabled = true;

  }

  // 重新開始遊戲
  function restartGame() {
    // 隱藏重新開始按鈕
    restartBtn.style.display = 'none';
    // 顯示遊戲說明
    showDescription();
    // lastLevelBtn.disabled = false;
    // nextLevelBtn.disabled = false;
  }

  // 為重新開始按鈕添加事件監聽器
  restartBtn.addEventListener('click', restartGame);

  // 定義每個關卡的正確答案
  const correctAnswers = {
    'level-1-container': 'right-btn',
    'level-2-container': 'right-btn',
    'level-3-container': 'left-btn',
    'level-4-container': 'left-btn',
    'level-5-container': 'right-btn'
  };

  // 為每個關卡容器添加事件監聽器
  levelContainers.forEach((container, index) => {
    // 如果是遊戲說明，則跳過此次循環
    if (index === 0) return;

    // 獲取關卡容器內的左右按鈕
    const leftBtn = container.querySelector('.left-btn');
    const rightBtn = container.querySelector('.right-btn');


    //新增區塊
    const resultRight = document.createElement('div');
    resultRight.classList.add('result');
    resultRight.id = `result-right-${index}`;

    const rightImg = document.createElement('img');
    rightImg.src = 'images/ellipse.png';
    rightImg.alt = '答對！';
    rightImg.classList.add('show-result');
    resultRight.appendChild(rightImg);

    const resultWrong = document.createElement('div');
    resultWrong.classList.add('result');
    resultWrong.id = `result-wrong-${index}`;

    const wrongImg = document.createElement('img');
    wrongImg.src = 'images/close.png';
    wrongImg.alt = '答錯！';
    wrongImg.classList.add('show-result');
    resultWrong.appendChild(wrongImg);

    container.appendChild(resultRight);
    container.appendChild(resultWrong);
    //新增區塊

    // 為左按鈕添加點擊事件
    leftBtn.addEventListener('click', () => {
      // 判斷左按鈕是否是正確答案
      const isCorrect = correctAnswers[container.id] === 'left-btn';
      // 顯示正確或錯誤的結果
      showResult(isCorrect);
    });

    // 為右按鈕添加點擊事件
    rightBtn.addEventListener('click', () => {
      // 判斷右按鈕是否是正確答案
      const isCorrect = correctAnswers[container.id] === 'right-btn';
      // 顯示正確或錯誤的結果
      showResult(isCorrect);
    });
  });
  // 修正遊戲一開始顯示的畫面
  restartGame();
});
