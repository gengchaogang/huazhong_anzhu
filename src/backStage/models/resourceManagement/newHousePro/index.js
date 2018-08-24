import createNewHouse from './createPro/createNewHouse'
import createConcessions from './createPro/createConcessions'
import ImgManagement from './createPro/ImgManagement'
import CreateHouseType from './createPro/CreateHouseType'
import uploadAptitude from './createPro/uploadAptitude'
import CreateProjectTable from './createPro/CreateProjectTable'
import dealData from './dealData';
export default [
  createNewHouse,
  createConcessions,
  ImgManagement,
  CreateHouseType,
  uploadAptitude,
  CreateProjectTable,
  ...dealData,
]
