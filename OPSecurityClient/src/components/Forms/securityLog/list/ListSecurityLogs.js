import React, { Component } from 'react';

import { withAuthorization } from '../../../Session';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
//import {DataTableCrudDoc} from 'primereact/datatablecruddoc';
import { Growl } from 'primereact/growl';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import 'primeicons/primeicons.css';
import DatePicker from "react-datepicker";
import TimePicker from '../../../timepicker';

import "react-datepicker/dist/react-datepicker.css";
import SecurityLogService from '../../../../api/securityLogs/securitylogservice';
import * as ROLES from '../../../../constants/roles';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

const errorBox = {
    borderRadius: '3px', borderColor: 'rgba(242, 38, 19, 1)'
};
const normalBox = {
    border: '1px solid #a6a6a6'
};

const INITIAL_STATE = {
    isUploading: '',
    StartDate: '',
    StartTime: '',
    EndTime: '',
    ClientNames: [],
    SelectedClientName: '',
    SiteAddress: '',
    TimeDetails: '',
    isStartDateValid: true,
    isStartTimeValid: true,
    isEndTimeValid: true,
    isSelectedClientNameValid: true,
    isSiteAddressValid: true,
    isTimeDetailsValid: true,
    displayDeleteDialog: false,
    disableFields: false,
    disableDeleteButton: true,
    disableApproveButton: true,
    SecurityLogsList:[]
}

class ListSecurityLogs extends Component {

    constructor(props) {
        super(props);
        // this.onPaperSelect = this.onPaperSelect.bind(this);
        // this.addNew = this.addNew.bind(this);
        this.state = INITIAL_STATE;
        this.service = new SecurityLogService();
    }

    getLists(){
        var role = this.props.authUser.roles;
        if (role === ROLES.ADMIN) {
            this.getSecurityLogsList();
            this.getClientName();
        }
        else {
            this.getSecurityLogsList(this.props.authUser.id);
            this.setState({ disableFields: true })
        }
    }

    componentDidMount() {
        this.getLists();
    }

    getClientName() {
        this.service.GetClients().then(data => {
            this.setState({
                ClientNames: data
            })
        });
    }

    getSecurityLogsList(id) {
        this.service.GetAll(id).then(data => {
            if (data && data !== "" && data.length > 0) {
                data.forEach(element => {
                    element.date = new Date(element.date).toDateString()
                });
                this.setState({ SecurityLogsList: data })
            }
        })
        .catch(err =>{
            this.growl.show({ severity: 'error' , summary: 'Error', detail: err });
        })
        
    }

    validateForm = () => {
        let error = "";
        if (!this.state.StartDate || (this.state.StartDate && this.state.StartDate.toString().trim() === '')) {
            this.setState({ isStartDateValid: false });
            error += "Date cannot be empty \n";
        } else { this.setState({ isStartDateValid: true }); }
        if (this.state.StartTime.trim() === '') {
            this.setState({ isStartTimeValid: false });
            error += "Start Time cannot be empty \n";
        } else { this.setState({ isStartTimeValid: true }); }
        if (this.state.EndTime.trim() === '') {
            this.setState({ isEndTimeValid: false });
            error += "End Time cannot be empty \n";
        } else { this.setState({ isEndTimeValid: true }); }
        if (!this.state.SelectedClientName.userId || (this.state.SelectedClientName && this.state.SelectedClientName.userId &&
            this.state.SelectedClientName.userId.trim() === '')) {
            this.setState({ isSelectedClientNameValid: false });
            error += "Client Name cannot be empty \n";
        } else { this.setState({ isSelectedClientNameValid: true }); }
        if (this.state.SiteAddress.trim() === '') {
            this.setState({ isSiteAddressValid: false });
            error += "Site Address cannot be empty \n";
        } else { this.setState({ isSiteAddressValid: true }); }
        if (this.state.TimeDetails.trim() === '') {
            this.setState({ isTimeDetailsValid: false });
            error += "Time Details cannot be empty \n";
        } else { this.setState({ isTimeDetailsValid: true }); }

        if (error !== "") {
            this.setState({ isValidForm: false, error: true });
            return false;
        }
        else {
            this.setState({ isValidForm: true, error: false });
            return true;
        }
    }

    resetForm = () => {
        this.setState({
            isUploading: '',
            StartDate: '',
            StartTime: '',
            EndTime: '',
            ClientNames: [],
            SelectedClientName: '',
            SiteAddress: '',
            TimeDetails: '',
            isStartDateValid: true,
            isStartTimeValid: true,
            isEndTimeValid: true,
            isSelectedClientNameValid: true,
            isSiteAddressValid: true,
            isTimeDetailsValid: true,
            disableFields: false,
            displayDeleteDialog: false,
            disableDeleteButton: true,
            disableApproveButton: true,
            SecurityLogsList: []

        },() =>{
            this.getLists();
        })
    }

    Delete = () => {
        var Obj = {
            SysSerial: this.state.SecurityLogId,
            ClientId: this.state.SelectedClientName.userId,                    //"1",
            Date: this.state.StartDate,                                 //"2020/03/03",
            EndTime: this.state.EndTime,                                //"2020/03/03",
            SiteAddress: this.state.SiteAddress,                        //"abc",
            StartTime: this.state.StartTime,                            //"2020/03/03",
            TimeDetails: this.state.TimeDetails,                        //"abc"
            isApproved: this.state.IsApproved
        }

        try {
            this.service.Delete(Obj).then(() => {
                this.resetForm();
                this.setState({
                    displayDialog: false,
                    displayDeleteDialog: false,
                    disableDeleteButton: true,
                    disableApproveButton: true
                })
            })
        } catch (e) {
            debugger;
            this.growl.show({ severity: 'error', summary: 'Error', detail: 'Cannot Delete' });
            this.setState({ isLoading: false });
            console.log(e);
        }
    }

    onSecurityLogSelect = (e) => {
        this.setState({
            displayDialog: true,
            StartDate: new Date(e.data.date),
            StartTime: e.data.startTime,
            EndTime: e.data.endTime,
            SelectedClientName: { userName: e.data.clientName, userId: e.data.clientId.toString() },
            SiteAddress: e.data.siteAddress,
            TimeDetails: e.data.timeDetails,
            SecurityLogId: e.data.sysSerial,
            IsApproved: e.data.isApproved,
            disableDeleteButton: false,
            // SecurityLog: Object.assign({}, e.data)
        });
        if (e.data.isApproved && e.data.isApproved === "Yes") {
            this.setState({ disableApproveButton: true });
        }
        else {
            this.setState({ disableApproveButton: false });
        }
    }

    onClientSelected(name) {
        this.setState({ SelectedClientName: name.value })
    }

    SaveEdit = (approve) => {
        var validForm = this.validateForm();
        if (validForm) {

            var Obj = {
                SysSerial: this.state.SecurityLogId,
                ClientId: this.state.SelectedClientName.userId,                    //"1",
                Date: this.state.StartDate.toLocaleString(),                                 //"2020/03/03",
                EndTime: this.state.EndTime,                                //"2020/03/03",
                SiteAddress: this.state.SiteAddress,                        //"abc",
                StartTime: this.state.StartTime,                            //"2020/03/03",
                TimeDetails: this.state.TimeDetails,                        //"abc"
                isApproved: this.state.IsApproved,
            }

            if ((approve && approve === true) || this.state.IsApproved === "Yes") {
                Obj.isApproved = "Yes"
            }
            if (approve && approve === false) {
                Obj.isApproved = "No"
            }

            this.service
                .Edit(Obj)
                .then(() => {
                    if (approve && approve === true) {
                        this.growl.show({ severity: 'success', summary: 'Success', detail: 'Approved' });
                    }
                    else {
                        this.growl.show({ severity: 'success', summary: 'Success', detail: 'Successfully Updated' });
                    }
                    this.setState({
                        displayDialog: false,
                        disableDeleteButton: true,
                        disableApproveButton: true
                    })
                    this.resetForm();
                })
                .catch((error) => {
                    this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error: while updating' });
                    this.setState({ isLoading: false });
                })
        }
        else {

        }
    }
    onSecurityLogRowSelect(e) {
        this.setState({
            StartDate: new Date(e.data.date),
            StartTime: e.data.startTime,
            EndTime: e.data.endTime,
            SelectedClientName: { userName: e.data.clientName, userId: e.data.clientId.toString() },
            SiteAddress: e.data.siteAddress,
            TimeDetails: e.data.timeDetails,
            SecurityLogId: e.data.sysSerial,
            IsApproved: e.data.isApproved,
            disableDeleteButton: false,
        })
        if (e.data.isApproved && e.data.isApproved === "Yes") {
            this.setState({ disableApproveButton: true });
        }
        else {
            this.setState({ disableApproveButton: false });
        }
    }

    ApproveSecurityReport() {
        this.SaveEdit(true);
    }

    rowClass(data) {
        return {
            "approvedRow": data.isApproved && data.isApproved === "Yes",
            "needApprovalRow": !data.isApproved || data.isApproved === "No",
        }
    }
    showDeleteModal() {
        if (this.state.selectedSecurityLogs && this.state.selectedSecurityLogs !== null && this.state.selectedSecurityLogs !== "") {
            this.setState({
                displayDeleteDialog: true
            })
        }
    }

    printDocument() {
        const input = document.getElementById('divToPrint');
        this.setState({
            displayDownloadDialog: true,
            displayDialog: false
        })
        setTimeout(() => {
            html2canvas(input)
                .then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF();
                    pdf.addImage(imgData, 'JPEG', 0, 0);
                    pdf.save("security_log.pdf");
                });
            this.setState({
                displayDownloadDialog: false
            })
        }, 2000);
    }

    render() {
        var { disableFields, disableDeleteButton, disableApproveButton } = this.state
        var header;
        let dialogFooter;

        if (this.props.authUser.roles.includes(ROLES.ADMIN)) {

            header = <div className="p-col-6 p-sm-6 p-md-6 p-lg-6" style={{ textAlign: 'left', display: 'flex' }}>
                <div className="p-col-3 p-sm-3 p-md-3 p-lg-3" >
                    <Button className="p-button-success" icon="pi pi-check" iconPos="left" label="Approve"
                        disabled={disableApproveButton} onClick={(e) => this.ApproveSecurityReport()} />
                </div>
                <div className="p-col-3 p-sm-3 p-md-3 p-lg-3">
                    <Button className="p-button-danger" icon="pi pi-trash" iconPos="left" label="Delete"
                        disabled={disableDeleteButton} onClick={(e) => this.showDeleteModal()} />
                </div>
            </div>

            dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
                <div className="p-col-12 p-sm-12 p-md-12 p-lg-12">
                    {this.state.isLoading === true ? <ProgressBar mode="indeterminate" style={{ height: '2px' }} /> : null}
                </div>
                <Button label="Save" className="p-button-primary ui-btns" disabled={this.state.isLoading} onClick={(e) => this.SaveEdit(e)} />
                <Button label="Delete" className="p-button-secondary" style={{ backgroundColor: 'red', color: 'white' }} disabled={this.state.isLoading} onClick={this.Delete} />
                <Button label="Download" className="p-button ui-btns-download" disabled={this.state.isLoading} onClick={() => this.printDocument()} />
           </div>
        }

        return (
            <div>
                <Growl ref={(el) => this.growl = el}></Growl>
                <div className="p-grid p-fluid" >
                    <div className="card card-w-title">
                        <h1>Security Shift Logs</h1>
                        <div className="p-grid" style={{ marginTop: '8px' }} ></div>
                        <div className="content-section implementation">
                            <DataTable header={header} value={this.state.SecurityLogsList} paginator={this.state.isLoading === false} rows={15} onRowDoubleClick={this.onSecurityLogSelect} responsive={true}
                                selectionMode="single" selection={this.state.selectedSecurityLogs} onSelectionChange={e => this.setState({ selectedSecurityLogs: e.value })}
                                resizableColumns={true} columnResizeMode="fit" rowClassName={this.rowClass}
                                onRowClick={e => this.onSecurityLogRowSelect(e)} sortField="isApproved" sortOrder={1}>
                                <Column field="clientName" header="Client Name" filter={true} filterPlaceholder="search by name" />
                                <Column field="date" header="Date Created" sortable={true}/>
                                <Column field="siteAddress" value="Site Address" header="Site Address" filter={true} filterPlaceholder="search by keyword"  />
                                <Column field="timeDetails" header="Time Details" sortable={true} />
                                <Column field="createdBy" header="Submitted By" filter={true} filterPlaceholder="search by name" />
                                <Column field="isApproved" header="Approved" sortable={true} />
                            </DataTable>
                            <div className="p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ paddingTop: '20px' }}>
                                {this.state.isLoading === true ?
                                    <div>
                                        <p style={{ textAlign: 'center', fontSize: '20px' }}>Loading Data </p>
                                        <ProgressBar style={{ marginTop: '40px', height: '2px' }} mode="indeterminate" />
                                    </div>
                                    : null
                                }
                            </div>
                            <Dialog visible={this.state.displayDeleteDialog} width="300px" header="You sure to delete this Report?"
                                modal={true} onHide={() => this.setState({ displayDeleteDialog: false })}>
                                {
                                    <div className="ui-dialog-buttonpane p-clearfix">
                                        <Button label="Yes" style={{ width: 100 }} className="p-button-danger" onClick={() => this.Delete()} />
                                        <Button label="No" style={{ width: 100, marginLeft: 5 }} className="p-button-primary" onClick={() => this.setState({ displayDeleteDialog: false })} />
                                    </div>
                                }
                            </Dialog>
                            <Dialog visible={this.state.displayDialog} width="300px" header="Security Log Details"
                                modal={true} footer={dialogFooter} onHide={() => this.setState({ displayDialog: false })}
                                contentStyle={{ maxHeight: "450px", overflow: "auto" }}>a
                                {
                                    <div className="p-grid p-fluid">
                                        <div className="p-grid p-fluid" >
                                            <div className="card card-w-title">
                                                <h1>Edit Security Log</h1>
                                                <div className="p-grid ">
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Date <span style={{ color: 'red' }}>*</span></label>
                                                            <DatePicker disabled={disableFields} placeholderText="Select Date"
                                                                selected={this.state.StartDate}
                                                                onChange={date => this.setState({ StartDate: date })}
                                                                className={this.state.isStartDateValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"} />
                                                        </span>
                                                    </div>

                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                    </div>

                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">START TIME <span style={{ color: 'red' }}>*</span></label>
                                                            <TimePicker time={this.state.StartTime} theme="Ash" placeholder="Start Time"
                                                                onSet={(val) => {
                                                                    this.setState({ StartTime: val.format24 });
                                                                }}
                                                                className={this.state.isStartTimeValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"}
                                                                disabled={disableFields}
                                                            />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">END TIME <span style={{ color: 'red' }}>*</span></label>
                                                            <TimePicker time={this.state.EndTime} theme="Ash" placeholder="End Time"
                                                                onSet={(val) => {
                                                                    this.setState({ EndTime: val.format24 });
                                                                }}
                                                                className={this.state.isEndTimeValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"}
                                                                disabled={disableFields}
                                                            />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Client Name <span style={{ color: 'red' }}>*</span></label>
                                                            <Dropdown disabled={disableFields} editable={true} optionLabel="userName" placeholder="Select" value={this.state.SelectedClientName ? this.state.SelectedClientName.userName : ""} readOnly={this.state.isLoading} options={this.state.ClientNames} onChange={(e) => this.onClientSelected(e)}
                                                                style={this.state.isSelectedClientNameValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Site Address <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText disabled={disableFields} placeholder="# Street, Unit, City, Province" value={this.state.SiteAddress} type="text" size="30" onChange={(e) => this.setState({ SiteAddress: e.target.value })}
                                                                style={this.state.isSiteAddressValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Time Details <span style={{ color: 'red' }}>*</span></label>
                                                            <InputTextarea disabled={disableFields} rows={10} cols={30} value={this.state.TimeDetails} onChange={(e) => this.setState({ TimeDetails: e.target.value })} autoResize={true}
                                                                style={this.state.isTimeDetailsValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className="p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ color: 'red' }}>
                                                        {this.state.error === true ? "Please fill all the required(red marked) fields" : null}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                }
                            </Dialog>
                            <Dialog visible={this.state.displayDownloadDialog} width="500px" modal={true}
                                onHide={() => this.setState({ displayDownloadDialog: false })}>
                                {
                                    <div className="p-grid p-fluid" id="divToPrint">
                                        <div className="p-grid p-fluid" >
                                            <div className="card card-w-title">
                                                <h1>Security Log Details</h1>
                                                <div className="p-grid ">
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Date: </label>
                                                        {this.state.StartDate && this.state.StartDate.toString() ? this.state.StartDate.toString() : ""}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">START TIME: </label>
                                                        {this.state.StartTime}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">END TIME: </label>
                                                        {this.state.EndTime}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Client Name: </label>
                                                        {this.state.SelectedClientName ? this.state.SelectedClientName.userName : ""}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Site Address: </label>
                                                        {this.state.SiteAddress}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Time Details: </label>
                                                        {this.state.TimeDetails}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                }
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
// export default ListSecurityLogs;
const condition = authUser => authUser && authUser.roles && (authUser.roles === ROLES.ADMIN || authUser.roles === ROLES.CLIENT)
export default withAuthorization(condition)(ListSecurityLogs);