Page({
	data: {
		lists: [],
		params: {type: 1},
	},
	onLoad() {
		this.selectComponent('#tmgListLoader').setRequestConfig({
			url: '/list',
			params: {
				pageCount: 18,
			},
		});
	},
	// 渲染列表
	renderList: function (e) {
		console.log(e);
		let list = Array.from(10);
		this.setData({
			list,
		});
	},
});
