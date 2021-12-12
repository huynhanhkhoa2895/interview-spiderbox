import { takeLatest, call, put, select } from 'redux-saga/effects';
import { 
    SAVE_LOCAL_STORAGE,
} from './constants';
function* _saveLocalStorage(){

}
export default function* rootSaga() {
    yield takeLatest(SAVE_LOCAL_STORAGE, _saveLocalStorage);
}