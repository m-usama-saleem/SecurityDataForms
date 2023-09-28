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
import ParkingEnforcementService from '../../../../api/parkingEnforcement/parkingEnforcementService';

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
    isUploading: '',
    ClientNames: [],
    SelectedClientName: '',

    SysSerial: '',
    ParkingEnforcementDate: '',
    Arrival: '',
    Departure: '',
    SiteAddress: '',
    PoliceDivision: '',
    TowTrucksCalled: '',
    TowCompany: '',
    TruckLic: '',
    VehiclesTowedTo: '',
    PlaceOfOccurence: '',
    Details: '',
    NoOfTags: '',
    NoOfTows: '',
    Attachments: '',
    files: [],

    isParkingEnforcementDateValid: true,
    isArrivalValid: true,
    isDepartureValid: true,
    isSiteAddressValid: true,
    isPoliceDivisionValid: true,
    isTowTrucksCalledValid: true,
    isPlaceOfOccurenceValid: true,
    isDetailsValid: true,
    isNoOfTagsValid: true,
    isNoOfTowsValid: true,

    isSelectedClientNameValid: true,
    displayDeleteDialog: false,
    disableFields: false,
    disableDeleteButton: true,
    disableApproveButton: true
}

class ListParkingEnforcement extends Component {

    constructor(props) {
        super(props);
        // this.onPaperSelect = this.onPaperSelect.bind(this);
        // this.addNew = this.addNew.bind(this);
        this.state = INITIAL_STATE;
        this.service = new ParkingEnforcementService();
    }

    getLists() {
        var role = this.props.authUser.roles;
        if (role === ROLES.ADMIN) {
            this.getParkingEnforcementList();
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

    getParkingEnforcementList(id) {
        this.service.GetAll(id).then(data => {
            if (data && data != "" && data.length > 0) {
                data.forEach(element => {
                    element.dateReceived = new Date(element.dateReceived).toDateString()
                });
                this.setState({ ParkingEnforcementList: data })
            }
        });
    }

    onFileSelected = (event) => {
        const { target: { files } } = event;
        const filesToStore = [];

        [...files].map(file => {
            filesToStore.push(file)
        });

        this.setState({ files: filesToStore });
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
        } else { this.setState({ isSiteAddressValid: true }); }
        if (!this.state.ParkingEnforcementDate || (this.state.ParkingEnforcementDate && this.state.ParkingEnforcementDate.toString().trim() === '')) {
            this.setState({ isParkingEnforcementDateValid: false });
            error += "Date Received cannot be empty \n";
        } else { this.setState({ isParkingEnforcementDateValid: true }); }
        if (this.state.Arrival.toString().trim() === '') {
            this.setState({ isArrivalValid: false });
            error += "Arrival cannot be empty \n";
        } else { this.setState({ isArrivalValid: true }); }
        if (this.state.Departure.toString().trim() === '') {
            this.setState({ isDepartureValid: false });
            error += "Departure cannot be empty \n";
        } else { this.setState({ isDepartureValid: true }); }
        if (this.state.PoliceDivision.trim() === '') {
            this.setState({ isPoliceDivisionValid: false });
            error += "Police Division cannot be empty \n";
        } else { this.setState({ isPoliceDivisionValid: true }); }
        if (this.state.TowTrucksCalled.trim() === '') {
            this.setState({ isTowTrucksCalledValid: false });
            error += "Tow Trucks Called cannot be empty \n";
        } else { this.setState({ isTowTrucksCalledValid: true }); }
        if (this.state.PlaceOfOccurence.trim() === '') {
            this.setState({ isPlaceOfOccurenceValid: false });
            error += "Place Of Occurence cannot be empty \n";
        } else { this.setState({ isPlaceOfOccurenceValid: true }); }
        if (this.state.Details.trim() === '') {
            this.setState({ isDetailsValid: false });
            error += "Details cannot be empty \n";
        } else { this.setState({ isDetailsValid: true }); }
        if (this.state.NoOfTags.trim() === '') {
            this.setState({ isNoOfTagsValid: false });
            error += "No Of Tags cannot be empty \n";
        } else { this.setState({ isNoOfTagsValid: true }); }
        if (this.state.NoOfTows.trim() === '') {
            this.setState({ isNoOfTowsValid: false });
            error += "No Of Tows cannot be empty \n";
        } else { this.setState({ isNoOfTowsValid: true }); }

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
            ParkingEnforcementDate: '',
            Arrival: '',
            Departure: '',
            SiteAddress: '',
            PoliceDivision: '',
            TowTrucksCalled: '',
            TowCompany: '',
            TruckLic: '',
            VehiclesTowedTo: '',
            PlaceOfOccurence: '',
            Details: '',
            NoOfTags: '',
            NoOfTows: '',
            Attachments: '',
            files: [],

            isParkingEnforcementDateValid: true,
            isArrivalValid: true,
            isDepartureValid: true,
            isSiteAddressValid: true,
            isPoliceDivisionValid: true,
            isTowTrucksCalledValid: true,
            isPlaceOfOccurenceValid: true,
            isDetailsValid: true,
            isNoOfTagsValid: true,
            isNoOfTowsValid: true,

            isSelectedClientNameValid: true,
            disableFields: false,
            disableDeleteButton: true,
            disableApproveButton: true,
            ParkingEnforcementList: []
        }, () => {
            this.getLists();
        })
    }

    Delete = () => {
        var Obj = {
            SysSerial: this.state.ParkingEnforcementId,
            ClientId: this.state.SelectedClientName.userId,
            DateReceived: this.state.ParkingEnforcementDate,
            Arrival: this.state.Arrival,
            Departure: this.state.Departure,
            SiteAddress: this.state.SiteAddress,
            PoliceDivision: this.state.PoliceDivision,
            TowTrucksCalled: this.state.TowTrucksCalled,
            TowCompany: this.state.TowCompany,
            TruckLic: this.state.TruckLic,
            TowedTo: this.state.VehiclesTowedTo,
            OccurencePlace: this.state.PlaceOfOccurence,
            Details: this.state.Details,
            NoOfTags: this.state.NoOfTags,
            NoOfTows: this.state.NoOfTows,
            AttachmentCheck: this.state.Attachments,
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

    onParkingEnforcementSelect = (e) => {
        this.setState({
            ParkingEnforcementId: e.data.sysSerial,
            SelectedClientName: { userName: e.data.clientName, userId: e.data.clientId.toString() },
            ParkingEnforcementDate: new Date(e.data.dateReceived),
            Arrival: e.data.arrival,
            Departure: e.data.departure,
            SiteAddress: e.data.siteAddress,
            PoliceDivision: e.data.policeDivision,
            TowTrucksCalled: e.data.towTrucksCalled,
            TowCompany: e.data.towCompany,
            TruckLic: e.data.truckLic,
            VehiclesTowedTo: e.data.towedTo,
            PlaceOfOccurence: e.data.occurencePlace,
            Details: e.data.details,
            NoOfTags: e.data.noOfTags,
            NoOfTows: e.data.noOfTows,
            Attachments: e.data.attachmentCheck,
            AttachmentFiles: e.data.attachments,

            displayDialog: true,
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

    onClientSelected(name) {
        this.setState({ SelectedClientName: name.value })
    }

    SaveEdit = (approve) => {
        var validForm = this.validateForm();
        if (validForm) {

            var Obj = {
                SysSerial: this.state.ParkingEnforcementId,
                ClientId: this.state.SelectedClientName.userId,
                DateReceived: this.state.ParkingEnforcementDate.toLocaleString(),
                Arrival: this.state.Arrival,
                Departure: this.state.Arrival,
                SiteAddress: this.state.SiteAddress,
                PoliceDivision: this.state.PoliceDivision,
                TowTrucksCalled: this.state.TowTrucksCalled,
                TowCompany: this.state.TowCompany,
                TruckLic: this.state.TruckLic,
                TowedTo: this.state.VehiclesTowedTo,
                OccurencePlace: this.state.PlaceOfOccurence,
                Details: this.state.Details,
                NoOfTags: this.state.NoOfTags,
                NoOfTows: this.state.NoOfTows,
                AttachmentCheck: this.state.Attachments,
                isApproved: this.state.IsApproved,
            }

            if (approve && approve === true || this.state.IsApproved === "Yes") {
                Obj.isApproved = "Yes"
            }
            if (approve && approve === false) {
                Obj.isApproved = "No"
            }

            var filesArray = this.state.files;
            if (filesArray && filesArray.length > 0) {
                let f = new FormData();
                f = new FormData();
                filesArray.forEach(element => {
                    f.append("File[]", element)
                });
                this.service.UploadFile(f).then((fileName) => {
                    Obj.Attachments = fileName;

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
                })
                    .catch((error) => {
                        this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error: while uploading file' });
                        this.setState({ isLoading: false });
                    })
            }
            else {
                this.service
                    .Edit(Obj)
                    .then(() => {
                        this.growl.show({ severity: 'success', summary: 'Success', detail: 'Successfully Updated' });
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
        }

        else {

        }
    }
    onParkingEnforcementRowSelect(e) {

        this.setState({
            ParkingEnforcementId: e.data.sysSerial,
            SelectedClientName: { userName: e.data.clientName, userId: e.data.clientId.toString() },
            ParkingEnforcementDate: new Date(e.data.dateReceived),
            Arrival: e.data.arrival,
            Departure: e.data.departure,
            SiteAddress: e.data.siteAddress,
            PoliceDivision: e.data.policeDivision,
            TowTrucksCalled: e.data.towTrucksCalled,
            TowCompany: e.data.towCompany,
            TruckLic: e.data.truckLic,
            VehiclesTowedTo: e.data.towedTo,
            PlaceOfOccurence: e.data.occurencePlace,
            Details: e.data.details,
            NoOfTags: e.data.noOfTags,
            NoOfTows: e.data.noOfTows,
            Attachments: e.data.attachmentCheck,
            disableDeleteButton: false,
            AttachmentFiles: e.data.attachments,
            IsApproved: e.data.isApproved
        })
        if (e.data.isApproved && e.data.isApproved === "Yes") {
            this.setState({ disableApproveButton: true });
        }
        else {
            this.setState({ disableApproveButton: false });
        }
    }

    ApproveParkingEnforcement() {
        this.SaveEdit(true);
    }

    rowClass(data) {
        return {
            "approvedRow": data.isApproved && data.isApproved === "Yes",
            "needApprovalRow": !data.isApproved || data.isApproved === "No",
        }
    }
    showDeleteModal() {
        if (this.state.SelectedParkingEnforcement && this.state.SelectedParkingEnforcement != null && this.state.SelectedParkingEnforcement != "") {
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
                    pdf.save("parking_enforcement.pdf");
                });
            this.setState({
                displayDownloadDialog: false
            })
        }, 2000);
    }
    downloadFile(name) {
        this.service.downloadFile(name);
    }

    render() {
        var { disableFields, disableDeleteButton, disableApproveButton } = this.state
        var header;
        let dialogFooter;
        if (this.props.authUser.roles.includes(ROLES.ADMIN)) {

            header = <div className="p-col-6 p-sm-6 p-md-6 p-lg-6" style={{ textAlign: 'left', display: 'flex' }}>
                <div className="p-col-3 p-sm-3 p-md-3 p-lg-3" >
                    <Button className="p-button-success" icon="pi pi-check" iconPos="left" label="Approve"
                        disabled={disableApproveButton} onClick={(e) => this.ApproveParkingEnforcement()} />
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
        var DownloadPhotos;
        if (this.state.AttachmentFiles && this.state.AttachmentFiles != "" && this.state.AttachmentFiles.split(',').length > 0)
            DownloadPhotos = this.state.AttachmentFiles.split(',').map((x, ind) =>
                <div key={ind} >
                    <span onClick={() => { this.downloadFile(x) }} style={{ color: 'blue', cursor: 'pointer' }}>{x}</span>
                </div>
            )
        return (
            <div>

                <Growl ref={(el) => this.growl = el}></Growl>
                <div className="p-grid p-fluid" >
                    <div className="card card-w-title">
                        <h1>Parking Enforcement Reports</h1>
                        <div className="p-grid" style={{ marginTop: '8px' }} ></div>
                        <div className="content-section implementation">
                            <DataTable header={header} value={this.state.ParkingEnforcementList} paginator={this.state.isLoading === false} rows={15} onRowDoubleClick={this.onParkingEnforcementSelect} responsive={true}
                                selectionMode="single" selection={this.state.SelectedParkingEnforcement} onSelectionChange={e => this.setState({ SelectedParkingEnforcement: e.value })}
                                resizableColumns={true} columnResizeMode="fit" rowClassName={this.rowClass}
                                onRowClick={e => this.onParkingEnforcementRowSelect(e)} sortField="isApproved" sortOrder={1}>
                                <Column field="clientName" header="Client Name" filter={true} filterPlaceholder="search by name" />
                                <Column field="dateReceived" header="Date Received" sortable={true} />
                                <Column field="siteAddress" header="Site Address" filter={true} filterPlaceholder="search by keyword" />
                                <Column field="occurencePlace" header="Occurence Place" filter={true} filterPlaceholder="search by place" />
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
                                header="Parking Enforcement Details" modal={true} footer={dialogFooter}
                                onHide={() => this.setState({ displayDialog: false })}
                                contentStyle={{ maxHeight: "450px", overflow: "auto" }}>
                                {
                                    <div className="p-grid p-fluid">
                                        <div className="p-grid p-fluid" >
                                            <div className="card card-w-title">
                                                <h1>Edit Parking Enforcement Report</h1>
                                                <div className="p-grid p-col-12">
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Date Received <span style={{ color: 'red' }}>*</span></label>
                                                            <DatePicker
                                                                selected={this.state.ParkingEnforcementDate}
                                                                onChange={date => this.setState({ ParkingEnforcementDate: date })}
                                                                timeInputLabel="Time:"
                                                                dateFormat="MM/dd/yyyy h:mm aa"
                                                                showTimeInput
                                                                className={this.state.isParkingEnforcementDateValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"}
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
                                                            <label htmlFor="float-input">Client Name <span style={{ color: 'red' }}>*</span></label>
                                                            <Dropdown disabled={disableFields} editable={true} optionLabel="userName" placeholder="Select"
                                                                value={this.state.SelectedClientName ? this.state.SelectedClientName.userName : ""}
                                                                readOnly={this.state.isLoading} options={this.state.ClientNames} onChange={(e) => this.onClientSelected(e)}
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
                                                            <label htmlFor="float-input">Police Division: <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Police Division" value={this.state.PoliceDivision} type="text" size="30"
                                                                onChange={(e) => this.setState({ PoliceDivision: e.target.value })}
                                                                style={this.state.isPoliceDivisionValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Tow Trucks Called: <span style={{ color: 'red' }}>*</span></label>
                                                            <div style={this.state.isTowTrucksCalledValid === true ? {} : errorBoxForCheckBox}>
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">Yes</span>
                                                                <RadioButton value="Yes" name="TowTrucksCalled"
                                                                    onChange={(e) => this.setState({ TowTrucksCalled: e.value })}
                                                                    checked={this.state.TowTrucksCalled === 'Yes'} />
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">No</span>
                                                                <RadioButton value="No" name="TowTrucksCalled"
                                                                    onChange={(e) => this.setState({ TowTrucksCalled: e.value })}
                                                                    checked={this.state.TowTrucksCalled === 'No'} />
                                                            </div>
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Tow Company:</label>
                                                            <InputText placeholder="Tow Company" value={this.state.TowCompany} type="text"
                                                                size="30" onChange={(e) => this.setState({ TowCompany: e.target.value })} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Truck Lic #:</label>
                                                            <InputText placeholder="Truck Lic #" value={this.state.TruckLic} type="text"
                                                                size="30" onChange={(e) => this.setState({ TruckLic: e.target.value })} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Vehicles Towed To:</label>
                                                            <InputText placeholder="# Street, Unit, City, Province" value={this.state.VehiclesTowedTo} type="text"
                                                                size="30" onChange={(e) => this.setState({ VehiclesTowedTo: e.target.value })} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Place Of Occurence: <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="# Street, Unit, City, Province (Exact Location)" value={this.state.PlaceOfOccurence} type="text"
                                                                size="30" onChange={(e) => this.setState({ PlaceOfOccurence: e.target.value })}
                                                                style={this.state.isPlaceOfOccurenceValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Details <span style={{ color: 'red' }}>*</span></label>
                                                            <InputTextarea rows={10} cols={30} value={this.state.Details}
                                                                onChange={(e) => this.setState({ Details: e.target.value })} autoResize={true}
                                                                style={this.state.isDetailsValid === true ? normalBox : errorBox}
                                                                style={this.state.isDetailsValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>

                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">NUMBER OF TAGS: <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Number Of Tags" value={this.state.NoOfTags} type="text"
                                                                size="30" onChange={(e) => this.setState({ NoOfTags: e.target.value })}
                                                                style={this.state.isNoOfTagsValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">NUMBER OF TOWS: <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Number Of Tows" value={this.state.NoOfTows} type="text"
                                                                size="30" onChange={(e) => this.setState({ NoOfTows: e.target.value })}
                                                                style={this.state.isNoOfTowsValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Attachments</label>
                                                            <div >
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">Yes</span> <RadioButton value="Yes" name="Attachments"
                                                                    onChange={(e) => this.setState({ Attachments: e.value })}
                                                                    checked={this.state.Attachments === 'Yes'} />
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">No</span> <RadioButton value="No" name="Attachments"
                                                                    onChange={(e) => this.setState({ Attachments: e.value })}
                                                                    checked={this.state.Attachments === 'No'} />
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">Photographs</span> <RadioButton value="Photographs" name="Attachments"
                                                                    onChange={(e) => this.setState({ Attachments: e.value })}
                                                                    checked={this.state.Attachments === 'Photographs'} />
                                                            </div>
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Upload Attachments</label>
                                                            <div>
                                                                <input type="file" onChange={this.onFileSelected} multiple />
                                                            </div>
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Download Attachments</label>
                                                            <div>
                                                                {
                                                                    DownloadPhotos
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
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Date Received: </label>
                                                        {this.state.ParkingEnforcementDate && this.state.ParkingEnforcementDate.toString() ? this.state.ParkingEnforcementDate.toString() : ""}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Arrival: </label>
                                                        {this.state.Arrival}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Departure: </label>
                                                        {this.state.Departure}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Client Name: </label>
                                                        {this.state.SelectedClientName ? this.state.SelectedClientName.userName : ""}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Site Address: </label>
                                                        {this.state.SiteAddress}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Police Division: </label>
                                                        {this.state.PoliceDivision}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Tow Trucks Called: </label>
                                                        {this.state.TowTrucksCalled}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Tow Company:</label>
                                                        {this.state.TowCompany}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Truck Lic #:</label>
                                                        {this.state.TruckLic}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Vehicles Towed To:</label>
                                                        {this.state.VehiclesTowedTo}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Place Of Occurence: </label>
                                                        {this.state.PlaceOfOccurence}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 150, display: 'flex' }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Details: </label>
                                                        <div className="p-col-6 p-sm-6 p-md-6 p-lg-6" >
                                                            {this.state.Details}
                                                        </div>
                                                    </div>

                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">NUMBER OF TAGS: </label>
                                                        {this.state.NoOfTags}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">NUMBER OF TOWS: </label>
                                                        {this.state.NoOfTows}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Attachments</label>
                                                        {this.state.Attachments}
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
export default withAuthorization(condition)(ListParkingEnforcement);