const { ObjectID } = require('mongodb');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');

const getDB = require('../utils/baseConnect');
const { setResponse, makeArrObjectID, mixinsScriptConfig, encryption, createTokenID, getBjDate, dirCatImgs, placeUploadImg } = require('../utils/tools');
const { getAllMainData, getVideoDetill, getSearchData, getTypesData, createNavType, getCurNavData } = require('./public');

// app入口数据
let getTypeList = async (ctx, next) => {

	ctx.set('Content-Type', 'application/json');
	let confColl = getDB().collection('config');
	let otherColl = getDB().collection('other');
	let config = await confColl.findOne({});

	let allNav = await otherColl.find({type: 'nav_type', parent_id: false, display: true, nav_type: "video"}).sort({index: 1}).toArray();
	let createNavResult = createNavType(allNav, '0');
	let navData = createNavResult.arr;

	let promise = Promise.resolve(navData);
	await setResponse(ctx, promise)

}
// 获取单个分类的数据
let getCurNavItemList = async (ctx, next) => {

	ctx.set('Content-Type', 'application/json');
	let videoInfoColl = getDB().collection('video_info');
	let otherColl = getDB().collection('other');
	let confColl = getDB().collection('config');
	let config = await confColl.findOne({});

	let data = await getCurNavData(config, ctx, next, true);
	let promise;
	if(!data){
		promise = Promise.reject();
	}else{
		promise = Promise.resolve(data);
	}
	await setResponse(ctx, promise)

}
// app播放页面
let getDetillData = async (ctx, next) => {

	ctx.set('Content-Type', 'application/json');
	let confColl = getDB().collection('config');
	let config = await confColl.findOne({});

	let data = await getVideoDetill(config, ctx);
	// 如果false => 404
	if(!data){
		return next();
	}

	await setResponse(ctx, Promise.resolve(data))

}
// app搜索页面
let getSearchDatas = async (ctx, next) => {

	ctx.set('Content-Type', 'application/json');
	let confColl = getDB().collection('config');
	let config = await confColl.findOne({});

	let promise = getSearchData(config, ctx);

	await setResponse(ctx, promise)

}
// app分类
let getTypesDatas = async (ctx, next) => {

	ctx.set('Content-Type', 'application/json');
	let confColl = getDB().collection('config');
	let config = await confColl.findOne({});

	let promise = getTypesData(config, ctx);

	await setResponse(ctx, promise)

}
// app验证是否升级
let appAuthUpgrade = async (ctx, next) => {

	ctx.set('Content-Type', 'application/json');
	let confColl = getDB().collection('config');
	let config = await confColl.findOne({});

	let isUpgrade = config.appUpgrade
	let result = {
		upgrade: isUpgrade,
		dialog: isUpgrade ? config.upgradeInfo : config.appInitNoticeCon
	}
	let promise = Promise.resolve(result);
	await setResponse(ctx, promise)

}

module.exports = {
	getTypeList,
	getDetillData,
	getSearchDatas,
	getTypesDatas,
	appAuthUpgrade,
	getCurNavItemList,
}