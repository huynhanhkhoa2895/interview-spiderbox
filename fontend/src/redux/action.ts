import {
    SAVE_LOCAL_STORAGE,
    UPDATE_STATE,
    SET_PERMISSIONS,
    CALL_API,
    LOGOUT,
    UPDATE_FORM_MENU,
    UPDATE_VALUE_FORM_MENU_WITH_NAME,
    UPDATE_LISTEN_FORM_WITH_NAME,
    UPDATE_ATTRIBUTE_FORM_MENU_WITH_NAME,
    ADD_MODULE,
    GET_LIST_WITH_MENU,
    LISTEN_FORM,
    GET_TOTAL_CONTACT_NOT_FINISH
} from "./constants"
export const saveLocalStorage = () => ({
    type: SAVE_LOCAL_STORAGE,
})

export const callApi = (module: any, param: any, callback: any) => ({
    type: CALL_API,
    module,
    param,
    callback
})

export const updateState = (key: any, value: any) => ({
    type: UPDATE_STATE,
    key,
    value
})

export const setPermissions = (user : any) => ({
    type: SET_PERMISSIONS,
    user
})
export const logout = (history : any) => ({
    type: LOGOUT,
    history
})