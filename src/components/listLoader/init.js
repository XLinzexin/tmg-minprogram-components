const { ajax } = getApp();

export const request = async function (config) {
	const {url, method, params} = config;
	const res = await ajax[method](url, params);
	return res;
};

export const pageSize = 'pageCount';

export const pageNumber = 'num';
