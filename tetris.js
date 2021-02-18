//落ちるスピード 
　const GAME_SPEED = 300;

//フィールドサイズ
const FIELD_COL = 10; //縦列
const FIELD_ROW = 20; //横列

// ブロックスタイル一つのサイズ
const BlockSize = 30;  

//キャンバスのサイズ
const Screen_W = BlockSize * FIELD_COL; //300px
const Screen_H = BlockSize * FIELD_ROW; //600px

// テトロミノサイズ
const TETRO_SIZE = 4; 

let can = document.getElementById("can");
let con = can.getContext("2d");

//スクリーンサイズ
can.width        = Screen_W;
can.height       = Screen_H;
can.style.border = "4px solid #555";

const TETRO_COLORS =  [
  "#000",     //0　空
  "#6CF",     //水色
  "#F92",     //0　オレンジ
  "#66F",     //0　青
  "#C5C",     //0　紫
  "#FD2",     //0　黄色
  "#F44",     //0　赤
  "#5B5"     //0　緑

]
// テトロミノ本体

const TETRO_TYPES = [　　//3次元配列

  [], //0　空っぽ
  [          // 1, I
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ],
  [           //2, L
    [0,1,0,0],
    [0,1,0,0],
    [0,1,1,0],
    [0,0,0,0]
  ],
  [           //3, J
    [0,0,1,0],
    [0,0,1,0],
    [0,1,1,0],
    [0,0,0,0]
  ],
  [           //,T
    [0,1,0,0],
    [0,1,1,0],
    [0,1,0,0],
    [0,0,0,0]
  ],
  [          //5,O
    [0,0,0,0],
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0]
  ],
  [          //6,Z
    [0,0,0,0],
    [1,1,0,0],
    [0,1,1,0],
    [0,0,0,0]
  ],
  [          //7,S
    [0,0,0,0],
    [0,1,1,0],
    [1,1,0,0],
    [0,0,0,0]
  ]
  
]


const START_X = FIELD_COL / 2  - TETRO_SIZE / 2;
const START_Y = 0;


//テトロミの本体　　
let tetro;

// テトロミノの座標
let tetro_x = START_X;
let tetro_y = START_Y;
// テトロミノの形
let tetro_t;

//フィールドの中身を配列にする
let field = [];

// ゲームオーバー変数
let over = false;

tetro_t = Math.floor(Math.random() * (TETRO_TYPES.length -1) ) +1;
tetro = TETRO_TYPES[tetro_t]; //２次元配列になる

init();
drawAll();

setInterval(dropTetro, GAME_SPEED);


//二次元配列の初期化の関数
function init(){
  //フィールドのクリア
  for(let y=0; y<FIELD_ROW; y++){
    field[y] = [];
    for(let x=0; x<FIELD_COL; x++){
      field[y][x] = 0;
    }
  }

}



//ブロック一つを描画する
function drawBlock(x, y, c){
  let px = x * BlockSize;
  let py = y * BlockSize;
  con.fillStyle = TETRO_COLORS[c];
  con.fillRect(px, py, BlockSize, BlockSize);
  con.strokeStyle = "black";
  con.strokeRect(px, py, BlockSize, BlockSize);
}

// 全部描画する関数の表示関数
function drawAll() {
  con.clearRect(0, 0, Screen_W, Screen_H);  //表示をクリアーする 

  for(let y = 0; y<FIELD_ROW; y++){
    for(let x = 0; x<FIELD_COL; x++){
      if(field[y][x]){  //true x = 1, y = 1の時 
        drawBlock(x, y, field[y][x]);
      }
    }
  }
  for(let y = 0; y<TETRO_SIZE; y++){
    for(let x = 0; x<TETRO_SIZE; x++){
      if(tetro[y][x]){ 
        drawBlock(tetro_x + x, tetro_y + y, tetro_t);
      }
    }
  }
  if(over){
    let s = "GAME OVER"
    con.font ="40px 'MS　ゴシック'";
    let w = con.measureText(s).width;
    let x = Screen_W / 2 - w / 2;
    let y = Screen_H / 2 - 20;
    con.lineWidth = 4;
    con.strokeText(s, x, y);
    con.fillStyle = "white";
    con.fillText(s, x, y);

  }
}



function checkMove( mx,my ,ntetro){
	if( ntetro == undefined ) ntetro = tetro;
	
	for(let y=0; y<TETRO_SIZE ; y++ ){
		for(let x=0; x<TETRO_SIZE ; x++ ){
			if(  ntetro[y][x]){
				let nx = tetro_x + mx + x;
				let ny = tetro_y + my + y;
				if( ny < 0 ||
				    nx < 0 ||
					  ny >= FIELD_ROW ||
					  nx >= FIELD_COL ||
					  field[ny][nx] )
				{
					return false;
				}
			}
		}
	}
	return true;
}


//テトロの回転
function rotate()
{
	let ntetro = [];
	
	for(let y=0; y<TETRO_SIZE ; y++ ){
		ntetro[y]=[];
		for(let x=0; x<TETRO_SIZE ; x++ ){
			ntetro[y][x] = tetro[TETRO_SIZE-x-1][y];
		}
	}
	
	return ntetro;
}

// ブロック固定する処理
function fixTetro(){
  for(let y=0; y<TETRO_SIZE ; y++ ){
    for(let x=0; x<TETRO_SIZE ; x++ ){
      if(tetro[y][x]){
        field[tetro_y + y][tetro_x + x] = tetro_t;
      }
		}
	}
}

//  ラインが揃ったら消す
function checkLine(){
  let lineCount = 0; //スコアカウントに使う
  for(let y=0; y<FIELD_ROW ; y++ ){
    let flag = true;
    for(let x=0; x<FIELD_COL ; x++ ){
      if(!field[y][x]){
        flag = false;
        break;
      }
    }
    if(flag){
      lineCount++;
      for(let ny = y; ny > 0; ny--){
        for(let nx = 0; nx<FIELD_COL; nx++){
          field[ny][nx] = field[ny-1][nx];
        }
      }
    }
  }
}


//ブロック落ちる処理
function dropTetro(){

  if(over)return;
  if(checkMove(0, 1)) tetro_y++;
  else{
    fixTetro();
    checkLine();
    tetro_t = Math.floor(Math.random() * (TETRO_TYPES.length -1) ) +1;
    tetro = TETRO_TYPES[tetro_t]; //２次元配列になる
    tetro_x = START_X;
    tetro_y = START_Y;
  }
  if(!checkMove(0,0)){
    over = true;
  }
  drawAll();
}


// キーボードを押した時の処理方法
document.body.onkeydown = function(e) {
  if(over)return;  //overがtrueならリターンしてキーボード操作を終了
  switch (e.keyCode) {
    case 37:  //左
      if(checkMove(-1, 0)) tetro_x--;
      break;
      case 38:  //上
      if(checkMove(0, -1)) tetro_y--;
      break;
      case 39:  //右
      if(checkMove(1, 0)) tetro_x++;
      break;
      case 40:  //下
      if(checkMove(0, 1)) tetro_y++;
      break;
    case 32:  //スペース
      let ntetro = rotate();
			if( checkMove( 0, 0, ntetro) ) tetro = ntetro;
      break;
  }
   drawAll();
}








