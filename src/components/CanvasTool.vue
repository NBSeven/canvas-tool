<template>
  <div>
    <div>
      <el-button-group>
        <el-button @click="setType('rect')">矩形</el-button>
        <el-button @click="setType('arc')">圆形</el-button>
        <el-button @click="setType('pen')">画笔</el-button>
        <el-button @click="clearCanvas()">清空</el-button>
      </el-button-group>
      <img
        src="@/assets/logo.png"
        alt=""
        @dragstart="dragstart($event)"
      >
    </div>
    <canvas
      id="canvas"
      width="500"
      height="500"
      @mousedown="cdown"
      @mousemove="cmove"
      @mouseup="cup"
      @dragover="dragoverCanvas($event)"
      @drop="dropCanvas($event)"
    ></canvas>
  </div>
    
</template>

<script>
class DrawObj {
  constructor (x = 0, y = 0, width = 100, height = 100, imgSrc = '', renderType = 'rect') {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.imgSrc = imgSrc
    this.renderType = renderType
  }
}
export default {
  name: 'HelloWorld',
  data () {
    return {
      ctx: null, // canvas element
      down: false, // 是否在按压点击鼠标的状态
      draging: false, // 是否在拖动状态
      downObj: {
        // 鼠标点击时的对象 目前只包含坐标点
        x: 0,
        y: 0
      },
      renderList: [],
      renderType: 'rect'
    }
  },
  methods: {
    dragstart (event) {
      let imgData = {
        imgSrc: event.target.src,
        width: event.target.width,
        height: event.target.height
      }
      event.dataTransfer.setData('Text', JSON.stringify(imgData))
    },
    dragoverCanvas (event) {
      event.preventDefault()
    },
    dropCanvas (event) {
      event.preventDefault()
      event.stopPropagation()
      let imgData = JSON.parse(event.dataTransfer.getData('Text'))
      // this.drawImage(imgData)
      let { imgSrc, width, height } = imgData
      this.renderList.push(new DrawObj(0, 0, width, height, imgSrc, 'img'))
      this.render()
    },
    drawImage (imgData) {
      let img = new Image()
      img.src = imgData.imgSrc
      let { x, y, width, height } = imgData
      img.onload = () => {
        this.ctx.drawImage(img, x, y, width, height)
      }
    },
    /**
     * method canvas点击事件
     * @param object event 事件参数
     */
    cdown (event) {
      this.down = true
      let { offsetX, offsetY } = event
      // 保存点击对象 包含坐标点
      this.downObj = {
        x: offsetX,
        y: offsetY
      }
      // 判断某个对象是否被选中
      if (this.isChoosed(event)) {
        // 被选中时 获取下标并置为拖拽状态，保存其初始的坐标
        let choosedIndex = this.choosedIndex
        this.draging = true
        this.x = this.renderList[choosedIndex].x
        this.y = this.renderList[choosedIndex].y
      } else {
        this.draging = false
        this.renderList.push({
          x: offsetX,
          y: offsetY,
          width: 0,
          height: 0,
          renderType: this.renderType
        })
      }
    },
    cmove (event) {
      let { offsetX, offsetY } = event
      let { x, y } = this.downObj
      if (this.down) {
        if (this.draging) {
          let choosedIndex = this.choosedIndex
          if (offsetX > x) {
            this.renderList[choosedIndex].x = this.x + (offsetX - x)
          } else {
            this.renderList[choosedIndex].x = this.x - (x - offsetX)
          }
          if (offsetY > y) {
            this.renderList[choosedIndex].y = this.y + (offsetY - y)
          } else {
            this.renderList[choosedIndex].y = this.y - (y - offsetY)
          }
          this.render()
        } else {
          let width = offsetX - x
          let height = offsetY - y
          if (width < 0) {
            x = x + width
          }
          if (height < 0) {
            y = y + height
          }
          Object.assign(this.renderList[this.renderList.length - 1], {
            x,
            y,
            width: Math.abs(width),
            height: Math.abs(height)
          })

          this.render()
        }
      }
    },
    cup () {
      this.down = false
      this.render()
    },
    /**
     * method 判断是否点击选中，
     * @param  object event 事件对象
     * @return boolean 返回boolean值
     */
    isChoosed (event) {
      let { offsetX, offsetY } = event
      for (let i = 0; i < this.renderList.length; i++) {
        let { x, y, width, height } = this.renderList[i]
        if (
          x < offsetX &&
          offsetX < width + x &&
          y < offsetY &&
          offsetY < y + height
        ) {
          this.choosedIndex = i
          return true
        }
      }
      return false
    },
    setType (type) {
      this.renderType = type
    },
    render () {
      this.ctx.strokeStyle = '#02BF0F'
      this.ctx.fillStyle = 'rgb(2,191,15,.2)'

      this.ctx.clearRect(0, 0, 500, 500)

      for (let i = 0; i < this.renderList.length; i++) {
        let { x, y, width, height, renderType } = this.renderList[i]
        if (this.down) {
          switch (renderType) {
            case 'rect':
              this.ctx.fillRect(x, y, width, height)
              break
            case 'arc':
              this.ctx.beginPath()
              this.ctx.arc(x, y, height, 0, 2 * Math.PI)
              this.ctx.fill()
              break
            case 'img':
              this.drawImage(this.renderList[i])
              break
          }
        } else {
          switch (renderType) {
            case 'rect':
              this.ctx.strokeRect(x, y, width, height)
              break
            case 'arc':
              this.ctx.beginPath()
              this.ctx.arc(x, y, height, 0, 2 * Math.PI)
              this.ctx.stroke()
              break
            case 'img':
              this.drawImage(this.renderList[i])
              break
          }
        }
      }
    },
    clearCanvas () {
      this.renderList = []
      this.ctx.clearRect(0, 0, 500, 500)
    }
  },
  mounted () {
    this.ctx = document.getElementById('canvas').getContext('2d')
  }
}
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
