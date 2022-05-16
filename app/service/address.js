'use strict';

const {
  Service,
} = require('egg');
const {
  timestamp,
} = require('../utils/time');

class AddressService extends Service {
  // 查询用户地址
  async getAddress(u_id) {
    const {
      app,
    } = this;

    const address = await app.mysql.select('address', {
      where: {
        u_id,
      },
    });

    return address;
  }
  // 地址id查询
  async getAddressId(address_id) {
    const {
      app,
    } = this;

    const address = await app.mysql.select('address', {
      where: {
        address_id,
      },
    });

    return address;
  }
  // 添加收货地址
  async addAddress(data) {
    const {
      app,
    } = this;

    const row = {
      u_id: data.u_id,
      consignee: data.consignee,
      telephone: data.telephone,
      province: data.province,
      city: data.city,
      district: data.district,
      zipcode: data.zipcode,
      detail: data.detail,
      create_time: timestamp(),
      isDefault: data.isDefault,
    };

    const getAddress = await app.mysql.select('address', {
      where: {
        u_id: row.u_id,
      },
    });
    if (row.isDefault) {
      for (let index = 0; index < getAddress.length; index++) {
        if (getAddress[index].isDefault === 1) {
          const options = {
            where: {
              address_id: getAddress[index].address_id,
            },
          };
          await app.mysql.update('address', {
            isDefault: false,
          }, options);
        }
      }
    }

    const address = await app.mysql.insert('address', row);

    return address.affectedRows;
  }

  // 更新收货地址
  async updataAddress(data) {
    const {
      app,
    } = this;
    const row = {
      consignee: data.consignee,
      telephone: data.telephone,
      province: data.province,
      city: data.city,
      district: data.district,
      zipcode: data.zipcode,
      detail: data.detail,
      isDefault: data.isDefault,
    };
    const options = {
      where: {
        address_id: data.address_id,
      },
    };

    const getAddress = await app.mysql.select('address', {
      where: {
        u_id: data.u_id,
      },
    });
    if (row.isDefault) {
      for (let index = 0; index < getAddress.length; index++) {
        if (getAddress[index].isDefault === 1) {
          const options2 = {
            where: {
              address_id: getAddress[index].address_id,
            },
          };
          await app.mysql.update('address', {
            isDefault: false,
          }, options2);
        }
      }
    }
    const address = await app.mysql.update('address', row, options);
    return address.affectedRows;
  }
  // 删除收货地址
  async deleteAddress(address_id) {
    const {
      app,
    } = this;
    const options = {
      address_id,
    };

    const getAddress = await app.mysql.get('address', {
      address_id,
    });
    if (getAddress.isDefault === 1) {
      const getAddressList = await app.mysql.select('address', {
        where: {
          u_id: getAddress.u_id,
        },
      });
      for (let index = 0; index < getAddressList.length; index++) {
        if (getAddressList[index].address_id !== Number(address_id)) {
          await app.mysql.update('address', {
            isDefault: 1,
          }, {
            where: {
              address_id: getAddressList[index].address_id,
            },
          });
          break;
        }
      }
    }
    const address = await app.mysql.delete('address', options);
    return address.affectedRows;
  }
}

module.exports = AddressService;
