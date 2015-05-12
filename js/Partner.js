// 常用函数
// 将标注添加到地图中 返回标注
// iconObj -->  {url:'imgs/m0.png',w:30,h:24}
// point --->  BMap.Point
function addMarker(iconObj,point,map){
	var marker,point,icon;
	//point = new BMap.Point(site.lng,site.lat);
	icon = new BMap.Icon(iconObj.url, new BMap.Size(iconObj.w*2,iconObj.h*2));
	icon.imageSize=new BMap.Size(iconObj.w,iconObj.h);
	marker = new BMap.Marker(point,{icon:icon});
	map.addOverlay(marker);
	return marker;
	
}
//将城市数据变成City类对象数组，返回City对象数组
function changeCityArr(data,country,countryNum){
	var i,len = data.length,cityArr=[],cityTemp,tempCitylist,j;
	for(i = 0;i<len;i++){
		for(j = 0;j<data[i].citylist.length;j++) {
			tempCitylist =  data[i].citylist[j];
			if(tempCitylist.city!="") {
				cityTemp = new City(country, countryNum, tempCitylist.city, j, tempCitylist.partners.length);
				cityArr.push(cityTemp);
			}
		}
	}
	return cityArr;
}
//将data数据变成Partner类对象数组，返回Partner对象数组
function changePartnerArr(data,country,provinceNum){
	var i,j,len = data.length,citytLen,partLen,partArr=[],partTemp,cityTemp, z,provinceTemp;
	
	for(i = 0;i<len;i++){
		provinceTemp = data[i];
		citytLen = provinceTemp.citylist.length;
		for(j = 0;j < citytLen;j++){
			cityTemp = provinceTemp.citylist[j];
			if(cityTemp.city!=="") {
				partLen = cityTemp.partners.length;

				for (z = 0; z < partLen; z++) {
					partTemp = new Partner(country, provinceNum, cityTemp.city, j, cityTemp.partners[z]);
					partArr.push(partTemp);
				}
			}
		}
		
	}
	return partArr;
}
//  寻找当前我所在城市 在数据的位置索引
function findCityPartner(city,data){
	if(!data.length)  return false;
	var len = data.length,i;
	for(i = 0;i<len;i++){
		if(data[i].city!=="") {
			if (data[i].city.indexOf(city) != -1 || city.indexOf(data[i].city) != -1) return i;
		}
	}
	return -1;
}
//  当所在城市的省份，把它调整到第一位
function findProCity(array,i){
	if(i) {
		var j, temp, list = array;
		temp = list.splice(i, 1);
		list.unshift(temp[0]);
	}
	return array;
}
//  当所在城市有Partner时，把它调整到第一位
function findGPSCity(array,i){
	var j,temp,list = array.citylist;
	temp = list.splice(i,1);
	list.unshift(temp[0]);
	return array;
}
//  将最近有商户的城市放到第一位
function findNearCity(array,map,cityName){
	var i ,len = array.citylist.length,tempCity =new BMap.Point(cityName),citys = [],n;
	citys.push(cityName);
	for(i = 0;i<len;i++){
		tempCity = array.citylist[i];
		//if(tempCity.city!=="") {
		citys.push(tempCity.city);
		//}
		//tempCity.nearDis = map.getDistance(ori,des);
		//ori = new BMap.Point();
	}
	//console.log(citys);
	cityPoint.adds = citys;
	cityPoint.goBdGEO(function(){
		console.log(cityPoint.points);
		for(i = 0,n=0;i<len;i++,n++){
			tempCity = array.citylist[i];
			if(tempCity.city=="") {
				tempCity.nearDis = Infinity;
				n--;
				continue;
			}
			tempCity.nearDis = map.getDistance(cityPoint.points[0], cityPoint.points[n+1]);

		}
		array.citylist.sort(function(a,b){
			return a.nearDis - b.nearDis;
		});
		//console.log(array);
	});
	
	
}
// 计算partnerArr的距离
function countPartArrDis(map,mySite,partArr){
	var i,len = partArr.length;
	for(i=0;i<len;i++){
		partArr[i].countDistance(map,mySite);
	}
}
//  返回特定城市的Partner对象数组
function findCityPartners(city,partArr){
	var i,cityPartArr = [],len = partArr.length,isName =( typeof city )=== "string" ? true:false;
	
	for(i = 0;i<len;i++){
		
		if(isName&&partArr[i].city===city){
			cityPartArr.push(partArr[i]);
		}
		if(!isName&&partArr[i].cityNum===city){
			cityPartArr.push(partArr[i]);
		}
	}
	return cityPartArr;
}
//  对输入的字进行搜索
function searchWord(word,cityArr,partArr){
	var i,j,len = cityArr.length,partLen = partArr.length,searchArr = [];

	for(i = 0;i<len;i++){
		if(cityArr[i].city.indexOf(word)!==-1){
			searchArr.push(cityArr[i]);
		}
	}
	for(j = 0;j<partLen;j++){
		if(partArr[j].name.indexOf(word)!==-1){
			searchArr.push(partArr[j]);
		}
	}
	return searchArr;
}
// 点击图标的时候，出现详情页
function markEvent(num){
	return function(){
		partnerBd._current = num;		
		J.Router.goTo("#partner_detail_section",function(){//console.log("od");
		}); 
	}	
}
//  返回content的html
function contentHTML(a,b,c){
	var content ;
	content = "<h2 style='font-size: 16px;padding:5px;'>"+a+"</h2><p style='font-size: 14px;padding:0 5px 3px 5px;'>"+b+"</p><a href='"+c+"' style='width:36px;height:36px;background:url(imgs/road.png);background-size:100% 100%;display:block;position:absolute;right:10px;top:13px;'></a><div style='position: absolute; border-top-width: 13px; border-top-style: solid; border-top-color: rgba(0, 0, 0, 0.6); border-left-width: 13px; border-left-style: solid; border-left-color: transparent; border-right-width: 13px; border-right-style: solid; border-right-color: transparent; bottom: -13px; left: 30%; margin-left: -6px;'></div>";		
	return content;
}


// 展示地图选择弹窗
function popMap(urlArr){
	var urlObj = {};
	urlObj.url = urlArr;
	$('#partner_route_article').show();
	$('.partner_detail_route').css("opacity","0");
	J.anim("#partner_route_article","opacityIn",function(){	
		J.anim(".partner_detail_route","slideUpIn");
		$('.partner_detail_route').css("opacity","1");
		J.tmpl(".partner_detail_route",'partner_route_template',urlObj,"replace");
		setTimeout(function(){
			$('.btn_route_close').on("touchstart",function(event){
				
				J.anim(".partner_detail_route","slideDownOut",function(){
					$('#partner_route_article').hide();
					J.anim("#partner_route_article","opacityOut");
				});
				
			});
			$('.route_shadow').on("touchstart",function(event){
				
				J.anim(".partner_detail_route","slideDownOut",function(){
					$('#partner_route_article').hide();
					J.anim("#partner_route_article","opacityOut");
				});
				
			});
		},200);
	});
}

//返回图文数组
function picWordArr(array){
    var i,temp, j,wordArr, z,picArr,reg = /\uff08\u56fe\u7247\uff1a\u65b0\u95fb\u002d[1-5]\u002d[1-5]\uff09/;
    for(i = 0;i < array.length;i++){
        temp = array[i];
        wordArr = temp.content.split(reg);
        temp.picWordArr = [];
        picArr = temp.pics;
        for(j = 0,z = 1;j<wordArr.length||z<picArr.length;j++,z++){
            var obj = {};
            if(wordArr[j]){
                obj.word =  wordArr[j].split("\n");
            }
            if(picArr[z]){
                obj.pic =  picArr[z];
            }
            temp.picWordArr.push(obj);
         }
    }
}

//返回省份名称
function getProvince(pt,success){
	var geoc = new BMap.Geocoder();
	geoc.getLocation(pt, function(rs){
		var addComp = rs.addressComponents;
		success(addComp.province);
	});


}
//返回省份位置
function findProvinceNum(data,province){
	if(!data.length)  return false;
	var len = data.length,i;
	for(i = 0;i<len;i++){
		if(data[i].province.indexOf(province)!=-1 || province.indexOf(data[i].province)!=-1) return i;
	}
	return -1;
}

// 类
function Partner(country,provinceNum,city,cityNum,object){
	this.country = country;
	this.provinceNum = provinceNum;
	this.city = city;
	this.cityNum = cityNum;
	this.id = object.id;
	this.item = object.item;
	this.address = object.address;
	this.desc = object.desc;
	this.duration = object.duration;
	this.lat = object.lat;
	this.lng = object.lng;
	this.name = object.name;
	this.phone = object.phone;
	this.wechat = object.webchat;
    this.pics = object.pics;
	this.distance = -1;
	this.isCity = false;
}

//  计算当前Partner离我的距离
Partner.prototype.countDistance = function(map,mySite){
	var disPoint = new BMap.Point(this.lng,this.lat),kilometer;
	kilometer = map.getDistance(mySite,disPoint).toFixed(0);
	this.distance = kilometer;
} 
Partner.prototype.setItem = function(i){
	this.item = i;
}


function City(country,provinceNum,cityname,cityNum,length,isGPS){
	this.country = country;
	this.provinceNum = provinceNum;
	this.city = cityname;
	this.cityNum = cityNum;
	this.partnersNum = length;
	this.isGPS = false;
	this.isCity = true;
	this.nearDis = 0;
}

//  设置当前地是所在GPS位置
City.prototype.setIsGPS = function(isGPS){
	this.isGPS = isGPS;
}
City.prototype.setNearDis = function(nearDis){
	this.nearDis = nearDis;
}

//用于城市地址解析
var cityPoint = {
	index:0,
	adds:[],
	points:[],
	myGeo:{},
	callback:{},
	goBdGEO:function(callback){
		cityPoint.callback = callback;
		cityPoint.myGeo=new BMap.Geocoder();
		cityPoint.bdGEO();
	},
	bdGEO:function(){
		var add = cityPoint.adds[cityPoint.index];
		cityPoint.geocodeSearch(add);
		cityPoint.index++;
	},
	geocodeSearch:function(add){
		if(cityPoint.index < cityPoint.adds.length){
			setTimeout(cityPoint.bdGEO,400);
		}else{
			cityPoint.callback();
		} 
		
		cityPoint.myGeo.getPoint(add, function(point){
			if (point) {
				cityPoint.points.push(point);
			}
		}, add);
	}
}



// 用于 partners 地图
var partnerBd = {
	//jsonUrl:"http://120.24.85.210/api/getPartners.php?callback=?",
	jsonUrl:"http://120.25.233.75/api/getPartners.php?callback=callback",
	data:[],
	country:"china",                                  //设定我所在的国家
	defaultIconObj:{url:'imgs/m0.png',w:30,h:24},     //设定默认商家的icon
	levelIconObj : [{url:'imgs/m1.png',w:30,h:24},
            {url:'imgs/m2.png',w:30,h:24},
            {url:'imgs/m3.png',w:30,h:24},
            {url:'imgs/m4.png',w:30,h:24},
            {url:'imgs/m5.png',w:30,h:24},
            {url:'imgs/m6.png',w:30,h:24},
            {url:'imgs/m7.png',w:30,h:24},
            {url:'imgs/m8.png',w:30,h:24},
            {url:'imgs/m9.png',w:30,h:24},
            {url:'imgs/m10.png',w:30,h:24}],          //设定位置远近的10个等级
	defaultBIconObj:{url:'imgs/m0b.png',w:59,h:46},     //用于子页的大icon
	levelBIconObj : [{url:'imgs/m1b.png',w:59,h:46},
            {url:'imgs/m2b.png',w:59,h:46},
            {url:'imgs/m3b.png',w:59,h:46},
            {url:'imgs/m4b.png',w:59,h:46},
            {url:'imgs/m5b.png',w:59,h:46},
            {url:'imgs/m6b.png',w:59,h:46},
            {url:'imgs/m7b.png',w:59,h:46},
            {url:'imgs/m8b.png',w:59,h:46},
            {url:'imgs/m9b.png',w:59,h:46},
            {url:'imgs/m10b.png',w:59,h:46}],          //用于子页的大icon
	mySiteIconObj:{url:'imgs/me.png',w:24,h:24},      //设定我的位置的icon
	
	mainMapString:"allmap",                           //Partner页的Map的ID
	partmapString:"partmap",                          //Partner_detail的Map的ID
	mainMap:{},                                       //Partner页的Map对象
	partMap:{},                                       //Partner_detail页的Map对象

	provinceNum:-1,                                    //记录我所在省份的索引
	isNoPartner:0,                                    //记录所在城市是否有partners
	localCity:"",                                     //记录我所在城市的名字
	siteCity:"",                                       // 通过定位获取的城市名字，有时候跟上面的不一样
	cityArr:[],                                       //记录City对象数组
	partnerArr:[],                                    //记录Partner对象数组
	currentCityNum:-1,                                 //记录当前城市索引
	lastPartner:{},                                    //当前城市被隐藏的商户对象
	lastCount:0,                                       //点击更多商户按钮的次数
	showPartnerNum:10,                                  //一次展示商户的个数
	showLastClass:"btn_more",                          //更多商户按钮的类名
	maxDistance:100000,                                 // 限制的最远距离
	mySitePoint:0,                                     //记录我当前的位置，BMap.Point类
	findnear:0,                                        //是否按下查找最近商户按钮
	
	searchArr:[],                                       //搜索得出的内容数组，或许包含City或者Partner对象
	searchCity:"",                                      // 记录搜索点击内容时是城市的时候的城市名字
	
	_resultLocal:[],                                   //记录当前城市的partner数组,用于detail下一步的计算
	_current:-1,                                       //当前的detail是在result里面的第几个
	clickSite:false,                                   //是否点击了获取当前位置
	_init:function(){
        var _self = this,url = _self.jsonUrl;
		if(_self.data.length){
			_self.openMap(_self.data);
		}else{
			$.ajax({
				url : url,
				dataType : 'jsonp',
				timeout : 20000,
				success : function(data){
                    //data = JSON.parse(data);
					_self.data = data.data;
					console.log(data);
					_self.openMap(data.data);
				},
				error:function(xhr, errorType, error){
					console.log(error);
				}
			});
		}		
    },
	openMap:function(data){
		var _self = this,defaultIconObj = _self.defaultIconObj,map,point,cityName,count;        
		J.showMask();      //  打开Loading
        map = new BMap.Map(_self.mainMapString);
        _self.mainMap = map;
        point = new BMap.Point(116.331398,39.897445);     
        map.centerAndZoom(point,11);
        map.enableScrollWheelZoom(true);

        // 更改所在城市
        function myFun(result){
            var i,cityData,cityArr = [],partnerArr = [];           
            cityName = result.name;
			_self.localCity = cityName;
			map.setCenter(cityName);
			getProvince(result.center,function(province){
				_self.provinceNum = findProvinceNum(data,province);
				findProCity(data,_self.provinceNum);

				_self.currentCityNum = i = findCityPartner(/*cityName"深圳""广州"*/cityName,data[_self.provinceNum].citylist);

				cityData = _self.data[_self.provinceNum];

				if(i===false||i==-1){      // 如果没有该城市的数据，就显示全国的
					findNearCity(cityData,map,cityName);		//将有商户而且最近的城市的放到最前面
					_self.currentCityNum = i = 0;
					_self.isNoPartner = 1;
					cityArr = changeCityArr(data,_self.country,_self.provinceNum);
					_self.cityArr = cityArr;
					console.log(cityArr);
					//_self.otherCity(map);
				}
				else{
					findGPSCity(cityData,i);		//将所在城市的放到最前面
					_self.currentCityNum = i = 0;
					// 建立City对象数组
					cityArr = changeCityArr(data,_self.country,_self.provinceNum);
					cityArr[0].setIsGPS(true);
					_self.cityArr = cityArr;
				}
				partnerArr = changePartnerArr(data,_self.country,_self.provinceNum);
				_self.partnerArr = partnerArr;
				_self.showCityPartnersList(map,_self.levelIconObj,cityArr,partnerArr,"partner");
				//console.log(_self.partnerArr);
				//_self.showCityPartnersDis(map,_self.levelIconObj,_self.partnerArr,"partner");
			});



        }
        var myCity = new BMap.LocalCity();
        myCity.get(myFun);
    },
	//  获取我当前位置
	getSite:function(map){
        var geolocation = new BMap.Geolocation(),cityName, i,_self = partnerBd,cityList;
        geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
                var mk ,mySiteIconObj,mySiteIcon,point,province;
				J.hideMask();
				point = r.point;
                mySiteIconObj = _self.mySiteIconObj;
				map.clearOverlays();
				mk = addMarker(mySiteIconObj,point,map);              
                map.centerAndZoom(point,12);           
                map.panTo(point);
                _self.mySitePoint = point;
				_self.lastCount = 0;
                map.setCenter(point);
                var geoc = new BMap.Geocoder();
                geoc.getLocation(point, function(rs){
                    var addComp = rs.addressComponents;
                    cityName = addComp.city;
					province = addComp.province;
					_self.provinceNum = findProvinceNum(_self.data,province);
                    _self.siteCity = cityName;
                    if(_self.localCity.indexOf(_self.siteCity)==-1||_self.siteCity.indexOf(_self.localCity)==-1){
                        _self.currentCityNum = i = findCityPartner(/*"深圳"cityName*/cityName,_self.data[_self.provinceNum].citylist);
                    }else{
						i = _self.currentCityNum;
					}
					console.log(_self.partnerArr);
					countPartArrDis(map,point,_self.partnerArr);
					// 按距离排序
					_self.partnerArr.sort(function(a,b){
						var aDis = a.distance,bDis = b.distance;						
						return aDis - bDis;
					});
					//console.log(_self.partnerArr);
                    _self.showCityPartnersDis(map,_self.levelIconObj,_self.partnerArr,"partner");
                    //map.addOverlay(mk);
                });
            }
            else {
				J.hideMask();
				J.showToast('位置没法获取，请稍等再试');
                console.log('site error')
            }
        },{enableHighAccuracy: true});
    },
	//  将默认图标标注在地图上,并把商户信息插入到页面
	showCityPartnersList:function(map,iconObj,cityArr,partnerArr,sectionID){
		var _self =this,partLen = cityArr[0].partnersNum,i,point,partTemp,result = [],result10 ={},resultlast={},mark;
		result10.isNoPartner = _self.isNoPartner;
		result10.partners=[],resultlast.partners = [];
		for(i = 0;i < partLen;i++){
			partTemp = partnerArr[i];
			partTemp.setItem(i);
			result.push(partTemp);
			if(i<_self.showPartnerNum){
				result10.partners.push(partTemp);
				point = new BMap.Point(partTemp.lng,partTemp.lat);
				mark = addMarker(iconObj[i],point,map);
				mark.addEventListener("click",markEvent(i)); 
			}else{
				resultlast.partners.push(partTemp);
			}			
		}
		
		if(i>_self.showPartnerNum){$('.'+_self.showLastClass).show();}
		//console.log(result10);
		_self._resultLocal = result;
		_self.lastPartner = resultlast;
		J.tmpl('#'+sectionID+'Lis',sectionID+'_template',result10,"replace");
		setTimeout(function(){
		    J.Scroll($('#'+sectionID+'_article'));    
		    J.hideMask();
			$('#mySite').trigger("click");
		},2300);
	},
	//  将层级图标标注在地图上,并把商户信息插入到页面
	showCityPartnersDis:function(map,iconObj,partnerArr,sectionID){
		var _self =this,partLen = partnerArr.length,i,point,partTemp,result = [],result10 ={},resultlast={},mark;
		result10.partners=[],result10.clickable = _self.clickSite,resultlast.partners = [];
		for(i = 0;i < partLen;i++){
			partTemp = partnerArr[i];
			partTemp.setItem(i);
			if(partTemp.cityNum!==_self.currentCityNum&&partTemp.distance>_self.maxDistance){
				break;
			}
			result.push(partTemp);
			if(i<_self.showPartnerNum){
				result10.partners.push(partTemp);
				point = new BMap.Point(partTemp.lng,partTemp.lat);
				mark = addMarker(iconObj[i],point,map);
				mark.addEventListener("click",markEvent(i)); 
				
			}else{
				resultlast.partners.push(partTemp);
			}			
		}
		$('.'+_self.showLastClass).hide();
		if(i>_self.showPartnerNum){$('.'+_self.showLastClass).show();}
		console.log(i);
		console.log(partLen);
		console.log(result10);
		_self._resultLocal = result;
		_self.lastPartner = resultlast;
		J.tmpl('#'+sectionID+'Lis',sectionID+'_template',result10,"replace");
		setTimeout(function(){
		    J.Scroll($('#'+sectionID+'_article'));    
		    J.hideMask();
		},2300);
	},
	routePolicy:function(map,start,end,isbus){
		var symmetry,syX,syY,routePoiFun;
        if(isbus===1){
			routePoiFun = new BMap.TransitRoute(map, {
                renderOptions: {map: map,autoViewport: false}
            });
			routePoiFun.search(start,end);


        } else if(isbus===0){
			routePoiFun = new BMap.WalkingRoute(map, {
                renderOptions: {map: map,autoViewport: false}
            });
			routePoiFun.search(start,end);
        } else{
			routePoiFun = new BMap.DrivingRoute(map, {
                renderOptions:{map: map,autoViewport: false}
            });
			routePoiFun.search(start,end);

        }
		syX = 2*end.lat - start.lat;
		syY = 2*end.lng - start.lng;
		symmetry = new BMap.Point(syY,syX);

		map.setViewport([start,end,symmetry],{viewportOptions:{margins:[10,10,10,10]}});

		return routePoiFun;
    },
	// 找到最近的商户
	nearestPart:function(map,callback){
		var _self = this,url = _self.jsonUrl;
		J.showMask();
		if(_self.data.length){
			console.log("gdf");
			_self.findNearestPart(map,callback);
		}else{
			$.ajax({
				url : url,
				timeout : 20000,
				success : function(data){
					_self.data = data.data;
					_self.findNearestPart(map,callback);
				},
				error:function(xhr, errorType, error){
					console.log(error);
				}
			});
		}
	},
	//  确定位置，排序商户，出现最近的商户
	findNearestPart:function(map,callback){
		var geolocation = new BMap.Geolocation(),_self = partnerBd,point,cityName,data = _self.data,cityData;
        geolocation.getCurrentPosition(function(r){
			_self.mySitePoint = point = r.point;
			if(!_self.partnerArr.length){
				//寻找中国位置
				for(count = 0;count<data.length;count++){
					if(data[count].country.toLowerCase().indexOf(_self.country)!=-1){
						_self.courtryNum = count;
					}
				}

				var geoc = new BMap.Geocoder();
				geoc.getLocation(point, function(rs){
					var addComp = rs.addressComponents;
					cityName = addComp.city;
					_self.siteCity = cityName;
					cityData=_self.data[_self.courtryNum];					
					_self.partnerArr = changePartnerArr(cityData.citylist,_self.country,_self.courtryNum);
					countPartArrDis(map,point,_self.partnerArr);
					// 按距离排序
					_self.partnerArr.sort(function(a,b){
						var aDis = a.distance,bDis = b.distance;						
						return aDis - bDis;
					});
					console.log(_self.partnerArr);
					_self._resultLocal =[];
					_self._resultLocal.push(_self.partnerArr[0]);
					_self._current = 0;
					callback();
					J.hideMask();
				});
			}else{
				countPartArrDis(map,point,_self.partnerArr);
				_self.partnerArr.sort(function(a,b){
					var aDis = a.distance,bDis = b.distance;						
					return aDis - bDis;
				});
				console.log(_self.partnerArr);
				_self._resultLocal =[];
				_self._resultLocal.push(_self.partnerArr[0]);
				_self._current = 0;
				callback();
				J.hideMask();
			}			
		});
	},
	//当前商户的导航按钮
	showInfoWinSearch:function(mp,desPartner){
		var _self = this,desPartner =desPartner|| _self._resultLocal[_self._current],origin,destination,sContent,urlArr = [],myCompOverlay = new BMap.Label(),content;
		destination = desPartner.lat+","+desPartner.lng;
		myCompOverlay.setStyle({ color : "white",fontSize : "12px",display : "block",lineHeight : "18px", fontFamily:"微软雅黑",padding : "6px",paddingRight : "62px",background:"rgba(0,0,0,.6)", border:"0"});
		myCompOverlay.setPosition(new BMap.Point(desPartner.lng,desPartner.lat));
		myCompOverlay.setOffset(new BMap.Size(-88,-90));
		if(_self.mySitePoint){
			origin = _self.mySitePoint.lat+","+_self.mySitePoint.lng;
			cityName = _self.siteCity;
			urlArr.push( "http://apis.map.qq.com/uri/v1/routeplan?type=bus&from=我的位置&fromcoord="+origin+"&to="+desPartner.name+"&tocoord="+destination+"&policy=1&referer=DAVIDWINE");							
			urlArr.push( "baidumap://map/direction?origin="+origin+"&destination="+destination+"&mode=driving&src=");	
			urlArr.push( "http://maps.apple.com/?daddr="+origin+"&saddr="+destination);
			if(desPartner.distance>1000){
				content =contentHTML(desPartner.name,"距离："+(desPartner.distance/1000).toFixed(1)+"km","#");
			}else{
				content =contentHTML(desPartner.name,"距离："+desPartner.distance+"m","#");
			}
			myCompOverlay.setContent(content);
			myCompOverlay.addEventListener("click",function(event){
				
				popMap(urlArr);		
			});			
			mp.addOverlay(myCompOverlay);
		}
		else{
			var geolocation = new BMap.Geolocation();
			J.showMask();
			geolocation.getCurrentPosition(function(r){
				if(this.getStatus() == BMAP_STATUS_SUCCESS){
					var mk ,mySiteIconObj,mySiteIcon,point;
					point = r.point;
					origin = r.point.lat+","+r.point.lng;
					var geoc = new BMap.Geocoder();
					geoc.getLocation(point, function(rs){
						var addComp = rs.addressComponents;
						cityName = addComp.city;
						urlArr.push( "http://apis.map.qq.com/uri/v1/routeplan?type=bus&from=我的位置&fromcoord="+origin+"&to="+desPartner.name+"&tocoord="+destination+"&policy=1&referer=DAVIDWINE");							
						urlArr.push( "baidumap://map/direction?origin="+origin+"&destination="+destination+"&mode=driving&src=");	
						urlArr.push( "http://maps.apple.com/?daddr="+origin+"&saddr="+destination);countPartArrDis(_self.mainMap,point,_self.partnerArr);
						if(desPartner.distance>1000){
							content =contentHTML(desPartner.name,"距离："+(desPartner.distance/1000).toFixed(1)+"km","#");
						}else{
							content =contentHTML(desPartner.name,"距离："+desPartner.distance+"m","#");
						}
						myCompOverlay.setContent(content);
						myCompOverlay.addEventListener("click",function(event){
								//J.Router.goTo("#index_section",function(){});
								//window.open(url);
								popMap(urlArr);
						});
						//popMap(url);
						mp.addOverlay(myCompOverlay);
						J.hideMask();
					});
				}
				else {
					console.log('site error')
				}
			},{enableHighAccuracy: true});	
		}
	}
}