const { ajax } = getApp();
Page({
	data: {
		list: [
			{
				id: 'data-loader',
				name: '数据加载',
				open: false,
				pages: ['listLoader'],
			},
		],
	},
	onShareAppMessage() {
		return {
			title: '小程序官方组件展示',
			path: 'page/component/index',
		};
	},
	kindToggle(e) {
		const id = e.currentTarget.id;
		const list = this.data.list;
		const setDataObj = {};
		for (let i = 0, len = list.length; i < len; ++i) {
			if (list[i].id === id) {
				setDataObj[`list[${i}].open`] = !list[i].open;
			}
			else if (list[i].open) {
				setDataObj[`list[${i}].open`] = false;
			}
		}
		this.setData(setDataObj);
	},
});
