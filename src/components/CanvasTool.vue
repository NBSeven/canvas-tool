<template>
  <div>
    <div>
      <div style="display:flex;align-items:center;">
        <canvas
          id="canvas"
          :width="width"
          :height="height"
          @mousedown="cdown"
          @mousemove="cmove"
          @mouseup="cup"
          @dragover="dragoverCanvas($event)"
          @drop="dropCanvas($event)"
          @keydown="keyDown($event)"
          @keyup="keyUp($event)"
        ></canvas>
        <el-card
          shadow="hover"
          header="设置"
          style="min-width:500px;"
        >
          <el-form :inline="true">
            <el-form-item label="绘制类型">
              <el-button-group>
                <el-button @click="setType('rect')">矩形</el-button>
                <el-button @click="setType('arc')">圆形</el-button>
                <el-button @click="setType('pen')">画笔</el-button>
              </el-button-group>
            </el-form-item>
            <!-- el-siider放到el-item会样式错乱。。。 -->
            <el-form-item label="画布宽度">
              <el-input v-model.number="width"></el-input>
            </el-form-item>
            <el-form-item label="画布高度">
              <el-input v-model.number="height"></el-input>
            </el-form-item>
            <el-form-item
              label="画笔半径"
              style="margin-bottom:0px;"
            >
            </el-form-item>
            <el-slider v-model="pen.r"></el-slider>
            <el-form-item label="画笔颜色">
              <el-input v-model="pen.color"></el-input>
            </el-form-item>
            <el-form-item label="描边颜色">
              <el-input v-model="strokeStyle"></el-input>
            </el-form-item>
            <el-form-item label="填充颜色">
              <el-input v-model="fillStyle"></el-input>
            </el-form-item>
            <el-form-item label="x放大">
              <el-input
                v-model.number="scaleX"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="y放大">
              <el-input
                v-model.number="scaleY"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="可拖拽图片">
              <img
                :src="img?img:require('@/assets/logo.png')"
                alt="拖拽图片"
                @dragstart="dragstart($event)"
                width="200"
                height="200"
                v-for="img in imgList"
                :key="img"
              >
              <input
                type="file"
                @change="inputChange($event)"
              >
            </el-form-item>
            <el-form-item label="操作">

              <el-button
                @click="scaleDrawObj"
                type="primary"
              >缩放</el-button>
              <el-button
                type="primary"
                @click="exports"
              >导出</el-button>
              <el-button
                @click="clearCanvas()"
                type="primary"
              >清空</el-button>
            </el-form-item>
          </el-form>
        </el-card>

      </div>

    </div>

  </div>

</template>

<script>
class DrawObj {
  constructor(renderType = "rect", initProp = {}) {
    this.renderType = renderType;
    this.x = initProp.x || 0;
    this.y = initProp.y || 0;
    this.width = initProp.width || 0;
    this.height = initProp.height || 0;
    this.scaleX = initProp.scaleX || 1;
    this.scaleY = initProp.scaleY || 1;
    // this.rotate = initProp.rotate || 1
    if (renderType === "img") {
      this.imgSrc = initProp.imgSrc;
    }
    if (renderType === "pen") {
      this.linePath = initProp.linePath || [];
      this.lineWidth = initProp.lineWidth || 5;
      this.lineColor = initProp.lineColor || "black";
    }
  }
}
export default {
  name: "HelloWorld",
  data() {
    return {
      width: 800,
      height: 500,
      ctx: null, // canvas element
      down: false, // 是否在按压点击鼠标的状态
      draging: false, // 是否在拖动状态
      downObj: {
        // 鼠标点击时的对象 目前只包含坐标点
        x: 0,
        y: 0
      },
      renderList: [],
      imgList: [],
      renderType: "rect",
      strokeStyle: "#02BF0F",
      fillStyle: "rgb(2,191,15,.2)",
      keyCode: "",
      pen: {
        x: 0,
        y: 0,
        r: 10,
        color: "black"
      },
      scaleX: 1,
      scaleY: 1
    };
  },
  methods: {
    exports() {
      var image = new Image();
      image.src = document.getElementById("canvas").toDataURL("image/png");
      var anchor = document.createElement('a');
        if ('download' in anchor) {
          anchor.style.visibility = 'hidden';
          anchor.href = image.src;
          anchor.download = '1111';
          
          document.body.appendChild(anchor);
          let evt = document.createEvent('MouseEvents');
          evt.initEvent('click', true, true);
          anchor.dispatchEvent(evt);
          
          document.body.removeChild(anchor);}

      // window.location = image.src
      // window.open(image.src)
      // eslint-disable-next-line no-debugger
    },
    inputChange(event) {
      let input = event.currentTarget;
      let file = input.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        // eslint-disable-next-line no-unused-vars
        let imgSrc = e.target.result;
        this.imgList.push(imgSrc);
        // this.imgSrc = imgSrc;
        // eslint-disable-next-line no-debugger
      };
    },
    keyDown(event) {
      let keyCode = event.keyCode || event.which || event.charCode;
      // eslint-disable-next-line no-console
      // console.log(keyCode);
      this.keyCode = keyCode;
    },
    keyUp() {
      this.keyCode = "";
    },
    dragstart(event) {
      let imgData = {
        imgSrc: event.target.src,
        width: event.target.width,
        height: event.target.height
      };
      event.dataTransfer.setData("Text", JSON.stringify(imgData));
    },
    dragoverCanvas(event) {
      event.preventDefault();
    },
    dropCanvas(event) {
      event.preventDefault();
      event.stopPropagation();
      let imgData = JSON.parse(event.dataTransfer.getData("Text"));
      // this.drawImage(imgData)
      let { imgSrc, width, height } = imgData;
      this.renderList.push(
        new DrawObj("img", {
          x: 0,
          y: 0,
          width,
          height,
          imgSrc
        })
      );
      this.render();
    },
    drawImage(imgData) {
      let img = new Image();
      img.src = imgData.imgSrc;
      let { x, y, width, height } = imgData;
      img.onload = () => {
        this.ctx.drawImage(img, x, y, width, height);
      };
    },
    scaleDrawObj() {
      let drawObj = this.renderList[this.choosedIndex];
      // eslint-disable-next-line no-debugger
      if (drawObj) {
        drawObj.scaleX = this.scaleX;
        drawObj.scaleY = this.scaleY;
        this.render();
      }
    },
    /**
     * method canvas点击事件
     * @param object event 事件参数
     */
    cdown(event) {
      this.down = true;
      let { offsetX, offsetY } = event;
      // 保存点击对象 包含坐标点
      this.downObj = {
        x: offsetX,
        y: offsetY
      };
      // 判断某个对象是否被选中
      if (this.isChoosed(event)) {
        // 被选中时 获取下标并置为拖拽状态，保存其初始的坐标
        let choosedIndex = this.choosedIndex;
        this.draging = true;
        this.x = this.renderList[choosedIndex].x;
        this.y = this.renderList[choosedIndex].y;
      } else {
        this.draging = false;
        this.renderList.push(
          new DrawObj(this.renderType, {
            x: offsetX,
            y: offsetY,
            lineWidth: this.pen.r,
            lineColor: this.pen.color
          })
        );
      }
    },
    cmove(event) {
      let { offsetX, offsetY } = event;
      let { x, y } = this.downObj;
      //判断鼠标是按住左键
      if (this.down) {
        //判断某个元素是否被点击选中，如果是就对该元素进行移动，改变其坐标。
        if (this.draging) {
          let choosedIndex = this.choosedIndex;
          //如果是线条的话 暂且不做选中移动的处理
          if (this.renderList[choosedIndex].renderType === "pen") {
            return;
          }
          if (offsetX > x) {
            this.renderList[choosedIndex].x = this.x + (offsetX - x);
          } else {
            this.renderList[choosedIndex].x = this.x - (x - offsetX);
          }
          if (offsetY > y) {
            this.renderList[choosedIndex].y = this.y + (offsetY - y);
          } else {
            this.renderList[choosedIndex].y = this.y - (y - offsetY);
          }
          this.render();
        } else {
          let width = offsetX - x;
          let height = offsetY - y;
          //当为矩形或者圆形 要进行相反的绘制（也可以考虑用轴对称的方法）
          if (
            this.renderList[this.renderList.length - 1].renderType !== "pen"
          ) {
            if (width < 0) {
              x = x + width;
            }
            if (height < 0) {
              y = y + height;
            }
          }

          Object.assign(this.renderList[this.renderList.length - 1], {
            x,
            y,
            width: Math.abs(width),
            height: Math.abs(height)
          });
          //如果是画笔的话保存移动过的每一个像素点（暂时只想到这个办法去保存画笔的数据，有点类似保存path的感觉，如果长度比较长的话比较浪费性能吧）
          if (
            this.renderList[this.renderList.length - 1].renderType === "pen"
          ) {
            this.renderList[this.renderList.length - 1].linePath.push({
              x: offsetX,
              y: offsetY
            });
          }
          this.render();
        }
      }
      //如果当前为画笔那么久渲染一个圆形画笔
      if (this.renderType === "pen") {
        this.pen.x = offsetX;
        this.pen.y = offsetY;
        this.render();
      }
    },
    //鼠标放开左键事件
    cup() {
      this.down = false;
    },
    /**
     * method 判断是否点击选中，
     * @param  object event 事件对象
     * @return boolean 返回boolean值
     */
    isChoosed(event) {
      let { offsetX, offsetY } = event;
      for (let i = 0; i < this.renderList.length; i++) {
        let { x, y, width, height } = this.renderList[i];
        if (
          x < offsetX &&
          offsetX < width + x &&
          y < offsetY &&
          offsetY < y + height
        ) {
          this.choosedIndex = i;
          return true;
        }
      }
      return false;
    },
    setType(type) {
      this.renderType = type;
    },
    /**
     * 渲染图形内容
     */
    render() {
      this.ctx.strokeStyle = this.strokeStyle;
      this.ctx.fillStyle = this.fillStyle;
      this.ctx.clearRect(0, 0, this.width, this.height);
      //遍历绘制的图形数组，根据其类型进行绘制
      for (let i = 0; i < this.renderList.length; i++) {
        //取其中的坐标、宽高、渲染类型
        let {
          x,
          y,
          width,
          height,
          renderType,
          scaleX,
          scaleY
        } = this.renderList[i];
        width = width * scaleX;
        height = height * scaleY;
        switch (renderType) {
          //矩形
          case "rect":
            this.ctx.fillRect(x, y, width, height);
            break;
          //圆形
          case "arc":
            this.ctx.beginPath();
            // eslint-disable-next-line no-console
            //根据当前键盘按键是否为'ctrl'，如果按住了ctrl键那么绘制的是个正圆
            if (this.keyCode === 17 && i === this.renderList.length - 1) {
              this.renderList[i].height = this.renderList[i].width;
              let w = this.renderList[i].width;
              this.ctx.ellipse(x, y, w, w, 0, 0, Math.PI * 2);
              this.ctx.fill();
              this.ctx.strokeRect(x, y, w, w);
            } else {
              this.ctx.ellipse(x, y, width, height, 0, 0, Math.PI * 2);
              this.ctx.fill();
              this.ctx.strokeRect(x, y, width, height);
            }
            break;
          //图片
          case "img":
            this.drawImage(this.renderList[i]);
            break;
          //笔
          case "pen":
            this.ctx.strokeStyle = this.renderList[i].lineColor;
            this.ctx.fillStyle = this.renderList[i].lineColor;
            this.ctx.beginPath();
            this.ctx.lineWidth = this.renderList[i].lineWidth;
            this.ctx.moveTo(this.renderList[i].x, this.renderList[i].y);
            for (
              let index = 0;
              index < this.renderList[i].linePath.length;
              index++
            ) {
              this.ctx.lineTo(
                this.renderList[i].linePath[index].x,
                this.renderList[i].linePath[index].y
              );
            }
            this.ctx.stroke();
            break;
        }
      }
      //如果当前是笔的类型，那么渲染一个圆形,r和当前的笔相同
      if (this.renderType === "pen") {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.pen.color;
        this.ctx.arc(this.pen.x, this.pen.y, this.pen.r, 0, 2 * Math.PI);
        this.ctx.fill();
      }
    },
    /**
     * 清空
     */
    clearCanvas() {
      this.renderList = [];
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  },
  mounted() {
    this.ctx = document.getElementById("canvas").getContext("2d");
    //由于canvas无法绑定keydow以及keyup事件 那么就在window上绑定一个
    window.addEventListener("keydown", this.keyDown, true);
    window.addEventListener("keyup", this.keyUp, true);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
  background-color: #eee;
}

h1,
h2 {
  font-weight: normal;
  margin: 10px 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.hello {
  text-align: center;
  padding-top: 50px;
}

.logo-large {
  width: 200px;
}
</style>