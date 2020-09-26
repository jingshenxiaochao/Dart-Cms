const getDB = require('../utils/baseConnect');

module.exports = (ctx, next) => {

	return async (ctx, next) => {

		let confColl = getDB().collection('config');
		let config = await confColl.findOne({});

		let isAllowAdopt = config.shangeWebState;

		let url = ctx.request.url;

		let isManage = /^\/manage/.test(url);  // 后台管理系统文件 + 后台ajax接口
		let isUpload = /^\/upload/.test(url);  // 上传文件静态目录
		let isApp = /^\/app/.test(url);        // app接口
		let isPublic = /^\/public/.test(url);  // 通用接口

		// 如果不是后台
		if(!isAllowAdopt && !isManage && !isUpload && !isApp && !isPublic){
			ctx.status = 403;
			ctx.body = '';
			return
		}
		await next()
	}

}