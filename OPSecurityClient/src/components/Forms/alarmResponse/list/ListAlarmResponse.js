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
import { RadioButton } from 'primereact/radiobutton';
import 'primeicons/primeicons.css';
import DatePicker from "react-datepicker";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import TimePicker from '../../../timepicker';

import "react-datepicker/dist/react-datepicker.css";
import AlarmResponseService from '../../../../api/alarmResponse/alarmResponseService';

import * as ROLES from '../../../../constants/roles';

const errorBox = {
    borderRadius: '3px', borderColor: 'rgba(242, 38, 19, 1)'
};
const normalBox = {
    border: '1px solid #a6a6a6'
};
const errorBoxForCheckBox = {
    border: '1px solid red', borderRadius: '3px'
};

const INITIAL_STATE = {
    isLoading: false,
    error: false,

    ClientNames: [],
    SelectedClientName: '',

    SysSerial: '',
    SiteAddress: '',
    DateReceived: '',
    Arrival: '',
    Departure: '',
    KeyBox: '',
    Keys: '',
    AlarmType: [
        'Hold Up', 'Panic/Duress', 'Improper Open/ Close', 'Day/ Night Early', 'Day/ Night Late',
        'Safe Vault', 'Perimeter', 'Interior', 'Critical Function', 'Fire', 'Fire Trouble', 'Glass Break',
    ],
    OtherAlarmType: '',
    DispatchRequestType: ['Crisis', 'Elevator Entrapment', 'General Assist', 'General Admit', 'Secure Tranport/Delivery'],
    RequestedBy: '',
    AlarmZone: '',
    ServiceDispatched: '',
    ServiceCallNo: '',
    ActionTaken: '',
    Comments: '',
    Subscriber: '',
    Name: '',
    FireDept: '',
    PoliceServiceBadge: '',
    Other: '',
    ReportToClient: ['Mail', 'Email', 'Left On Site'],
    DispatchRequestTypeSelected: [],
    AlarmTypeSelected: [],
    ReportToClientSelected: [],

    isSiteAddressValid: true,
    isDateReceivedValid: true,
    isArrivalValid: true,
    isDepartureValid: true,
    isKeysValid: true,
    isRequestedByValid: true,
    isServiceDispatchedValid: true,
    isActionTakenValid: true,
    isCommentsValid: true,
    isSubscriberValid: true,

    isSelectedClientNameValid: true,

    displayDeleteDialog: false,
    disableFields: false,
    disableDeleteButton: true,
    disableApproveButton: true
}

class ListAlarmResponse extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
        this.service = new AlarmResponseService();
    }

    getLists(){
        var role = this.props.authUser.roles;
        if (role === ROLES.ADMIN) {
            this.getAlarmResponseList();
            this.getClientNames();
        }
    }

    componentDidMount() {
       this.getLists();
    }

    getClientNames() {
        this.service.GetClients().then(data => {
            this.setState({
                ClientNames: data
            })
        });
    }

    getAlarmResponseList(id) {
        this.service.GetAll(id).then(data => {
            if (data && data != "" && data.length > 0) {
                data.forEach(element => {
                    element.dateReceived = new Date(element.dateReceived).toDateString()
                });
                this.setState({ AlarmResponseList: data })
            }
        });
    }
    validateForm = () => {
        let error = "";

        if (!this.state.SelectedClientName.userId || (this.state.SelectedClientName && this.state.SelectedClientName.userId &&
            this.state.SelectedClientName.userId.trim() === '')) {
            this.setState({ isSelectedClientNameValid: false });
            error += "Client Name cannot be empty \n";
        } else { this.setState({ isSelectedClientNameValid: true }); }
        if (this.state.SiteAddress.trim() === '') {
            this.setState({ isSiteAddressValid: false });
            error += "Site Address cannot be empty \n";
        } else { this.setState({ isSiteAddressValid: true }) }
        if (!this.state.DateReceived || (this.state.DateReceived && this.state.DateReceived.toString().trim() === '')) {
            this.setState({ isDateReceivedValid: false });
            error += "Date Received cannot be empty \n";
        } else { this.setState({ isDateReceivedValid: true }); }
        if (this.state.Arrival.toString().trim() === '') {
            this.setState({ isArrivalValid: false });
            error += "Arrival cannot be empty \n";
        } else { this.setState({ isArrivalValid: true }) }
        if (this.state.Departure.toString().trim() === '') {
            this.setState({ isDepartureValid: false });
            error += "Departure cannot be empty \n";
        } else { this.setState({ isDepartureValid: true }) }
        if (this.state.Keys.trim() === '') {
            this.setState({ isKeysValid: false });
            error += "Keys cannot be empty \n";
        } else { this.setState({ isKeysValid: true }) }
        if (this.state.RequestedBy.trim() === '') {
            this.setState({ isRequestedByValid: false });
            error += "Requested By cannot be empty \n";
        } else { this.setState({ isRequestedByValid: true }) }
        if (this.state.ServiceDispatched.trim() === '') {
            this.setState({ isServiceDispatchedValid: false });
            error += "Service Dispatched cannot be empty \n";
        } else { this.setState({ isServiceDispatchedValid: true }) }
        if (this.state.ActionTaken.trim() === '') {
            this.setState({ isActionTakenValid: false });
            error += "Action Taken cannot be empty \n";
        } else { this.setState({ isActionTakenValid: true }) }
        if (this.state.Comments.trim() === '') {
            this.setState({ isCommentsValid: false });
            error += "Comment cannot be empty \n";
        } else { this.setState({ isCommentsValid: true }) }
        if (this.state.Subscriber.trim() === '') {
            this.setState({ isSubscriberValid: false });
            error += "Subscriber cannot be empty \n";
        } else { this.setState({ isSubscriberValid: true }) }

        if (error !== "") {
            this.setState({ isValidForm: true, error: true });
            return false;
        }
        else {
            this.setState({ isValidForm: true, error: false });
            return true;
        }
    }

    resetForm = () => {
        this.setState({
            isLoading: false,
            error: false,

            ClientNames: [],
            SelectedClientName: '',

            SysSerial: '',
            SiteAddress: '',
            DateReceived: '',
            Arrival: '',
            Departure: '',
            KeyBox: '',
            Keys: '',
            AlarmType: [
                'Hold Up', 'Panic/Duress', 'Improper Open/ Close', 'Day/ Night Early', 'Day/ Night Late',
                'Safe Vault', 'Perimeter', 'Interior', 'Critical Function', 'Fire', 'Fire Trouble', 'Glass Break',
            ],
            OtherAlarmType: '',
            DispatchRequestType: ['Crisis', 'Elevator Entrapment', 'General Assist', 'General Admit', 'Secure Tranport/Delivery'],
            RequestedBy: '',
            AlarmZone: '',
            ServiceDispatched: '',
            ServiceCallNo: '',
            ActionTaken: '',
            Comments: '',
            Subscriber: '',
            Name: '',
            FireDept: '',
            PoliceServiceBadge: '',
            Other: '',
            ReportToClient: ['Mail', 'Email', 'Left On Site'],
            DispatchRequestTypeSelected: [],
            AlarmTypeSelected: [],
            ReportToClientSelected: [],

            isSiteAddressValid: true,
            isDateReceivedValid: true,
            isArrivalValid: true,
            isDepartureValid: true,
            isKeysValid: true,
            isRequestedByValid: true,
            isServiceDispatchedValid: true,
            isActionTakenValid: true,
            isCommentsValid: true,
            isSubscriberValid: true,

            isSelectedClientNameValid: true,

            displayDeleteDialog: false,
            disableFields: false,
            disableDeleteButton: true,
            disableApproveButton: true,

            AlarmResponseList:[]
        }, () =>{
            this.getLists();
        })
    }

    Delete = () => {
        var Obj = {
            SysSerial: this.state.AlarmResponseId,
            ClientId: this.state.SelectedClientName.userId,
            SiteAddress: this.state.SiteAddress,
            DateReceived: this.state.DateReceived,
            Arrival: this.state.Arrival,
            Departure: this.state.Departure,
            KeyBox: this.state.KeyBox,
            Keys: this.state.Keys,
            AlarmType: this.state.AlarmTypeSelected,
            OtherAlarmType: this.state.OtherAlarmType,
            DispatchRequestType: this.state.DispatchRequestTypeSelected,
            RequestedBy: this.state.RequestedBy,
            AlarmZone: this.state.AlarmZone,
            ServiceDispatched: this.state.ServiceDispatched,
            ServiceCallNo: this.state.ServiceCallNo,
            ActionTaken: this.state.ActionTaken,
            Comments: this.state.Comments,
            Subscriber: this.state.Subscriber,
            Name: this.state.Name,
            FireDept: this.state.FireDept,
            PoliceServiceBadge: this.state.PoliceServiceBadge,
            Other: this.state.Other,
            ReportToClient: this.state.ReportToClientSelected,
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
            this.growl.show({ severity: 'error', summary: 'Error', detail: 'Cannot Delete' });
            this.setState({ isLoading: false });
            console.log(e);
        }
    }

    onDblClick = (e) => {
        this.setState({
            AlarmResponseId: e.data.sysSerial,
            // SelectedClientName: { userName: e.data.clientName, userId: e.data.clientId.toString() },
            SiteAddress: e.data.siteAddress,
            // DateReceived: new Date(e.data.dateReceived),
            Arrival: e.data.arrival,
            Departure: e.data.departure,
            KeyBox: e.data.keyBox,
            Keys: e.data.keys,
            AlarmTypeSelected: e.data.alarmType,
            OtherAlarmType: e.data.otherAlarmType,
            DispatchRequestTypeSelected: e.data.dispatchRequestType,
            RequestedBy: e.data.requestedBy,
            AlarmZone: e.data.alarmZone,
            ServiceDispatched: e.data.serviceDispatched,
            ServiceCallNo: e.data.serviceCallNo,
            ActionTaken: e.data.actionTaken,
            Comments: e.data.comments,
            Subscriber: e.data.subscriber,
            Name: e.data.name,
            FireDept: e.data.fireDept,
            PoliceServiceBadge: e.data.policeServiceBadge,
            Other: e.data.other,
            ReportToClientSelected: e.data.reportToClient,
            IsApproved: e.data.isApproved,

            displayDialog: true,
            disableDeleteButton: false,
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
    changeDispatchRequestType(e) {
        var arr = this.state.DispatchRequestTypeSelected;
        var ind = arr.findIndex(x => x === e.value);
        if (ind === -1) {
            arr.push(e.value)
        }
        else {
            arr.splice(ind, 1);
        }

        this.setState({
            DispatchRequestTypeSelected: arr
        })
    }

    changeAlarmType(e) {
        var arr = this.state.AlarmTypeSelected;
        var ind = arr.findIndex(x => x === e.value);
        if (ind === -1) {
            arr.push(e.value)
        }
        else {
            arr.splice(ind, 1);
        }

        this.setState({
            AlarmTypeSelected: arr
        })
    }
    changeReportToClient(e) {
        var arr = this.state.ReportToClientSelected;
        var ind = arr.findIndex(x => x === e.value);
        if (ind === -1) {
            arr.push(e.value)
        }
        else {
            arr.splice(ind, 1);
        }

        this.setState({
            ReportToClientSelected: arr
        })
    }

    SaveEdit = (approve) => {
        var validForm = this.validateForm();
        if (validForm) {

            var Obj = {
                SysSerial: this.state.AlarmResponseId,
                ClientId: this.state.SelectedClientName.userId,
                SiteAddress: this.state.SiteAddress,
                DateReceived: this.state.DateReceived.toLocaleString(),
                Arrival: this.state.Arrival,
                Departure: this.state.Departure,
                KeyBox: this.state.KeyBox,
                Keys: this.state.Keys,
                AlarmType: this.state.AlarmTypeSelected,
                OtherAlarmType: this.state.OtherAlarmType,
                DispatchRequestType: this.state.DispatchRequestTypeSelected,
                RequestedBy: this.state.RequestedBy,
                AlarmZone: this.state.AlarmZone,
                ServiceDispatched: this.state.ServiceDispatched,
                ServiceCallNo: this.state.ServiceCallNo,
                ActionTaken: this.state.ActionTaken,
                Comments: this.state.Comments,
                Subscriber: this.state.Subscriber,
                Name: this.state.Name,
                FireDept: this.state.FireDept,
                PoliceServiceBadge: this.state.PoliceServiceBadge,
                Other: this.state.Other,
                ReportToClient: this.state.ReportToClientSelected,
                isApproved: this.state.IsApproved,
            }

            if (approve && approve === true || this.state.IsApproved === "Yes") {
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

    onRowSelect(e) {
        this.setState({
            AlarmResponseId: e.data.sysSerial,
            SelectedClientName: { userName: e.data.clientName, userId: e.data.clientId.toString() },
            SiteAddress: e.data.siteAddress,
            DateReceived: new Date(e.data.dateReceived),
            Arrival: e.data.arrival,
            Departure: e.data.departure,
            KeyBox: e.data.keyBox,
            Keys: e.data.keys,
            AlarmTypeSelected: e.data.alarmType,
            OtherAlarmType: e.data.otherAlarmType,
            DispatchRequestTypeSelected: e.data.dispatchRequestType,
            RequestedBy: e.data.requestedBy,
            AlarmZone: e.data.alarmZone,
            ServiceDispatched: e.data.serviceDispatched,
            ServiceCallNo: e.data.serviceCallNo,
            ActionTaken: e.data.actionTaken,
            Comments: e.data.comments,
            Subscriber: e.data.subscriber,
            Name: e.data.name,
            FireDept: e.data.fireDept,
            PoliceServiceBadge: e.data.policeServiceBadge,
            Other: e.data.other,
            ReportToClientSelected: e.data.reportToClient,
            disableDeleteButton: false,
            IsApproved: e.data.isApproved
        });
        if (e.data.isApproved && e.data.isApproved === "Yes") {
            this.setState({ disableApproveButton: true });
        }
        else {
            this.setState({ disableApproveButton: false });
        }
    }

    ApproveAlarmResponse() {
        this.SaveEdit(true);
    }

    rowClass(data) {
        return {
            "approvedRow": data.isApproved && data.isApproved === "Yes",
            "needApprovalRow": !data.isApproved || data.isApproved === "No",
        }
    }
    showDeleteModal() {
        if (this.state.SelectedAlarmResponse && this.state.SelectedAlarmResponse !== null && this.state.SelectedAlarmResponse !== "") {
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
                    pdf.save("alarm_response_report.pdf");
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
                        disabled={disableApproveButton} onClick={(e) => this.ApproveAlarmResponse()} />
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
                        <h1>Alarm Response Reports</h1>
                        <div className="p-grid" style={{ marginTop: '8px' }} ></div>
                        <div className="content-section implementation">
                            <DataTable header={header} value={this.state.AlarmResponseList} paginator={this.state.isLoading === false} rows={15} onRowDoubleClick={this.onDblClick} responsive={true}
                                selectionMode="single" selection={this.state.SelectedAlarmResponse} onSelectionChange={e => this.setState({ SelectedAlarmResponse: e.value })}
                                resizableColumns={true} columnResizeMode="fit" rowClassName={this.rowClass}
                                onRowClick={e => this.onRowSelect(e)} sortField="isApproved" sortOrder={1}>
                                <Column field="clientName" header="Client Name" filter={true} filterPlaceholder="search by name" />
                                <Column field="dateReceived" header="Date Received" sortable={true}/>
                                <Column field="siteAddress" value="Site Address" header="Site Address" filter={true} filterPlaceholder="search by address" />
                                <Column field="requestedBy" header="Requested By" filter={true} filterPlaceholder="search by name" />
                                <Column field="createdBy" header="Submitted By" filter={true} filterPlaceholder="search by name" />
                                <Column field="isApproved" header="Approved" sortable={true} />
                            </DataTable>
                            <div className="p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ paddingTop: '20px' }}>
                                {this.state.isLoading === true ?
                                    <div>
                                        <p style={{ textAlign: 'center', fontSize: '20px' }}>Loading Data </p>
                                        <ProgressBar style={{ marginTop: '40px' }} mode="indeterminate" style={{ height: '2px' }} />
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
                            <Dialog visible={this.state.displayDialog} width="300px"
                                header="Alarm Response Details" modal={true} footer={dialogFooter}
                                onHide={() => this.setState({ displayDialog: false })}
                                contentStyle={{ maxHeight: "450px", overflow: "auto" }}>
                                {
                                    <div className="p-grid p-fluid">
                                        <div className="p-grid p-fluid" >
                                            <div className="card card-w-title">
                                                <h1>Edit Alarm Response Report</h1>
                                                <div className="p-grid p-col-12">
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
                                                            <InputText placeholder="# Street, Unit, City, Province" value={this.state.SiteAddress} type="text" size="30"
                                                                onChange={(e) => this.setState({ SiteAddress: e.target.value })}
                                                                style={this.state.isSiteAddressValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Date Received <span style={{ color: 'red' }}>*</span></label>
                                                            <DatePicker
                                                                selected={this.state.DateReceived}
                                                                onChange={date => this.setState({ DateReceived: date })}
                                                                className={this.state.isDateReceivedValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"}
                                                            />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Arrival <span style={{ color: 'red' }}>*</span></label>
                                                            <TimePicker time={this.state.Arrival} theme="Ash" placeholder="Arrival Time"
                                                                onSet={(val) => {
                                                                    this.setState({ Arrival: val.format24 })
                                                                }}
                                                                className={this.state.isArrivalValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"}
                                                            />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Departure <span style={{ color: 'red' }}>*</span></label>
                                                            <TimePicker time={this.state.Departure} theme="Ash" placeholder="Departure Time"
                                                                onSet={(val) => {
                                                                    this.setState({ Departure: val.format24 })
                                                                }}
                                                                className={this.state.isDepartureValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"}
                                                            />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Key# Box#</label>
                                                            <InputText placeholder="Key# Box#" value={this.state.KeyBox} type="text" size="30"
                                                                onChange={(e) => this.setState({ KeyBox: e.target.value })} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Keys: <span style={{ color: 'red' }}>*</span></label>
                                                            <div style={this.state.isKeysValid === true ? {} : errorBoxForCheckBox}>
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">Used</span>
                                                                <RadioButton value="Used" name="Keys"
                                                                    onChange={(e) => this.setState({ Keys: e.value })}
                                                                    checked={this.state.Keys === 'Used'} />
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">Not Used</span>
                                                                <RadioButton value="NotUsed" name="Keys"
                                                                    onChange={(e) => this.setState({ Keys: e.value })}
                                                                    checked={this.state.Keys === 'NotUsed'} />
                                                            </div>
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Alarm Type: </label>
                                                            <div>
                                                                {
                                                                    this.state.AlarmType.map(x =>
                                                                        <div key={x}>
                                                                            <RadioButton value={x} name="AlarmType"
                                                                                onChange={(e) => this.changeAlarmType(e)}
                                                                                checked={this.state.AlarmTypeSelected.includes(x)} />
                                                                            <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">{x}</span>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Dispatch Request Type:</label>
                                                            <div>
                                                                {
                                                                    this.state.DispatchRequestType.map(x =>
                                                                        <div key={x}>
                                                                            <RadioButton value={x} name="DispatchRequestType"
                                                                                onChange={(e) => this.changeDispatchRequestType(e)}
                                                                                checked={this.state.DispatchRequestTypeSelected.includes(x)} />
                                                                            <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">{x}</span>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Other</label>
                                                            <InputText placeholder="Other Alarm Type" value={this.state.OtherAlarmType} type="text"
                                                                size="30" onChange={(e) => this.setState({ OtherAlarmType: e.target.value })} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Requested By <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Requested By" value={this.state.RequestedBy} type="text"
                                                                size="30" onChange={(e) => this.setState({ RequestedBy: e.target.value })}
                                                                style={this.state.isRequestedByValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Alarm Zone and Description</label>
                                                            <InputText placeholder="Alarm Zone" value={this.state.AlarmZone} type="text"
                                                                size="30" onChange={(e) => this.setState({ AlarmZone: e.target.value })} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Service Dispatched: <span style={{ color: 'red' }}>*</span></label>
                                                            <div style={this.state.isServiceDispatchedValid === true ? {} : errorBoxForCheckBox}>
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">Yes</span> <RadioButton value="Yes"
                                                                    name="ServiceDispatched" onChange={(e) => this.setState({ ServiceDispatched: e.value })}
                                                                    checked={this.state.ServiceDispatched === 'Yes'} />
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">No</span> <RadioButton value="No"
                                                                    name="ServiceDispatched" onChange={(e) => this.setState({ ServiceDispatched: e.value })}
                                                                    checked={this.state.ServiceDispatched === 'No'} />
                                                            </div>
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Service Call # </label>
                                                            <InputText placeholder="Service Call # " value={this.state.ServiceCallNo} type="text"
                                                                size="30" onChange={(e) => this.setState({ ServiceCallNo: e.target.value })} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Action Taken <span style={{ color: 'red' }}>*</span></label>
                                                            <InputTextarea rows={10} cols={30} value={this.state.ActionTaken}
                                                                onChange={(e) => this.setState({ ActionTaken: e.target.value })} autoResize={true}
                                                                style={this.state.isActionTakenValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Comments / Recommendations: <span style={{ color: 'red' }}>*</span></label>
                                                            <InputTextarea rows={10} cols={30} value={this.state.Comments}
                                                                onChange={(e) => this.setState({ Comments: e.target.value })} autoResize={true}
                                                                style={this.state.isCommentsValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Subscriber: <span style={{ color: 'red' }}>*</span></label>
                                                            <div style={this.state.isSubscriberValid === true ? {} : errorBoxForCheckBox}>
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">Yes</span> <RadioButton value="Yes"
                                                                    name="Subscriber" onChange={(e) => this.setState({ Subscriber: e.value })}
                                                                    checked={this.state.Subscriber === 'Yes'} />
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">No</span> <RadioButton value="No"
                                                                    name="Subscriber" onChange={(e) => this.setState({ Subscriber: e.value })}
                                                                    checked={this.state.Subscriber === 'No'} />
                                                            </div>
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Name # </label>
                                                            <InputText placeholder="Name" value={this.state.Name} type="text"
                                                                size="30" onChange={(e) => this.setState({ Name: e.target.value })} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Fire Dept:</label>
                                                            <InputText placeholder="Toronto Pumper #" value={this.state.FireDept} type="text"
                                                                size="30" onChange={(e) => this.setState({ FireDept: e.target.value })} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Police Service Badge #'S:</label>
                                                            <InputText placeholder="Service Name, Badge #'s" value={this.state.PoliceServiceBadge} type="text"
                                                                size="30" onChange={(e) => this.setState({ PoliceServiceBadge: e.target.value })} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Other</label>
                                                            <InputText placeholder="Other" value={this.state.Other} type="text"
                                                                size="30" onChange={(e) => this.setState({ Other: e.target.value })} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Report To Client:</label>
                                                            <div>
                                                                {
                                                                    this.state.ReportToClient.map(x =>
                                                                        <div key={x}>
                                                                            <RadioButton value={x} name="ReportToClient"
                                                                                onChange={(e) => this.changeReportToClient(e)}
                                                                                checked={this.state.ReportToClientSelected.includes(x)} />
                                                                            <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">{x}</span>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </span>
                                                    </div>
                                                    <div className="p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        {this.state.isLoading === true ? <ProgressBar mode="indeterminate" style={{ height: '2px' }} /> : null}
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
                                onHide={() => this.setState({ displayDownloadDialog: false })}
                            >
                                {
                                    <div className="p-grid p-fluid" id="divToPrint">
                                        <div className="p-grid p-fluid" >
                                            <div className="card card-w-title">
                                                <div className="p-grid p-col-12">
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Client Name <span style={{ color: 'red' }}>*</span></label>
                                                        {this.state.SelectedClientName ? this.state.SelectedClientName.userName : ""}

                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Site Address <span style={{ color: 'red' }}>*</span></label>
                                                        {this.state.SiteAddress}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Date Received <span style={{ color: 'red' }}>*</span></label>
                                                        {this.state.DateReceived && this.state.DateReceived.toString() ? this.state.DateReceived.toString() : ""}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Arrival <span style={{ color: 'red' }}>*</span></label>
                                                        {this.state.Arrival}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Departure <span style={{ color: 'red' }}>*</span></label>
                                                        {this.state.Departure}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Key# Box#</label>
                                                        {this.state.KeyBox}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Keys: <span style={{ color: 'red' }}>*</span></label>
                                                        {this.state.Keys}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Alarm Type: <span style={{ color: 'red' }}>*</span></label>
                                                        {this.state.AlarmTypeSelected}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Dispatch Request Type:</label>
                                                        {this.state.DispatchRequestTypeSelected}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Other <span style={{ color: 'red' }}>*</span></label>
                                                        {this.state.OtherAlarmType}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Requested By <span style={{ color: 'red' }}>*</span></label>
                                                        {this.state.RequestedBy}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Alarm Zone and Description <span style={{ color: 'red' }}>*</span></label>
                                                        {this.state.AlarmZone}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Service Dispatched: <span style={{ color: 'red' }}>*</span></label>
                                                        {this.state.ServiceDispatched}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Service Call # <span style={{ color: 'red' }}>*</span></label>
                                                        {this.state.ServiceCallNo}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Action Taken <span style={{ color: 'red' }}>*</span></label>
                                                        {this.state.ActionTaken}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Comments / Recommendations: <span style={{ color: 'red' }}>*</span></label>
                                                        {this.state.Comments}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Subscriber: <span style={{ color: 'red' }}>*</span></label>
                                                        {this.state.Subscriber}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Name # </label>
                                                        {this.state.Name}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Fire Dept:</label>
                                                        {this.state.FireDept}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Police Service Badge #'S:</label>
                                                        {this.state.PoliceServiceBadge}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Other<span style={{ color: 'red' }}>*</span></label>
                                                        {this.state.Other}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Report To Client:</label>
                                                        {this.state.ReportToClientSelected}
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
const condition = authUser => authUser && authUser.roles && (authUser.roles === ROLES.ADMIN)
export default withAuthorization(condition)(ListAlarmResponse);