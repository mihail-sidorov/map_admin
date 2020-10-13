// const chai = require('chai')
// const fp = require('lodash/fp')
// const { getDupGroup } = require('../src/model/adminPanelApi/utilityFn')
// const expect = chai.expect

// describe("дубликаты", function () {
//     describe("getDupCoord", function () {

//     })

//     describe("getDupGroup", function () {
//         const testData = [
//             {
//                 full_city_name: 'образец1',
//                 street: 'улица Науйойи',
//                 house: '7E',
//                 title: 'title',
//                 lng: 54.407203,
//                 lat: 24.016567,
//                 apartment: 'apartment',
//                 hours: 'hours',
//                 phone: 'phone',
//                 site: 'site',
//                 email: 'nanoid@nanoid.nanoiduser',
//                 duplicateGroup: null,
//                 id: 10,
//                 parent_id: null
//             },
//             {
//                 full_city_name: 'копия1',
//                 street: 'улица Науйойи',
//                 house: '7E',
//                 title: 'title',
//                 lng: 54.407203,
//                 lat: 24.016567,
//                 apartment: 'apartment',
//                 hours: 'hours',
//                 phone: 'phone',
//                 site: 'site',
//                 email: 'nanoid@nanoid.nanoiduser',
//                 duplicateGroup: null,
//                 id: 11,
//                 parent_id: 10
//             },
//             {
//                 full_city_name: '',
//                 street: 'улица Науйойи',
//                 house: '7E',
//                 title: 'title',
//                 lng: 54.407203,
//                 lat: 24.016567,
//                 apartment: 'apartment',
//                 hours: 'hours',
//                 phone: 'phone',
//                 site: 'site',
//                 email: 'nanoid@nanoid.nanoiduser',
//                 duplicateGroup: null,
//                 id: 12,
//                 parent_id: null
//             }
//         ]

//         it('Нет дубликатов', async function () {
//             const getDupGroupData = await getDupGroup([])
//             expect(getDupGroupData).to.be.false
//         })

//         it('Нет групп у дубликатов', async function () {
//             const getDupGroupData = await getDupGroup(testData)
//             expect(getDupGroupData).to.be.deep.equal(testData)
//         })
//     })
// })
