
import { find, isEqual,filter } from 'lodash';
import { useEffect, useState,useMemo } from 'react';
import { callApiGetDelete, callApiGetList } from '../api';
import { empty, getCookie,ucfirst,initId } from '../helper';
import { faEye, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast, } from 'react-toastify'
import { confirmAlert } from 'react-confirm-alert';
import {DebounceInput} from 'react-debounce-input';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from './Loading';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


export default (props: any) => {
    const [data,setData] = useState<any>([])
    const [search, setSearch] = useState({})
    const [perPage, setPerPage] = useState(10)
    const [total, setTotal] = useState(1)
    const [pending, setPending] = useState(true);
    const [columns, setColumn] = useState([])
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);
    const [tableOrder, setTableOrder] = useState(null);

    useEffect(() =>{
        getListData(1,perPage);
    },[])
    const getListData = async (newPage: any,limit : number,options : any = {search : search,order : null,filterItem : []}) => {
        setPending(true)
        let param : any = { page: newPage, limit: limit };
        if(!empty(options.search)){
            param.search = options.search;
        }
        if(!empty(options.filterItem)){
            param.filter = options.filterItem;
        }
        if(!empty(options.order)){
            const order = options.order
            param = {...param,...order};
        }
        const result: any = await callApiGetList(props.api || props.menu, param,props.apiRoute || "/list");
        const data: any = result.data?.data;

        if(data?.table != null){
            if (!isEqual(data.table.columns, columns)) {
                const renderSelector = (col: any, row: any) => {
                    if(col.name === "created_at" || col.name === "updated_at") {
                        return <>{moment(row[col.name]).format("DD/MM/YYYY HH:mm")}</>
                    }
                    switch (col.type) {
                        case "date":
                            return <>{moment(row[col.name]).format("DD/MM/YYYY HH:mm")}</>
                        case "link":
                            return <Link to={"/"+col?.option["model"]+"/view/"+row[col?.option["field_id"]]} target="_blank">{row[col.name]}</Link>
                        case "url":
                            return <a href={row[col.name]}>{row[col.name]}</a>
                        case "array":
                                return <>{JSON.stringify(row[col.name])}</>  
                        case "json":
                            return <></>    
                    }
                    return row[col.name] || <></>
                }
                let newColumns : any = filter(data.table.columns,(crrCol : any)=>crrCol.type !== 'hidden').map((val: any) => ({
                    name: ucfirst(val.label),
                    cell: (row: any) => renderSelector(val, row),
                    sortable: val.type === "text",
                    minWidth: val?.option?.minWidth || null,
                    style: {width: "100%"},
                    col : val,
                }));
                newColumns = newColumns.concat(getListAction())
                setColumn(newColumns);
            }
            if (!isEqual(data.table.total, total)) {
                setTotal(data.table.total)
            }
            let newData: any = [];
            data.table.rows.map((val: any) => {
                let newVal = {}
                Object.keys(val).map((key: any) => (
                    newVal = { ...newVal, ...{ [key]: val[key] } }
                ))
                newData.push(newVal)
            })
            setData(newData)
        }

        setPending(false)
    }
    const getListAction = () => {
        const renderAction = (row : any) => {
            let xml : any = []
            if(props.actionsButton == null){
                if(props.permission.view){
                    xml.push(
                        <Link className="btn btn-primary mgr-10" key={initId()} to={"/"+props.menu+"/view/"+row.id}>
                            <FontAwesomeIcon icon={faEye} />
                        </Link>
                    )
                }
                if(props.permission.update && !props.disableUpdate){
                    xml.push(
                        <Link className="btn btn-primary mgr-10" key={initId()} to={"/"+props.menu+"/update/"+row.id}><FontAwesomeIcon icon={faPencilAlt} /></Link>
                    )
                }
                if(props.permission.delete){
                    xml.push(
                        <button className="btn btn-primary" onClick={()=>deleteData([row])} key={initId()} ><FontAwesomeIcon icon={faTrash} /></button>
                    )
                }
            }else{
                xml = props.actionsButton(row);
            }
            return xml;
        }
        return [{
            name : "Action",
            cell: (row: any) => renderAction(row),
        }]
    }
    const deleteData = (listRow : Array<any>) => {
        const checkRootUser = find(listRow,(_row : any)=>_row.is_root)
        if(!empty(checkRootUser)){
            toast.error("Sorry! We can't root user who is "+checkRootUser.email)
            return false
        }
        const ids : Array<string>= listRow.map((_row : any)=>_row.id)
        confirmAlert({
            title: 'Delete',
            message: 'Do you accept to delete ?',
            buttons: [
              {
                label: 'OK',
                onClick: async () => {
                    setPending(true)
                    const result: any = await callApiGetDelete(props.menu,ids)
                    if(result.status === 200){
                        toast.success("Row has been deleted")
                        getListData(1, perPage);
                    }else{
                        toast.error("Sorry! We can't delete")
                    }
                    setPending(false)
                }
              },
              {
                label: 'Cancel',
                onClick: async () => {

                }
              },
            ]
        });
    }
    const renderAdd = () => {
        return <>{(props.permission.create && !props.disableAdd) ? <Link className="btn btn-primary" to={"/"}>Add</Link> : <></>}</>
    }
    const handlePageChange = (page: any) => {
        setPending(true)
        getListData(page, perPage,{search})
    }
    const handlePerRowsChange = (newPerPage: any, page: any) => {
        setPending(true)
        setPerPage(newPerPage)
        getListData(page, newPerPage,{search})
    }
    const contextActions = useMemo(() => {
		const handleDelete = () => {
            const arr : Array<string> = new Array;
            selectedRows.map((row : any)=> arr.push(row))
            deleteData(arr);
            setToggleCleared(!toggleCleared);
		};

		return (
            <>
                {
                    props.permission.delete && (
                        <button key="delete" className="btn btn-primary" onClick={handleDelete} >
                            Delete
                        </button>
                    )
                }
            </>
		);
	}, [data, selectedRows, toggleCleared]);
    const handleChange = (value : any) => {
        const selectedRows = value.selectedRows;
        setSelectedRows(selectedRows);
    };

    const renderAction = () => {
        const searchChange = async (value : string) => {
            const search = {field : props.searchField || ["name"],value : value}
            setSearch(search)
            
            getListData(1,perPage,{search})
        }
        return(
            <>
                <DebounceInput
                    onChange={event => searchChange(event.target.value)}
                    placeholder="Search"
                    className="search-text" 
                    debounceTimeout={500}
                />
            </>
        )
    }
    const onColumnOrderChange = (cols : any,sortDirection : string) => {
        if(!empty(cols.col?.name)){
            const order : any = {sort_field : cols.col?.name,sort_type : sortDirection}
            setTableOrder(order)
            getListData(1, perPage,{search,order})
        }        
    }
    return(
        <div className="row">
            {
                    pending && <Loading />
            }
            <div className="col-12">
                <DataTable
                    title={renderAdd()}
                    actions={renderAction()}
                    pagination
                    paginationServer
                    paginationTotalRows={total}
                    columns={columns}
                    data={data}
                    selectableRows
                    onSelectedRowsChange={handleChange}
                    contextActions={contextActions}
                    clearSelectedRows={toggleCleared}
                    onChangeRowsPerPage={(perPage : any, page : any) => handlePerRowsChange(perPage, page)}
                    onChangePage={(page: any) => handlePageChange(page)}                            
                    progressPending={pending}
                    sortServer
                    onSort={(column: any, sortDirection: any)=>onColumnOrderChange(column, sortDirection)}
                    progressComponent={<Loading />}
                />
            </div>
        </div>
    )
}