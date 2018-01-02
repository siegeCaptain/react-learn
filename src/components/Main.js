require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom'

//获取图片相关数据
let imageDatas = require('../data/imageDatas.json');

//利用自执行函数获取图片的url信息
imageDatas = ((imageDatasArr) => {
  for (let i=0, j=imageDatasArr.length; i<j; i++) {
    let singleImageData = imageDatasArr[i];
    singleImageData.imageUrl = require('../images/'+singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

//获取区间内的一个随机值
var getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);
//获取0-30°之间一个任意正负值
var get30DegRandom = () => {
  let deg = '';
  deg = (Math.random() > 0.5) ? '+' : '-';
  return deg + Math.ceil(Math.random() * 30);
};

class ImageFigure extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  /*
   *imgsFigure的点击处理函数
   */
  handleClick(e) {
    //翻转和居中图片
    if (this.props.arrange.isCenter) {
      this.props.inverse()
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }
  render() {
    let styleObj = {};
    //如果props属性中指定了这张图片的位置,则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    //如果图片的旋转角度有值并且不为0，添加旋转角度
    if (this.props.arrange.rotate) {
      (['Moz', 'Ms', 'Webkit', '']).forEach((value) => {
        styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      })
    }

    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    let imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse ' : '';

    let props = this.props;
    return (
      <figure className={imgFigureClassName} style={ styleObj } onClick={this.handleClick}>
        <img src={props.data.imageUrl} alt={props.data.title}/>
        <figcaption>
          <h2 className="img-title">{props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

class ControllerUnit extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    //如果点击的是当前正在选中态的按钮，则反转图片，否则将对应图片居中
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    let controllerUnitsClassName = 'controller-unit';
    //显示居中态
    if(this.props.arrange.isCenter) {
      controllerUnitsClassName += ' is-center';
      //同时是翻转态
      if (this.props.arrange.isInverse) {
        controllerUnitsClassName += ' is-inverse';
      }
    }
    return (
      <span className={controllerUnitsClassName} onClick={this.handleClick}></span>
    );
  }
}

class AppComponent extends React.Component {

  constructor(props) {
    super(props);
    this.Constant = {
      centerPos: {
        left: 0,
        top: 0
      },
      hPosRange: { //水平方向的取值范围
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: { //垂直方向
        x: [0, 0],
        topY: [0, 0]
      }
    };
    this.state = {
      imgsArrangeArr: [
        //{
        //  pos:{
        //    left:'0',
        //    top:'0'
        //  },
        //    rotate:0, //旋转角度
        //isInverse:false //正反面
        //isCenter:false 图片是否居中
        //}
      ]
    };
  }

  //翻转图片的函数
  inverse(index) {
    return () => {
      let imgsArrangArr = this.state.imgsArrangeArr;
      imgsArrangArr[index].isInverse = !imgsArrangArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangArr
      })
    }
  }

  //重新布局所有图片
  reArrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      imgsArrangTopArr = [],
      topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
      topImgSpiceIndex = 0,
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
    //首先居中centerIndex图片 ,centerIndex图片不需要旋转
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    };
    //取出要布局上测的图片的状态信息
    topImgSpiceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangTopArr = imgsArrangeArr.splice(topImgSpiceIndex, topImgNum);
    //布局位于上侧的图片
    imgsArrangTopArr.forEach((value, index) => {
      imgsArrangTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };
    });

    //布局左两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      //前半部分布局左边,右边部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX
      }
      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };
    }
    if (imgsArrangTopArr && imgsArrangTopArr[0]) {
      imgsArrangeArr.splice(topImgSpiceIndex, 0, imgsArrangTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }

  /*利用reArrange函数
   *居中对应index的图片
   *
   */
  center(index) {
    return () => {
      this.reArrange(index);
    }
  }

  //组建加载以后，为每个图片分配位置
  componentDidMount() {
    //拿到stage元素
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    //拿到一个imgFigure的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    //中心图片的位置
    this.Constant.centerPos = {
      left : halfStageW-halfImgW,
      top : halfStageH-halfImgH
    };

    //计算左侧,右侧区域图片排布的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上测区域图片排布的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.reArrange(0);
  }

  render() {

    let controllerUnits = [],
      imageFigures = [];

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
      imageFigures.push(<ImageFigure data={item} key={index} ref={'imgFigure'+index}
                                     arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}
                                     center={this.center(index)} />);

      controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]}
                                           inverse={this.inverse(index)} center={this.center(index)} />);
    });

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imageFigures}
        </section>
        <nav className="img-controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
