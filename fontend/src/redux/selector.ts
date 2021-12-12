import { createSelector } from "reselect";
import { isEmpty,find } from 'lodash';

export const selectStore = (state : any) => 
!isEmpty(state) ? state : {};
export const selectorUser = () => 
createSelector(
    selectStore,
    state => (!isEmpty(state) ? state.user : {}),
);
