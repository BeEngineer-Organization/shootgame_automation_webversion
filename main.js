// 表示する
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ゲーム画面の大きさを指定
canvas.width = 400;
canvas.height = 800;

// 画像の読み込み
const playerImage = new Image();
playerImage.src = "images/player.png";
const enemyImage = new Image();
enemyImage.src = "images/enemy.png";

// 必要な値の用意
const keys = [];
const playerLasers = [];
const enemies = [];
const enemyLasers = [];
let gameFrame = 0;

// プレイヤーの設定
const player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 64,
    height: 64,
    speed: 4,
};

// 入力されたキーを記録する
document.addEventListener("keydown", function (e) {
    keys[e.key] = true;
});

// キーが離された時に離されたことを記録する
document.addEventListener("keyup", function (e) {
    keys[e.key] = false;
});

// 十字キーの左右が押されたことをきっかけに
// プレイヤーを左右に移動させる
function handlePlayerMovement() {
    if (keys["ArrowLeft"] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys["ArrowRight"] && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }
}

// スペースキーが押されたことをきっかけに
// レーザーを発射する
function shootLaser() {
    if (keys[" "]) {
        playerLasers.push({
            x: player.x + player.width / 2 - 2,
            y: player.y,
            width: 4,
            height: 10,
            speed: 4,
        });
        keys[" "] = false;
    }
}

// 指定された座標にプレイヤーを表示する
function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y);
}

// 指定された場所にレーザーを表示する
function drawLasers() {
    playerLasers.forEach((laser, index) => {
        ctx.fillStyle = "yellow";
        ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
        laser.y -= laser.speed;
        if (laser.y + laser.height < 0) {
            playerLasers.splice(index, 1);
        }
    });
}

// 敵を、一定時間が経ったらランダムな場所に追加する
// 敵を下に移動させ、表示する
function handleEnemies() {
    if (gameFrame % 50 === 0) {
        enemies.push({
            x: Math.random() * (canvas.width - 30),
            y: 0,
            width: 64,
            height: 64,
            speed: 2,
        });
    }
    enemies.forEach((enemy, index) => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y);
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });
}

// 敵とレーザーの衝突を判定し、
// 衝突している場合にはその敵とレーザーを削除する
function checkCollisions() {
    playerLasers.forEach((laser, laserIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                laser.x < enemy.x + enemy.width &&
                laser.x + laser.width > enemy.x &&
                laser.y < enemy.y + enemy.height &&
                laser.y + laser.height > enemy.y
            ) {
                enemies.splice(enemyIndex, 1);
                playerLasers.splice(laserIndex, 1);
            }
        });
    });
}

// メインの実行
function animate() {
    // 画面を初期化する（何も無しにする）
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // プレイヤーを動かす
    handlePlayerMovement();

    // レーザーを発射する
    shootLaser();

    // プレイヤーを表示する
    drawPlayer();

    // レーザーを表示する
    drawLasers();

    // 敵の追加、移動、表示
    handleEnemies();

    // 敵とレーザーの当たり判定
    checkCollisions();

    // ゲームの時間を進める
    gameFrame++;

    // 次のゲーム実行を行う
    requestAnimationFrame(animate);
}

animate();
