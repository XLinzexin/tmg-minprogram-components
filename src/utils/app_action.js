/**
 * 该文件将小程序当中会重复使用的逻辑抽出来,方便维护
 * 例如当页面有多处加入购物车时,将这类操作抽出来统一管理,当页面有多处支付时统一管理
 */
import ajax from '@/utils/ajax';
import { USER_INFO } from '@/utils/constant';
import { compareVersion } from '@/utils/util';


/**
 * 更新用户信息
 */
function updateUserInfo() {
	return new Promise((resolve, reject) => {
		wx.getUserInfo({
			withCredentials: true,
			lang: 'zh_CN',
			success: async (userInfoRes) => {
				try {
					const res = await ajax.post('/user/info', {
						encryptedData: userInfoRes.encryptedData,
						iv: userInfoRes.iv,
						rawData: userInfoRes.rawData,
						signature: userInfoRes.signature,
					});
					if (res.code) throw new Error('授权失败！');
					const data = res.data;
					if (data.wechatOpenId) {
						wx.setStorageSync(USER_INFO, data);
						resolve();
					}
				}
				catch (err) {
					wx.showModal({
						title: '授权失败！',
					});
					reject(err);
				}
			},
		});
	});
}

/**
 * 延时执行的函数队列
 */
function timeoutFuncQueue() {
	const fnArr = Array.from(arguments);
	const nowFn = fnArr.splice(0, 1)[0];
	setTimeout(() => {
		if (typeof nowFn === 'function') {
			nowFn();
		}
		if (fnArr.length > 0) {
			timeoutFuncQueue(...fnArr);
		}
	}, 6000);
}

export const globalAction = {
	updateUserInfo,
	timeoutFuncQueue,
};
