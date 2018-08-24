'use strict';

const qs = require('qs');
const mockjs = require('mockjs');
const Random=mockjs.Random;
// 数据持久
let tableListData = {};
if (!global.tableListData) {
  const data = mockjs.mock({
    'data|100': [{
      'id|+1': 1,
      'city': '@city',
      'title':'@string(10)',
      'houseType':/2室1厅|3室1厅/,
      'area|50-200':100,
      'total|20-300':100,
      'price|1200-10000':5000,
      'onlineTime':'@date(yyyy-MM-dd)',
      'saleWay':/合作|私有/,
      'status':/on|off/,
      'saleStatus':/onSale|sold/
    }],
    page: {
      total: 100,
      current: 1
    }
  });
  tableListData = data;
  global.tableListData = tableListData;
} else {
  tableListData = global.tableListData;
}

module.exports = {

  'GET /api/houseDatas' (req, res) {


    const page = qs.parse(req.query);
    const pageSize = page.pageSize || 10;
    const currentPage = page.page || 1;

    let data;
    let newPage;

    let newData = tableListData.data.concat();

    if (page.filter) {
      console.log(page.filter)
      const d = newData.filter(function (item) {
        let bool=page.filter.every(function(sub){
          return item[sub.name].indexOf(sub.value)>-1;
        });
        return bool;
      });

      data = d.slice((currentPage - 1) * pageSize, currentPage * pageSize);

      newPage = {
        current: currentPage * 1,
        total: d.length
      };
    } else {
      data = tableListData.data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
      tableListData.page.current = currentPage * 1;
      newPage = {
        current: tableListData.page.current,
        total: tableListData.page.total
      };
    }


    setTimeout(function () {
      res.json({
        success: true,
        data,
        page: newPage
      });
    }, 500);
  },

  'POST /api/houseDatas' (req, res) {
    setTimeout(function () {
      const newData = qs.parse(req.body);

      newData.id = tableListData.data.length + 1;
      tableListData.data.unshift(newData);

      tableListData.page.total = tableListData.data.length;
      tableListData.page.current = 1;

      global.tableListData = tableListData;
      res.json({
        success: true,
        data: tableListData.data,
        page: tableListData.page
      });
    }, 500);
  },

  'DELETE /api/houseDatas' (req, res) {
    setTimeout(function () {
      const deleteItem = qs.parse(req.body);

      tableListData.data = tableListData.data.filter(function (item) {
        if (item.id == deleteItem.id) {
          return false;
        }
        return true;
      });

      tableListData.page.total = tableListData.data.length;

      global.tableListData = tableListData;
      res.json({
        success: true,
        data: tableListData.data,
        page: tableListData.page
      });
    }, 500);
  },

  'PUT /api/houseDatas' (req, res) {
    console.log(333);
    setTimeout(function () {
      const editItem = qs.parse(req.body);

      tableListData.data = tableListData.data.map(function (item) {
        if (item.id == editItem.id) {
          console.log({item})
          return editItem;
        }
        return item;
      });

      global.tableListData = tableListData;
      res.json({
        success: true,
        data: tableListData.data,
        page: tableListData.page
      });
    }, 500);
  }

};
