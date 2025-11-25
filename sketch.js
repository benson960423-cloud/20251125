let stopSheet;
let walkSheet;
let jumpSheet;
let hitSheet;

let stopFrameWidth;
const stopFrameHeight = 212;
const stopNumFrames = 14;
const stopSheetWidth = 1955;

let walkFrameWidth;
const walkFrameHeight = 168;
const walkNumFrames = 9;
const walkSheetWidth = 2323;

let jumpFrameWidth;
const jumpFrameHeight = 188;
const jumpNumFrames = 13; // 根據您的要求，使用 13 張圖片
const jumpSheetWidth = 1913;

let hitFrameWidth;
const hitFrameHeight = 146;
const hitNumFrames = 9;
const hitSheetWidth = 2344;

const animationSpeed = 8; // 數字越大，動畫越慢。每 8 幀更新一次。

let characterX, characterY;
let startY; // 記錄跳躍起始高度
let facingDirection = 1; // 1 for right, -1 for left

// 跳躍狀態相關變數
let isJumping = false;
let jumpFrame = 0;
const jumpHeight = 150; // 角色跳躍的高度
const jumpAnimationSpeed = 5; // 跳躍動畫可以有獨立的速度

// 攻擊狀態相關變數
let isHitting = false;
let hitFrame = 0;
const hitAnimationSpeed = 4;

function preload() {
  // 預先載入圖片資源
  stopSheet = loadImage('1/stop/stop.png');
  walkSheet = loadImage('1/walk/walk.png');
  jumpSheet = loadImage('1/jump/jump.png');
  hitSheet = loadImage('1/hit/hit.png');
}

function setup() {
  // 建立一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);

  // 計算單一畫格的寬度
  stopFrameWidth = stopSheetWidth / stopNumFrames;
  walkFrameWidth = walkSheetWidth / walkNumFrames;
  jumpFrameWidth = jumpSheetWidth / jumpNumFrames;
  hitFrameWidth = hitSheetWidth / hitNumFrames;

  // 將圖片的繪製模式設定為中心點對齊
  imageMode(CENTER);

  // 初始化角色位置在畫布中央
  characterX = width / 2;
  characterY = height / 2;
  startY = characterY; // 儲存初始地面高度
}

function draw() {
  // 設定背景顏色
  background('#ffe6a7');

  // 優先處理跳躍動畫
  if (isJumping) {
    // 根據目前畫格計算 Y 軸位移，形成拋物線效果
    // 使用 sin 函數模擬從 0 -> 1 -> 0 的過程
    const jumpProgress = jumpFrame / (jumpNumFrames);
    characterY = startY - sin(jumpProgress * PI) * jumpHeight;

    // 播放跳躍動畫的對應畫格
    const currentJumpFrame = floor(jumpFrame);
    image(jumpSheet, characterX, characterY, jumpFrameWidth, jumpFrameHeight, currentJumpFrame * jumpFrameWidth, 0, jumpFrameWidth, jumpFrameHeight);

    // 更新跳躍動畫畫格
    // 確保動畫在指定速度下播完
    jumpFrame += (jumpNumFrames / (60 / (60 / jumpAnimationSpeed)) / jumpNumFrames);

    // 當動畫播放完畢
    if (jumpFrame >= jumpNumFrames) {
      isJumping = false;
      jumpFrame = 0;
      characterY = startY; // 確保角色回到地面
    }
  } else if (isHitting) {
    // 處理攻擊動畫
    const currentHitFrame = floor(hitFrame);
    
    push();
    translate(characterX, characterY);
    scale(facingDirection, 1); // 根據角色方向翻轉
    image(hitSheet, 0, 0, hitFrameWidth, hitFrameHeight, currentHitFrame * hitFrameWidth, 0, hitFrameWidth, hitFrameHeight);
    pop();

    hitFrame += (hitNumFrames / (60 / (60 / hitAnimationSpeed)) / hitNumFrames);

    // 動畫結束後
    if (hitFrame >= hitNumFrames) {
      isHitting = false;
      hitFrame = 0;
    }

  } else if (keyIsDown(RIGHT_ARROW)) {
    // 播放向右走路動畫
    facingDirection = 1; // 更新方向為右
    const currentFrame = floor(frameCount / animationSpeed) % walkNumFrames;
    image(walkSheet, characterX, characterY, walkFrameWidth, walkFrameHeight, currentFrame * walkFrameWidth, 0, walkFrameWidth, walkFrameHeight);
    characterX += 3; // 角色向右移動

    // 如果角色超出右邊界，就從左邊重新出現
    if (characterX > width + walkFrameWidth / 2) {
      characterX = -walkFrameWidth / 2;
    }
  } else if (keyIsDown(LEFT_ARROW)) {
    facingDirection = -1; // 更新方向為左
    // 播放向左走路動畫
    const currentFrame = floor(frameCount / animationSpeed) % walkNumFrames;
    
    push(); // 儲存目前的繪圖設定
    translate(characterX, characterY); // 將畫布原點移到角色位置
    scale(-1, 1); // 水平翻轉畫布
    // 在翻轉後的畫布原點(0,0)繪製圖片
    image(walkSheet, 0, 0, walkFrameWidth, walkFrameHeight, currentFrame * walkFrameWidth, 0, walkFrameWidth, walkFrameHeight);
    pop(); // 恢復原本的繪圖設定

    characterX -= 3; // 角色向左移動

    // 如果角色超出左邊界，就從右邊重新出現
    if (characterX < -walkFrameWidth / 2) {
      characterX = width + walkFrameWidth / 2;
    }
  } else {
    // 若沒有按鍵，則播放站立動畫
    // 根據最後的方向決定是否翻轉站立動畫
    const currentFrame = floor(frameCount / animationSpeed) % stopNumFrames;
    push();
    translate(characterX, characterY);
    scale(facingDirection, 1);
    image(stopSheet, 0, 0, stopFrameWidth, stopFrameHeight, currentFrame * stopFrameWidth, 0, stopFrameWidth, stopFrameHeight);
    pop();
  }
}

// 當按鍵被按下時觸發一次
function keyPressed() {
  // 如果按下上方向鍵且角色不在跳躍中，則開始跳躍
  if (keyCode === UP_ARROW && !isJumping && !isHitting) {
    isJumping = true;
  }

  // 如果按下空白鍵且角色不在跳躍或攻擊中，則開始攻擊
  if (key === ' ' && !isJumping && !isHitting) {
    isHitting = true;
  }
}
