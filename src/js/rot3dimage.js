/*
 rot3dimage v1.0.3
 (c) 2019.03 wallacety.
 github:https://github.com/wallacety/rot3dimage
 Blog:https://me.csdn.net/qq_29018891
 Emile:1506988056@qq.com
 License: M
*/


(function(){
    //祖籍元素
    var elementDIV;
    //原始参数
    var _3dPosterobj={
        hrefArr:[],
        pageImgArr:[],
        cutIntoSlicesNumber:5,//切片数目
        switchTime:"0.5",
        slicesTime:"1",
        lateralRotation:false,//是否横向旋转
        automatic:true,//是否自动切屏
        automaticTime:"3",//自动切屏时间
        changeButton:true//是否使用默认按钮
    };
    //参数：页面数量
    var pageNumber;//页数
    //li的宽高
    var liEleWidth;
    var liEleHeight;
    //ele 创建；
    //创建a标签
    var hrefAEle;
    //创建ul标签
    var ulEle;
    //创建li标签
    var liNodelist = [];//li标签集合
    window.slice3dPoster = function(){};
    slice3dPoster.setLeftEle;
    slice3dPoster.setRightEle;

    function _implement_(){
        /**
         * 为轮播模型对应位置添加属性
         * */
        function Set3dImg(itemLength) {
            //传入item数量
            var list = new Array();
            for (var a = 1; a <= itemLength; a++) {
                list.push(a);
            }
            this.list = list;
        }
        Set3dImg.prototype.setAttrBgi = function () {
            var left = this.list[this.list.length - 1];
            var right = this.list[1];
            for (var i = 0; i < liNodelist.length; i++) {
                liNodelist[i].children[(currSpan + 1) % 4].style.backgroundImage= "url('"+_3dPosterobj.pageImgArr[right-1]+"')";
                //(currSpan+1)%4是对应第一个span的朝向，现在朝上span在队列中的位置
                liNodelist[i].children[(currSpan + 3) % 4].style.backgroundImage= "url('"+_3dPosterobj.pageImgArr[left-1]+"')";
            }
        };
        Set3dImg.prototype.next = function () {
            var item = this.list.shift();
            this.list.push(item);
        };
        Set3dImg.prototype.prev = function () {
            var item = this.list.pop();
            this.list.unshift(item);
        };
        Set3dImg.prototype.sethref = function (ele,hrefArr) {
            ele.href = hrefArr[set3dimg.list[0]-1];
        }
        //ends Set3dImg
        // init
        var index = 0;//旋转次数
        var currSpan = 0;//一开始第一个span的朝向:0超前,1朝下,2朝后,3朝上
        var flag = true;//旋转完毕锁
        var set3dimg = new Set3dImg(pageNumber);//5个轮播页
        set3dimg.setAttrBgi();//添加背景图片

        // 执行切屏操作
        function _changScreen_(direction){
            if (!flag) return false;
            flag = false;
            //切屏时上锁
            if (direction == "left") {
                index--;
                var angle = -index * 90;
                currSpan--;
                if (currSpan == -1) currSpan = 3;
                set3dimg.prev();
                set3dimg.sethref(hrefAEle,_3dPosterobj.hrefArr);
            } else {
                index++;
                var angle = -index * 90;
                currSpan++;
                if (currSpan == 4) currSpan = 0;
                set3dimg.next();
                set3dimg.sethref(hrefAEle,_3dPosterobj.hrefArr);
            }
            for (var i = 0; i < liNodelist.length; i++) {
                if(_3dPosterobj.lateralRotation)
                    liNodelist[i].style.transform='rotateY(' + angle + 'deg) ';
                else
                    liNodelist[i].style.transform='rotateX(' + angle + 'deg) ';
                liNodelist[i].style.transitionDelay=i *  + _3dPosterobj.switchTime+"s";
            }
        }
        //打开锁
        liNodelist[liNodelist.length - 1].addEventListener("transitionend", function () {
            flag = true;
            set3dimg.setAttrBgi();
        });
        //自动：计时器
        (function(){
            if(_3dPosterobj.automatic){
                var dirTime = _3dPosterobj.automaticTime*1000;
                var direction_T = setInterval(function () {
                    _changScreen_("right");
                },dirTime);
                elementDIV.addEventListener("mouseover",function () {
                    clearInterval(direction_T);
                });
                elementDIV.addEventListener("mouseout",function () {
                    direction_T = setInterval(function () {
                        _changScreen_("right");
                    },dirTime);
                });
            }
        }());
        //ends 计时器
        //手动：自定义点击按钮
        slice3dPoster.setRightEle = function(ele){
            ele.style.zIndex="99";
            ele.addEventListener("click",function(){
                _changScreen_("right");
            });
        };
        slice3dPoster.setLeftEle = function(ele){
            ele.style.zIndex="99";
            ele.addEventListener("click",function(){
                _changScreen_("left");
            });
        };

        //ends 点击事件
        //手动：默认点击按钮
        (function(){
            if(_3dPosterobj.changeButton){
                // <a id="slice3dPoster-left" href="javascript:;"><</a>
                // <a id="slice3dPoster-right" href="javascript:;">></a>
                var laele = document.createElement("a");
                laele.href = "javascript:;";
                laele.id = "slice3dPoster-left";
                laele.innerText = "<";
                laele.style.zIndex = "99";
                elementDIV.appendChild(laele);
                var raele = document.createElement("a");
                raele.href = "javascript:;";
                raele.id = "slice3dPoster-right";
                raele.innerText = ">";
                laele.style.zIndex = "99";
                elementDIV.appendChild(raele);
                window.slice3dPoster.setLeftEle(laele);
                window.slice3dPoster.setRightEle(raele);

            }
        }());
    }

    Element.prototype.slice3dPoster = function (initObj) {
        /**
         * 初始化Slice3dPoster
         * */
        elementDIV = this;
        //初始化
        elementDIV.className += " Slice3dPoster";
        elementDIV.style.position = "relative";
        //初始化原始参数
        for(var k in initObj){
            _3dPosterobj[k] = initObj[k];
        }
        //参数优化
        if(_3dPosterobj.pageImgArr.length==0||_3dPosterobj.hrefArr.length==0)console.log("错误！pageImgArr与hrefArr不能为空");
        if(_3dPosterobj.pageImgArr.length != _3dPosterobj.hrefArr.length)console.log("错误！pageImgArr与hrefArr一一对应");
        elementDIV.style.borderWidth = 0;//边框清0
        _3dPosterobj.cutIntoSlicesNumber = parseInt(_3dPosterobj.cutIntoSlicesNumber);//切片数
        //参数：页面数量
        pageNumber = _3dPosterobj.pageImgArr.length;//页数
        //li的宽高
        liEleWidth = Math.floor(elementDIV.offsetWidth/_3dPosterobj.cutIntoSlicesNumber);
        liEleHeight = elementDIV.offsetHeight;
        //初始化ele
        //a标签
        hrefAEle = document.createElement('a');
        hrefAEle.href = _3dPosterobj.hrefArr[0];
        hrefAEle.id = "hrefAEle";
        elementDIV.appendChild(hrefAEle);

        //ul标签
        ulEle = document.createElement('ul');
        elementDIV.appendChild(ulEle);
        //li标签
        var liEle;
        for(var i=0 ;i<parseInt(_3dPosterobj.cutIntoSlicesNumber);i++){
            liEle = document.createElement('li');
            liEle.style.width = liEleWidth+"px";
            liEle.style.transition = "all "+_3dPosterobj.slicesTime+"s";//切片时间
            //创建span标签
            liEle.innerHTML="<span></span><span></span><span></span><span></span>";
            /*初始化第一张背景*/
            liEle.children[0].style.background = "url("+_3dPosterobj.pageImgArr[0]+") no-repeat";
            if(_3dPosterobj.lateralRotation){
                liEle.children[0].style.transform = "translateZ("+liEleWidth/2+"px)";
                liEle.children[1].style.transform = "rotateY(90deg) translateZ("+liEleWidth/2+"px)";
                liEle.children[2].style.transform = "rotateY(180deg) translateZ("+liEleWidth/2+"px)";
                liEle.children[3].style.transform = "rotateY(270deg) translateZ("+liEleWidth/2+"px)";
            }else{
                liEle.children[0].style.transform = "translateZ("+liEleHeight/2+"px)";
                liEle.children[1].style.transform = "rotateX(90deg) translateZ("+liEleHeight/2+"px)";
                liEle.children[2].style.transform = "rotateX(180deg) translateZ("+liEleHeight/2+"px)";
                liEle.children[3].style.transform = "rotateX(270deg) translateZ("+liEleHeight/2+"px)";
            }

            liEle.children[0].style.backgroundPositionX= "-"+i*liEleWidth+"PX";
            liEle.children[1].style.backgroundPositionX= "-"+i*liEleWidth+"PX";
            liEle.children[2].style.backgroundPositionX= "-"+i*liEleWidth+"PX";
            liEle.children[3].style.backgroundPositionX= "-"+i*liEleWidth+"PX";
            liNodelist.push(liEle);
            ulEle.appendChild(liEle);
        }
        // ends ele
        _implement_();
    }
}(window));


//调用方式
// document.getElementsByClassName("box")[0].slice3dPoster({
//     hrefArr:["#1","#2","#3","#4","#5"],
//     pageImgArr:["img/1.jpg","img/2.jpg","img/3.jpg","img/4.jpg","img/5.jpg"],
//     cutIntoSlicesNumber:5,
//     switchTime:0.1,//每个切片间延迟多长时间
//     slicesTime:0.5,//切片运动的时间
//     lateralRotation:false,
//     automatic:true,//是否自动切屏
//     automaticTime:3,//自动切屏时间
//     changeButton:false
// });