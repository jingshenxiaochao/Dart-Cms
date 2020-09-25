const Router = require('koa-router');

const {
	getTypeList,
	getDetillData,
	getSearchDatas,
	getTypesDatas,
	appAuthUpgrade,
	getArtDetill,
	getAllArtItemList,
	getCurNavItemList,
	appInitTipsInfo,
} = require('../methods/app');

let route = new Router();
let R = route.prefix('/app');


// app首页
R.get('/getTypeList', getTypeList);
// 获取首页每个分类的详细数据
R.get('/getCurNavItemList/:nid', getCurNavItemList);
// 获取文章列表
R.get('/getAllArtItemList', getAllArtItemList);
// app播放页
R.get('/getDetillData/:vid', getDetillData);
// app文章详情页
R.get('/getArtDetill/:aid', getArtDetill);
// app搜索页
R.get('/getSearchDatas', getSearchDatas);
// app分类页
R.get('/getTypesDatas', getTypesDatas);
// app检测升级
R.get('/appAuthUpgrade', appAuthUpgrade);
// app首屏公告
R.get('/appInitTipsInfo', appInitTipsInfo);

module.exports = route