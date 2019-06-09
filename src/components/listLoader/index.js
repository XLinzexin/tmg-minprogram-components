// components/common/timedown/index
import { request, pageNumber, pageSize } from './init';

Component({
	options: {
		multipleSlots: true,
	},
	properties: {
		nomarl: {
			type: Boolean,
			value: false,
		},
	},
	data: {
		url: '',
		constParams: {
			[`${pageNumber}`]: 0,
			[`${pageSize}`]: 8,
		},
		params: {},
		loading: false,
		loadError: false,
		allLoaded: false,
		isEmpty: false,
		method: 'get',
		pageNumber,
		pageSize,
	},
	methods: {
		/**
		 * 初始化列表加载器
		 * @method setRequestConfig
		 * @param {Object} requestConfig 请求配置
		 * @param {String} requestConfig.url 请求url
		 * @param {String} request.method 请求方法
		 * @param {Object} request.params 请求参数
		 */
		setRequestConfig: function (requestConfig) {
			this.reset();
			const defaultConfig = {
				loading: false,
				loadError: false,
				allLoaded: false,
				isEmpty: false,
				params: {},
				method: 'get',
				constParams: {
					[`${pageNumber}`]: 0,
					[`${pageSize}`]: 8,
				},
			};
			requestConfig = Object.assign(defaultConfig, requestConfig);
			const params = requestConfig.params;
			if (params[pageSize]) {
				requestConfig.constParams[pageSize] = params[pageSize];
				delete params[pageSize];
			}
			this.setData(requestConfig);
			setTimeout(() => {
				this.nextPage();
			}, 1000);
		},
		/**
		 * 加载下一页
		 * @method nextPage
		 */
		nextPage: function () {
			if (this.data.loading && this.data.constParams[pageNumber] !== 0) return 1;
			if (this.data.url === '') return 2;
			if (this.data.allLoaded) return 3;
			this.data.constParams[pageNumber]++;
			this.setData({
				loading: true,
			});
			this.getListData();
		},
		/**
		 * 发起请求获取列表数据
		 * @method getListData
		 */
		getListData: async function () {
			try {
				const params = Object.assign(this.data.params, this.data.constParams);
				const res = await request({
					url: this.data.url,
					method: this.data.method,
					params,
				});
				if (!res.code) {
					let data = res.data;
					if (this.data.constParams[pageNumber] === 1 && this.data.loading) {
						this.reset();
					}
					this.triggerEvent('render', {
						list: data,
						[`${pageNumber}`]: this.data.constParams.pageNumber,
					});
					this.setData({
						loading: false,
						[`constParams.${pageNumber}`]: this.data.constParams.pageNumber,
					});
					if (this.data.constParams.pageNumber === 1 && data.length === 0) {
						this.setData({
							isEmpty: true,
						});
					}
					if (parseInt(this.data.constParams[pageSize]) > parseInt(data.length)) {
						this.setData({
							allLoaded: true,
						});
					}
				}
				else {
					throw res.msg;
				}
			}
			catch (err) {
				console.error(err, 123);
				this.setData({
					loading: false,
					loadError: true,
				});
			}
		},
		/**
		 * 重新加载数据
		 * @method reload
		 */
		reload: function () {
			this.data.constParams.pageNumber--;
			this.setData({
				loadError: false,
			});
			this.nextPage();
		},
		/**
		 * 对父页面触底的方法切片，加人触底加载逻辑
		 * @method addToPageOnReachBottom
		 */
		addToPageOnReachBottom() {
			let _this = this;
			let pages = getCurrentPages();
			let curPage = pages[pages.length - 1];
			if (curPage.onReachBottom) {
				var onReachBottom = curPage.onReachBottom;
				curPage.onReachBottom = function (options) {
					_this.nextPage();
					onReachBottom.call(this, options);
				};
			}
			else {
				curPage.onReachBottom = function (options) {
					_this.nextPage();
				};
			}
		},
	},
	attached: function () {
		this.addToPageOnReachBottom();
	},
});
