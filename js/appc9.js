document.addEventListener('deviceready', onDeviceReady, false);
//$('#menu').addEventListener('touchmove',onMoveUpDown,false);
function onDeviceReady(){
    navigator.splashscreen.hide();
    //注册后退按钮
    document.addEventListener("backbutton", function (e) {
        if(J.hasMenuOpen){
            J.Menu.hide();
        }else if(J.hasPopupOpen){
            J.closePopup();
        }else{
            var sectionId = $('section.active').attr('id');
            if(sectionId == 'index_section'){
                J.confirm('提示','是否退出程序？',function(){
                    navigator.app.exitApp();
                });
            }else{
                window.history.go(-1);
            }
        }
    }, false);
}
function onMoveUpDown(e){
    e.stopPropagation(); //add 23:30
    e.preventDefault();
}

// 用于Product
var Product = {
    arr:[],
    clickCurrent:0,
    data:[],
    shareInit:0
};


// 用于 news 数据
var News ={
    data:[],
    current:0,
    shareInit:0
};


var Souvenir = {
    current:0,
    maxLen:0,
    data:null
};

var History ={
    data:[],
    current:0,
    shareInit:0
};

var Share = {
    data:[
        {
            name:"WECHAT",
            isBound:false
        },
        {
            name:"MOMENT",
            isBound:true
        },
        {
            name:"WEIBO",
            isBound:false
        },
        {
            name:"INSTAGRAM",
            isBound:false
        },
        {
            name:"FACEBOOK",
            isBound:true
        },
        {
            name:"TWITTER",
            isBound:true
        }
    ],
    init:function(sectionId,sectionObj){
        var theData = {};
        theData.list = this.data;
        $("#"+sectionId+"_detail_section .btn_share").on("touchstart",function(){

            if(!sectionObj.shareInit){
                console.log(sectionObj.shareInit);
                J.tmpl("#"+sectionId+"_detail_section",sectionId+'_share_template',theData,"add");
                sectionObj.shareInit = 1;
                setTimeout(function(){
                    $("#"+sectionId+"_detail_section .close_share").on("touchstart",function(){
                        var $lisapp = $("#"+sectionId+"_detail_section .lis_app");
                        $lisapp.addClass("lis_app_close");
                        setTimeout(function(){
                            J.anim("#"+sectionId+"_share_section",'opacityOut',function(){
                                $(this).hide();
                                $lisapp.removeClass("lis_app_close");
                            });
                        },500);
                    });
                },200);
            }
            else{
                $("#"+sectionId+"_share_section").show();
            }
        });
    },
    init2:function(sectionId,sectionObj){
        var theData = {};
        theData.list = this.data;
        $("#"+sectionId+"_section .btn_share,#"+sectionId+"_section .btn_share_big").on("touchstart",function(){

            if(!sectionObj.shareInit){
                console.log(sectionObj.shareInit);
                J.tmpl("#"+sectionId+"_section",sectionId+'_share_template',theData,"add");
                sectionObj.shareInit = 1;
                setTimeout(function(){
                    $("#"+sectionId+"_section .close_share").on("touchstart",function(){
                        var $lisapp = $("#"+sectionId+"_section .lis_app");
                        $lisapp.addClass("lis_app_close");
                        setTimeout(function(){
                            J.anim("#"+sectionId+"_share_section",'opacityOut',function(){
                                $(this).hide();
                                $lisapp.removeClass("lis_app_close");
                            });
                        },500);
                    });
                },200);
            }
            else{
                $("#"+sectionId+"_share_section").show();
            }
        });
    }
}

var App = (function(){
    var pages = {};
    var run = function(){
        $.each(pages,function(k,v){
            var sectionId = '#'+k+'_section';
            $('body').delegate(sectionId,'pageinit',function(){
                v.init && v.init.call(v);
            });
            $('body').delegate(sectionId,'pageshow',function(e,isBack){
                //页面加载的时候都会执行
                v.show && v.show.call(v);
                //后退时不执行
                if(!isBack && v.load){
                    v.load.call(v);
                }
            });
        });
        J.Transition.add('flip','slideLeftOut','flipOut','slideRightOut','flipIn');
        Jingle.launch({
            showWelcome : true,
            showPageLoading : true,
            remotePage : {
                '#about_section' : 'remote/about_section.html'
            }
        });

    };
    var page = function(id,factory){
        return ((id && factory)?_addPage:_getPage).call(this,id,factory);
    }
    var _addPage = function(id,factory){
        pages[id] = new factory();
    };
    var _getPage = function(id){
        return pages[id];
    }
    //动态计算chart canvas的高度，宽度，以适配终端界面
    var calcChartOffset = function(){
        return {
            height : $(document).height() - 44 - 30 -60,
            width : $(document).width()
        }

    }
    return {
        run : run,
        page : page,
        calcChartOffset : calcChartOffset
    }
}());
App.page('index',function(){
    this.init = function(){
        //$('#btn_show_welcome').on('tap', J.Welcome.show);
        var $btnMusic = $('.volume_medium'),audio,n=0;
        audio = document.createElement("audio");
        audio.src = "/music/bg.mp3";
        if (audio != null && audio.canPlayType && audio.canPlayType("audio/mpeg"))
        {
            audio.play();
            audio.addEventListener('ended', function () {
                setTimeout(function () { audio.play(); }, 500);
            }, false);
            //$(audio).insertAfter($btnMusic);
        }
        $("#index_section").on("touchstart",function(){
            if(n==0){
                audio.play();
                n++;
            }
        });
        $btnMusic.on(" touchstart",function(){
            if(n%2 == 0){
                $btnMusic.addClass('volume_no');
                audio.pause();
            }
            else{
                $btnMusic.removeClass('volume_no');
                audio.play();
            }
            n++;
        });

    }
})

App.page('partner',function(){
    this.init = function(){
        console.log("这里是partner");
        partnerBd._init();
        var count = 1;
        $('#mySite').click(function(){
            //J.showToast('正在获取我的位置');
            J.showMask("Positioning..");
            partnerBd.clickSite = true;
            count = 1;
            partnerBd.getSite(partnerBd.mainMap);
        });
        $('#btn_search').on("touchstart",function(event){
            var _self = partnerBd,cityData={},cityNum = _self.currentCityNum;
            cityData.searre= _self.cityArr;

            $('#partner_search_article').show();
            $(".search_pt").css("opactiy","0");
            J.anim("#partner_search_article","opacityIn",function(){
                $(".search_pt").css("opactiy","1");
                //J.anim(".search_pt","slideUpIn");
                J.tmpl(".search_lis",'search_template',cityData,"replace");
                setTimeout(function(){
                    if(cityData.isGPS){
                        $(".search_lis").addClass("search_lis_GPS");
                    }
                },300);
                _self.searchArr = _self.cityArr;
            });

        });
        $('#tag_close_popup').on("touchstart",function(event){
            var _self = partnerBd;
            J.anim(".search_pt","slideDownOut",function(){
                $('#partner_search_article').hide();
                J.anim("#partner_search_article","opacityOut");
            });

        });
        $('#partnerLis').on("touchstart",function(event){
            var num,item;
            item = $(event.target).parents('.partner_item');
            num =parseInt($($(item).find('.rank')).text()) - 1;
            partnerBd._current = num;
        });
        $('.search_lis').on("touchstart",function(event){
            var num,item,_self= partnerBd;
            item = $(event.target).parents('.search_item');
            num =$(item).index();
            if(_self.searchArr[num].isCity){
                _self.searchCity = _self.searchArr[num].city;
                _self._resultLocal = findCityPartners(_self.searchCity,_self.partnerArr);
            }else{
                _self._current = 0;
                _self._resultLocal = [];
                _self._resultLocal.push(_self.searchArr[num]);
            }

        });
        $('.search_input').change(function(event){
            var word = $(this).val(),lis={searre:0},_self = partnerBd;
            if(word!==""){
                _self.searchArr = lis.searre = searchWord(word,_self.cityArr,_self.partnerArr);

            }else{
                _self.searchArr = lis.searre= _self.cityArr;
            }
            J.tmpl(".search_lis",'search_template',lis,"replace");
            setTimeout(function(){
                J.Scroll('.search_result');
            },100);
        });
        $('.btn_search_input').on('touchstart',function(){
            var word = $(this).val(),lis={searre:0},_self = partnerBd;
            if(word!==""){
                _self.searchArr = lis.searre = searchWord(word,_self.cityArr,_self.partnerArr);

            }else{
                _self.searchArr = lis.searre= _self.cityArr;
            }
            J.tmpl(".search_lis",'search_template',lis,"replace");
            setTimeout(function(){
                J.Scroll('.search_result');
            },100);
        });
        $('.btn_more').on('touchstart',function(){
            var _self = partnerBd,result10 = {},resultlast = _self.lastPartner,resultlastPart = resultlast.partners,
                sectionID = "partner",i,partTemp,point,iconObj = _self.defaultIconObj,map=_self.mainMap,showNum = _self.showPartnerNum,mark,count ;
            _self.lastCount = _self.lastCount + 1;
            count = _self.lastCount;
            result10.partners = [];
            result10.clickable = _self.clickSite;
            if(resultlastPart.length<=showNum){
                result10.partners = resultlastPart;
                $('.'+_self.showLastClass).hide();
            }else{
                result10.partners = resultlastPart.splice(0,showNum);
                console.log(result10.partners);
            }
            for(i = 0;i<result10.partners.length;i++){
                partTemp = result10.partners[i];
                point = new BMap.Point(partTemp.lng,partTemp.lat);
                mark = addMarker(iconObj,point,map);
                mark.addEventListener("click",markEvent(i+10*count));
            }
            J.tmpl('#'+sectionID+'Lis',sectionID+'_template',result10,"add");
            setTimeout(function(){
                J.Scroll($('#'+sectionID+'_article'));
            },400);
        });
    }
    this.show = function(){
        //console.log("dd");
        var _self = partnerBd;
        _self.findnear = 0;
        if(_self._resultLocal.length&&_self._resultLocal[0].cityNum!=_self.currentCityNum){
            console.log("dd");
            _self._resultLocal = findCityPartners(_self.currentCityNum,_self.partnerArr);
        }
    }
});

App.page('partner_list',function(){
    this.init = function(){
        $('#partnerListLis').on("touchstart",function(event){
            var num,item;
            item = $(event.target).parents('.partner_list_item');
            num =parseInt($($(item).find('.rank')).text()) - 1;
            partnerBd._current = num;
        });
    }
    this.show = function(){
        var result = {},_self = partnerBd;
        result.city = _self.searchCity;
        result.partners = _self._resultLocal;
        J.tmpl(".partner_list_lis" ,"partner_list_template" ,result,"replace");
    }
});

App.page('partner_detail',function(){
    this.init = function(){

        console.log("这里是partner_detail");
        Share.init("partner",partnerBd);
        J.Refresh({
            selector : '#partner_detail_article',
            type : 'pullUp',
            pullText : '继续上拉到下一个商户',
            releaseText : '什么时候你才愿意放手？',
            callback : function(){
                var scroll = this;
                setTimeout(function () {
                    partnerBd._current = partnerBd._current+1;
                    if(partnerBd._current<partnerBd._maxLen){
                        partnerReflash();
                        scroll.refresh();
                        scroll.scrollTo(0,0,20);
                        J.showToast('更新成功','success');
                    }else{
                        $('.pull_scroll_label').text("到底了");
                        J.showToast('到底了','success');
                    }

                }, 2000);
            }
        });

    };

    this.show = function(){
        var map = new BMap.Map("partmap"),current,local,_self = partnerBd;
        if(_self.findnear){
            _self.nearestPart(map,function(){
                current = _self._current;
                local = _self._resultLocal;
                console.log(_self._resultLocal);
                partnerReflash(map,current,local);
                _self._maxLen = local.length;
                //_self.findnear = 0;
            });
        }else{
            current = _self._current;
            local = _self._resultLocal;
            partnerReflash(map,current,local);
            _self._maxLen = local.length;
        }
    }
    function partnerReflash(map,current,local,isbus){
        var current =current||partnerBd._current;
        var local = local||partnerBd._resultLocal;
        var map = map|| new BMap.Map("partmap");
        var icon,_self = partnerBd,point,origin = partnerBd.mySitePoint,isbus = isbus||0,mark;
        point = new BMap.Point(local[current].lng,local[current].lat);
        if(origin.lng&&origin.lat){
            map.centerAndZoom(origin, 12);
            if(local[current].distance){
                if(local[current].distance>10000){
                    isbus = 2;
                }
                else if(local[current].distance>1000){
                    isbus = 1;
                }
            }
            _self.routePolicy(map,origin,point,isbus);
            if(current<11){
                mark = addMarker(_self.levelBIconObj[current],point,map);
            }else{
                mark = addMarker(_self.defaultBIconObj,point,map);
            }
            mark.setOffset(new BMap.Size(0,34));
            _self.showInfoWinSearch(map,local[current]);
        }
        else{
            map.centerAndZoom(point, 16);
            if(current<11){
                mark = addMarker(_self.levelBIconObj[current],point,map);
            }else{
                mark = addMarker(_self.defaultBIconObj,point,map);
            }
            mark.setOffset(new BMap.Size(0,34));
            _self.showInfoWinSearch(map,local[current]);

        }
        console.log(local[current]);
        J.tmpl(".detail_content" ,"partner_content_template" ,local[current],"replace");
        /*$('.tit_partner').text(local[current].name);
         $('.de_par_time').text(local[current].duration);
         $('.detail_content .mes2 span').text(local[current].phone);
         $('.btn_tele').attr("href","tel:"+local[current].phone);
         $('.detail_content .mes1').text(local[current].address);
         $('.detail_content .mes3').text(local[current].desc);*/
        setTimeout(function(){
            J.Scroll("#partner_detail_article");
        },300);
    }


});


//http://120.24.85.210/api/getSouvenir.php?callback=?
App.page('souvenir',function(){
    this.init = function(){
        //var url = 'http://120.24.85.210/api/getSouvenir.php?callback=?';
        var url = 'api/getSouvenir.php';
        console.log("这里是Souvenir");
        J.showMask();
        $.ajax({
            url : url,
            timeout : 20000,
            //dataType : 'jsonp',
            success : function(data){
                data = JSON.parse(data);
                Souvenir.data =data;
                Souvenir.maxLen = Souvenir.data.data.length;
                J.hideMask();
                J.tmpl(".souvenir_lis",'souvenir_template',Souvenir.data,"replace");
                setTimeout(function(){
                    $('#souvenirLis').on("touchstart",function(event){
                        var num,item;
                        item = $(event.target).parents('.souvenir_it');
                        num =$(item).index();
                        Souvenir.current = num;
                    });
                    J.Scroll($("#souvenir_article"));
                },400);
            },
            error:function(xhr, errorType, error){
                console.log(error);
            }
        });
    }
});

App.page('souvenir_detail',function(){
    this.init = function(){
        Share.init("souvenir",Souvenir);
        var inputName = ["name","date","telephone","email","addr","number"],i = 0,len = inputName.length,$inputArr = $("#souvenir_form_pt input"),temp;
        for(i = 0;i<len;i++){
            temp =localStorage.getItem(inputName[i]);
            console.log(temp);
            if(temp){
                $($inputArr[i]).val(temp);
            }
        }

        $("#souvenir_form_pt .btn_submit").on("touchstart",function(event){
            var inputLis = [],array=["姓名：","出生日期：","联系电话：","E-mail:","地址：","数量："], i,mess,reg=/[\,\?\'(\<*\>)]/,
                subject = "订购 "+$("#souvenir_detail_section .souvenir_tit").text()+" 信息";

            for(i = 0;i<array.length;i++){
                inputLis[i]=$("#"+inputName[i]).val();
                array[i]+=inputLis[i];
            }
            if(inputLis[0]&&inputLis[1]&&inputLis[2]&&inputLis[3]&&inputLis[4]){
                for(i = 0;i<array.length;i++){
                    if(reg.test(inputLis[i])){
                        J.showToast(array[i]+"输入不能包括特殊符号！");
                        event.preventDefault();
                        return false;
                    }
                }
                mess = array.join("%0d%0a");
                $(this)[0].href="mailto:sample@163.com"+"?subject="+subject+"&Body="+mess;
            }else{
                for(i = 0;i<array.length;i++){
                    if(!inputLis[i]){
                        J.showToast(array[i]+"没有填写！");
                        $("#"+inputName[i]).focus();
                    }
                }
                event.preventDefault();
                return false;
            }

        });
        $("#souvenir_form_pt").on("blur","input",function(event){
            localStorage.setItem(event.target.id,$(event.target).val());
        }).on("focus","input",function(event){
            $(event.target).val("");
        });
        $(".souvenir_form .btn_close").on("touchstart",function(event){
            $("#souvenir_form_section").removeClass("active");
        });
        /*$(".btn_submit").on("touchstart",function(event){
         console.log("dfdf");

         });*/
    };
    this.show = function(){
        var slider;
        console.log("这里是Souvenir_detail");
        J.showMask();

        J.tmpl(".souvenir_item_wrap",'souvenir_detail_template',Souvenir.data.data[Souvenir.current],"replace");
        setTimeout(function(){
            slider = new J.Slider({
                selector : '#slidePics',
                showDots : false,
                onBeforeSlide : function(){
                    return true;
                },
                onAfterSlide : function(i){
                    //alert(i);
                    J.hideMask();
                    $('.pic_nav .dot').text(i+1);
                    var per = 25*i;
                    $('.line').css('left',per+'%');
                }
            });
            $(".souvenir_cont .btn_buy").on("touchstart",function(event){
                $("#souvenir_form_section").addClass("active");
            });


            J.Scroll($("#souvenir_detail_article"));
        },400);


    }

});
App.page('product',function(){
    this.init = function(){
        console.log("这里是product");
        //var url = 'http://120.24.85.210/api/getProducts.php?callback=?';
        var url = 'api/getProducts.php';
        J.showMask();
        $.ajax({
            url : url,
            //dataType : 'jsonp',
            timeout : 20000,
            success : function(data){
                data = JSON.parse(data);
                Product.data =data;
                //console.log(Product.data);
                Product.maxLen = Product.data.length;
                J.hideMask();
                J.tmpl(".product_lis",'product_template',Product.data,"replace");
                setTimeout(function(){
                    Product.arr = Product.data.data;
                    J.Scroll($("#product_article"));
                },400);
            },
            error:function(xhr, errorType, error){
                console.log(error);
            }
        });
        $('#productLis').on("touchstart",function(event){
            var num,item;
            item = $(event.target).parents('.pro_it');
            num =$(item).index();
            Product.clickCurrent = num;
        });
    }
});

App.page('product_detail',function(){
    this.init = function(){
        Share.init("product",Product);

    };
    this.show = function(){
        var i = Product.clickCurrent,item = Product.arr[i];
        J.tmpl("#product_detail_article .detail_wrap",'product_detail_template',item,"replace");
        setTimeout(function(){
            $(".btn_buy").on("touchstart",function(){
                console.log("ddd");
                partnerBd.findnear = 1;
            });
        },500);
    }
});

App.page('news',function(){
    this.init = function(){
        //var url = 'http://120.24.85.210/api/getNews.php?callback=?';
        var url = 'api/getNews.php';
        console.log("这里是news");
        $.ajax({
            url : url,
            //dataType : 'jsonp',
            timeout : 20000,
            success : function(data){
                data = JSON.parse(data);
                News.data =data;
                News.maxLen = News.data.data.length;
                picWordArr(News.data.data);
                console.log(News.data);
                J.hideMask();
                J.tmpl("#newsLis",'news_template',News.data,"replace");
                setTimeout(function(){
                    $('#newsLis').on(" touchstart",function(event){
                        var num,item;
                        item = $(event.target).parents('.news_it');
                        num =$(item).index();
                        News.current = num;
                    });
                    J.Scroll($("#news_article"));
                },400);
            },
            error:function(xhr, errorType, error){
                console.log(error);
            }
        });
    }
});

App.page('news_detail',function(){
    this.init = function(){
        console.log("这里是news_detail");
        Share.init("news",News);

        J.Refresh({
            selector : '#news_detail_article',
            type : 'pullUp',
            pullText : '继续上拉到下一个新闻',
            releaseText : '什么时候你才愿意放手？',
            callback : function(){
                var scroll = this;
                setTimeout(function () {
                    News.current = News.current+1;
                    if(News.current==News.maxLen){
                        News.current = 0;
                        $('.pull_scroll_label').text("到底了！返回第一条");
                    }
                    J.tmpl(".news_detail_wrap",'news_detail_template',News.data.data[News.current],"replace");
                }, 2000);
                setTimeout(function () {
                    //scroll.refresh();
                    J.Scroll($("#news_detail_article"));
                    scroll.scrollTo(0,0,20);
                    if(News.current ==0){
                        J.showToast('到底了！返回第一条','success');
                    }
                    else{
                        J.showToast('更新成功','success');
                    }
                }, 2400);
            }
        });

    }
    this.show = function(){
        J.showMask();

        J.tmpl(".news_detail_wrap",'news_detail_template',News.data.data[News.current],"replace");
        setTimeout(function(){
            J.Scroll($("#news_detail_article"));
            J.hideMask();
        },400);

    }

});
App.page('history',function(){
    this.init = function(){
        //J.showMask();
        Share.init2("history",History);
        //var url = 'http://120.24.85.210/api/getHistory.php?callback=?';
        console.log("这里是news");
        /*$.ajax({
         url : url,
         dataType : 'jsonp',
         timeout : 20000,
         success : function(data){
         //J.tmpl("#history_article .his_slide5_wr",'history_template',data,"replace");
         setTimeout(function(){
         var mySwiper = new Swiper('.history_container',{
         slideClass:'his_slide',
         wrapperClass:'history_wrapper',
         mode: 'vertical',
         slideActiveClass:'his_slide_active'
         });
         },500);
         setTimeout(function(){
         var mySwiper2 = new Swiper('.pic_slider1',{
         slidesPerView: 'auto',
         slideClass:'pic_slide',
         slideActiveClass:'pic_slide_active',
         wrapperClass:'pic_slideshow_wr',
         loop: true,
         autoplay: 4500,
         autoplayDisableOnInteraction: false
         });

         var mySwiper3 = new Swiper('.pic_slider2',{
         slidesPerView: 'auto',
         slideClass:'pic_slide',
         slideActiveClass:'pic_slide_active',
         wrapperClass:'pic_slideshow_wr',
         loop: true,
         autoplay: 3500,
         autoplayDisableOnInteraction: false
         });
         var mySwiper4 = new Swiper('.pic_slider3',{
         slidesPerView: 'auto',
         slideClass:'pic_slide',
         slideActiveClass:'pic_slide_active',
         wrapperClass:'pic_slideshow_wr',
         loop: true,
         autoplay: 4000,
         autoplayDisableOnInteraction: false
         });
         var mySwiper5 = new Swiper('.pic_slider4',{
         slidesPerView: 'auto',
         slideClass:'pic_slide',
         slideActiveClass:'pic_slide_active',
         wrapperClass:'pic_slideshow_wr',
         loop: true,
         autoplay: 3000,
         autoplayDisableOnInteraction: false
         });
         J.hideMask();
         },1000);
         }
         });*/
    };
});

App.page('history_detail',function(){
    this.init = function(){
        //J.showMask();
        Share.init("history",History);
        //var url = 'http://120.24.85.210/api/getHistory.php?callback=?';
        console.log("这里是news");
        var mySwiper = new Swiper('.history_detail_container',{
            slideClass:'his_slide',
            wrapperClass:'history_wrapper',
            mode: 'vertical',
            slideActiveClass:'his_slide_active'
        });
    };
});

$(function(){
    App.run();
});


