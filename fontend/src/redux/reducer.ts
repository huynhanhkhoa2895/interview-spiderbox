import { findIndex } from "lodash";
import { 
  UPDATE_STATE, 
  ADD_MODULE_SUCCESS,
  UPDATE_FORM_MENU,
  UPDATE_VALUE_FORM_MENU_WITH_NAME,
  LISTEN_FORM,
  UPDATE_LISTEN_FORM_WITH_NAME,
  UPDATE_ATTRIBUTE_FORM_MENU_WITH_NAME,
  GET_TOTAL_CONTACT_NOT_FINISH
} from "./constants"

const initialState = {
  sidebarShow: 'responsive',
  list: {},
  loadingList: false,
  param: {},
  form: {},
  listenForm: {},
}
let newState: any = {}
let crrForm,crrFormIndex;
const Store = (state = initialState, action: any) => {
  switch (action.type) {
    case UPDATE_STATE:
      newState = { ...state }
      newState[action.key] = action.value
      return newState;
    case GET_TOTAL_CONTACT_NOT_FINISH:
      newState = { ...state }
      newState.totalContactNotFinish = action.value
      return newState;
    case ADD_MODULE_SUCCESS:
      newState = { ...state }
      newState.param = null
      return newState;
    case UPDATE_FORM_MENU:
      newState = { ...state }
      newState.form[action.menu] = action.param 
      return newState;
    case UPDATE_VALUE_FORM_MENU_WITH_NAME:
      newState = { ...state };
      crrFormIndex =  findIndex(newState.form[action.menu],(formEl : any)=>formEl.name === action.name);
      crrForm = newState.form[action.menu][crrFormIndex];
      crrForm.value = action.value;     
      newState.form[action.menu][crrFormIndex] = crrForm
      return newState;
    case LISTEN_FORM:
      newState = { ...state };
      newState.listenForm[action.menu] = action.param
      return newState;
    case UPDATE_LISTEN_FORM_WITH_NAME:
      newState = { ...state };
      const crrListenFormMenu = {...newState.listenForm[action.menu]}
      crrListenFormMenu[action.name] = action.param
      newState.listenForm[action.menu] = crrListenFormMenu
      return newState;
    case UPDATE_ATTRIBUTE_FORM_MENU_WITH_NAME:
      newState = { ...state };
      crrFormIndex =  findIndex(newState.form[action.menu],(formEl : any)=>formEl.name === action.name);
      const crrArr = [...newState.form[action.menu]];
      crrForm = {...crrArr[crrFormIndex]};
      crrForm[action.attr] = action.value;   
      crrArr[crrFormIndex] = crrForm
      newState.form[action.menu] = [...crrArr]
      return {...newState};
    default:
      return state
  }
}
export default Store