import rise from "./rise/index.js";
import textLine from "./textLine/index.js";

import *  as  lodash from 'lodash'

const particle = {
  rise,
  textLine
} ;

// 按需引入
export {
  rise,
  textLine
};

const DatavParticle = {
  ...particle,
  install(App) {},
};

if (typeof window !== 'undefined') {
  window.DatavParticle = DatavParticle
}
export default DatavParticle;
