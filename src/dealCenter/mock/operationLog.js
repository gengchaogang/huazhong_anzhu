'use strict';

const qs = require('qs');
// const mockjs = require('mockjs');

// 数据持久
// let tableListData = {};
// if (!global.tableListData) {
//   const data = mockjs.mock({
//     'data|100': [{
//       'id|+1': 1,
//       name: '@cname',
//       'age|11-99': 1,
//       address: '@region'
//     }],
//     page: {
//       total: 100,
//       current: 1
//     }
//   });
//   tableListData = data;
//   global.tableListData = tableListData;
// } else {
//   tableListData = global.tableListData;
// }

module.exports = {

	'post /miss-anzhu-operation/operationLog/query' (req, res) {
		setTimeout(function () {
			res.json({
				fuck:'fuck post',
			});
		}, 500);
	},

};
