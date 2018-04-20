require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// 获取图片相关数据
let imageDatas = require('../data/imageDatas.json');

// 利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
  for(let i = 0, j = imageDatasArr.length; i < j; i++) {
    let singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

/**
 * 获取区间内的一个随机值
 */
let getRangeRandom = (low, high) => {
  return Math.ceil(Math.random() * (high - low) + low);
}

/**
 * 设置0~30度之间的一个任意正负值
 */
let get30DegRandom = () => {
  return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

class ImgFigure extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }
  /**
   * imgFigure的点击处理函数
   */
  handleClick(e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    var styleObj = {};
    // 如果props属性中指定了这张图片的位置，则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    // 如果旋转角度有值并且不为0,添加旋转角度
    if (this.props.arrange.rotate) {
      (['Webkit', 'Moz', 'Ms', '']).forEach((item) => {
        styleObj[`${item}Transform`] = `rotate(${this.props.arrange.rotate}deg)`;
      })
    }
    // 设置居中图片的z-index值
    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }
    // 添加翻转的className
    let imgFigureClassName = 'img-figure ';
        imgFigureClassName += this.props.arrange.isInverse ? 'is-inverse' : '';
    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
}

class AppComponent extends React.Component {
  
  constructor(props) {
    super(props);
    // 定义范围
    this.Constant= {
      centerPos: {
        left: 0,
        right:0
      },
      hPosRange: { // 水平方向的取值范围
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: { //垂直方向的取值范围
        x: [0, 0],
        topY: [0, 0]
      }
    };

    this.state = {
      imgsArrangeArr: [
        {
         /*  pos: {
            top: '0',
            left: '0'
          },
          rotate: 0, // 设置旋转角度
          isInverse: false, //表示图片正反面，默认正面
          isCenter: false // 图片是否居中，默认不居中 */
        }
      ]
    }
  }

  /**
   * 翻转图片
   * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
   */
  inverse(index) {
    return () => {
      let imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }
  }
  /**
   * 重新布局所有图片
   * @param centerIndex 指定居中排布哪个图片
   */
  rearrange(centerIndex) {
    // console.log(centerIndex);
    let imgsArrangeArr = this.state.imgsArrangeArr;
    let Constant = this.Constant;
    // console.log(Constant)
    let centerPos = Constant.centerPos;
    let hPosRange = Constant.hPosRange;
    let vPosRange = Constant.vPosRange;
    // console.log(Constant.hPosRange)
    let hPosRangeLeftSecX = hPosRange.leftSecX;
    let hPosRangeRightSecX = hPosRange.rightSecX;
    let hPosRangeY = hPosRange.y;
    let vPosRangeTopY = vPosRange.topY;
    let vPosRangeX = vPosRange.x;

    let imgsArrangeTopArr = []
    let topImgNum = Math.ceil(Math.random() * 2); //上侧区域去1个或者不取
    // console.log('topImgNum:', topImgNum);
    let topImgSpliceIndex = 0;

    let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    // 首先居中centerIndex的图片
    // 居中的centerIndex的图片不需要旋转
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    }


    // 取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    // 布局上侧的图片
    imgsArrangeTopArr.forEach((item, index) => {
      imgsArrangeTopArr[index] = {
        pos : {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
      // console.log('%c:::imgsArrangeTopArr', 'background:red;font-size:30px', index, imgsArrangeTopArr[index])
    })

    //布局左右两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;
      // 前半部分布局左边，右半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }
      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
      // console.log('%c:::imgsArrangeArr', 'background:red;font-size:30px', imgsArrangeArr[i])
    }

    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr:imgsArrangeArr
    });
  }

  // 组件加载完成之后，为每张图片计算位置的范围
  componentDidMount() {
    // 首先获取舞台的大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage)
    let stageW = stageDOM.scrollWidth;
    let stageH = stageDOM.scrollHeight;
    let halfStageW = Math.ceil(stageW / 2);
    let halfStageH = Math.ceil(stageH / 2);

    // 拿到一个imgFirgure的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
    let imgW = imgFigureDOM.scrollWidth;
    let imgH = imgFigureDOM.scrollHeight;
    let halfImgW = Math.ceil(imgW / 2);
    let halfImgH = Math.ceil(imgH / 2);

    // 计算中心点的值
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }
    // 计算左侧，右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[0] = stageH - halfImgH;

    // 上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH *3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

  /**
   * 利用 rearrange函数，居中对应index图片
   * @param index,需要被居中的图片对应的图片信息数组的index的值
   */
  center(index) {
    return () => {
      this.rearrange(index);
    }
  }

  render() {
    let controllerUnits = [];
    let imgFigures = [];

    imageDatas.forEach((item, index) => {

      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }
      imgFigures.push(<ImgFigure data={item} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />)
    });

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <section className="controller-nav">
          {controllerUnits}
        </section>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
