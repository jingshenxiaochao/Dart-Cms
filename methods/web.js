const { ObjectID } = require('mongodb');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');

const getDB = require('../utils/baseConnect');
const { setResponse, makeArrObjectID, mixinsScriptConfig, encryption, createTokenID, getBjDate, dirCatImgs, placeUploadImg } = require('../utils/tools');
const { createNavType, getVideoDetill, getTypesData, getSearchData, getCurNavData, getCurArtData, getCurArtInfo } = require('./public');

// 首页
let webIndex = async (ctx, next) => {

	let confColl = getDB().collection('config');

	let config = await confColl.findOne({});
	let curTempPath = config.curTempPath;

	let data = await getCurNavData(config, ctx, next, false, true);

	await ctx.render(`${curTempPath}/index`, data)

}
// 视频详情
let webDetill = async (ctx, next) => {

	let confColl = getDB().collection('config');

	let config = await confColl.findOne({});
	let curTempPath = config.curTempPath;

	let data = await getVideoDetill(config, ctx, next);
	// 如果false => 404
	if(!data){
		return next();
	}

	await ctx.render(`${curTempPath}/detill`, data)

}
// 播放页面
let webPlay = async (ctx, next) => {

	let confColl = getDB().collection('config');

	let config = await confColl.findOne({});
	let curTempPath = config.curTempPath;

	let data = await getVideoDetill(config, ctx, next, false, false, false);
	// 如果false => 404
	if(!data){
		return next();
	}

	await ctx.render(`${curTempPath}/player`, data)

}
// 单个视频分类页面
let webNav = async (ctx, next) => {

	let confColl = getDB().collection('config');

	let config = await confColl.findOne({});
	let curTempPath = config.curTempPath;

	let data = await getCurNavData(config, ctx, next, false, false, false);
	// 如果false => 404
	if(!data){
		return next();
	}

	await ctx.render(`${curTempPath}/video-type`, data)

}
// 单个文章分类页面
let webArt = async (ctx, next) => {

	let confColl = getDB().collection('config');

	let config = await confColl.findOne({});
	let curTempPath = config.curTempPath;

	let data = await getCurArtData(config, ctx, next);
	// 如果false => 404
	if(!data){
		return next();
	}

	await ctx.render(`${curTempPath}/article-type`, data)

}
// 分类页面
let webType = async (ctx, next) => {

	let confColl = getDB().collection('config');

	let config = await confColl.findOne({});
	let curTempPath = config.curTempPath;

	let data = await getTypesData(config, ctx);

	await ctx.render(`${curTempPath}/type`, data)

}
// 搜索页面
let webSearch = async (ctx, next) => {

	let confColl = getDB().collection('config');

	let config = await confColl.findOne({});
	let curTempPath = config.curTempPath;

	let data = await getSearchData(config, ctx);

	await ctx.render(`${curTempPath}/search`, data)

}
// 用户中心
let webUser = async (ctx, next) => {

	// 未登录
	if(JSON.stringify(ctx.session1) === '{}'){
		return next();
	}else{

		let confColl = getDB().collection('config');
		let otherColl = getDB().collection('other');

		let config = await confColl.findOne({});
		let curTempPath = config.curTempPath;

		// 全部分类
		let allNav = await otherColl.find({type: 'nav_type', parent_id: false, display: true}).sort({index: 1}).toArray();
		let createNavResult = createNavType(allNav, '0');
		let navData = createNavResult.arr;

		let data = {
			meta: {
				title: config.websiteName,
				keywords: config.keywords,
				description: config.description,
				hostName: ctx.protocols + '://' + ctx.host,
			},
			isLogin: true,
			footer: config.footerInfo.replace(/\n/, '<br />'),
			nav: navData,
			publicCode: config.publicCode,
		}
		await ctx.render(`${curTempPath}/user`, data);

	}

}
// 文章详情
let webArtDetill = async (ctx, next) => {

	let confColl = getDB().collection('config');

	let config = await confColl.findOne({});
	let curTempPath = config.curTempPath;

	let data = await getCurArtInfo(config, ctx, next);
	// 如果false => 404
	if(!data){
		return next();
	}

	await ctx.render(`${curTempPath}/article`, data)

}

module.exports = {
	webIndex,
	webDetill,
	webPlay,
	webNav,
	webArt,
	webType,
	webSearch,
	webUser,
	webArtDetill,
}