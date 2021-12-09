import { createStore } from 'vuex';
import mockData from '../data-json.js';
import dropDataTemplates from '../drop_data_templates.js'

const store = createStore({
    state: {
        ast: mockData
    },
    mutations: {
        /**
         * 
         * @param {Object} state
         * @param {Object} param1 
         * @param {string} param1.refObj
         * @param {String|Number} param1.accessor
         * @param {Object} node
         */
        insertNode(state, { refObj, accessor, node }) {
            refObj = [...refObj.splice(parseInt(accessor) + 1, 0, node)];
        },

        changeMethod(state, { refObj, accessor, methodName, objectName }) {
            refObj[accessor] = dropDataTemplates.stringUtil(methodName);
        }
    }
});

export default store;