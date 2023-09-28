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

import "react-datepicker/dist/react-datepicker.css";
import GeneralOccurenceService from '../../../../api/generalOcc/generalOccService';

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
    OccurenceTypes: [],
    ClientNames: [],
    SelectedOccurence: '',
    SelectedClientName: '',

    SiteAddress: '',
    PoliceDivision: '',
    OccurencePlace: '',
    OccurenceDate: '',
    ReceivedBy: '',
    ReceivedDate: '',
    InvestigationBy: '',
    InvestigationDate: '',
    DateMadeOut: '',
    Synopsis: '',
    OpenClosed: '',
    Attachments: '',
    files:[],
    DiaryDate: '',

    isSiteAddressValid: true,
    isPoliceDivisionValid: true,
    isOccurencePlaceValid: true,
    isOccurenceDateValid: true,
    isReceivedByValid: true,
    isReceivedDateValid: true,
    isInvestigationByValid: true,
    isInvestigationDateValid: true,
    isDateMadeOutValid: true,
    isDiaryDateValid: true,
    isSynopsisValid: true,
    isSelectedOccurenceValid: true,
    isSelectedClientNameValid: true,
    isOpenClosedValid: true,

    displayDialog: false,
    displayDeleteDialog: false,
    disableFields: false,
    disableDeleteButton: true,
    disableApproveButton: true
}

class ListGeneralOccurence extends Component {

    constructor(props) {
        super(props);
        // this.onPaperSelect = this.onPaperSelect.bind(this);
        // this.addNew = this.addNew.bind(this);
        this.state = INITIAL_STATE;
        this.service = new GeneralOccurenceService();
    }

    getLists(){
        var role = this.props.authUser.roles;
        if (role === ROLES.ADMIN) {
            this.getGeneralOccList();
            this.getClientNames();
        }
        else {
            this.getGeneralOccList(this.props.authUser.id);
            this.setState({ disableFields: true })
        }
        this.getOccurenceTypes();
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
    getOccurenceTypes() {
        this.service.GetAllOccurenceTypes().then(data => {
            this.setState({
                OccurenceTypes: data
            })
        });
    }

    getGeneralOccList(id) {
        this.service.GetAll(id).then(data => {
            if (data && data != "" && data.length > 0) {
                data.forEach(element => {
                    element.occurenceDate = new Date(element.occurenceDate).toDateString()
                });
                this.setState({ GeneralOccList: data })
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
        if (!this.state.SelectedOccurence || !this.state.SelectedOccurence.sysSerial ||
            (this.state.SelectedOccurence && this.state.SelectedOccurence.sysSerial &&
                this.state.SelectedOccurence.sysSerial.toString().trim() === '')) {
            this.setState({ isSelectedOccurenceValid: false });
            error += "Occurence Type cannot be empty \n";
        } else { this.setState({ isSelectedOccurenceValid: true }); }
        if (!this.state.SelectedClientName.userId || (this.state.SelectedClientName && this.state.SelectedClientName.userId &&
            this.state.SelectedClientName.userId.trim() === '')) {
            this.setState({ isSelectedClientNameValid: false });
            error += "Client Name cannot be empty \n";
        } else { this.setState({ isSelectedClientNameValid: true }); }
        if (this.state.SiteAddress.trim() === '') {
            this.setState({ isSiteAddressValid: false });
            error += "Site Address cannot be empty \n";
        } else { this.setState({ isSiteAddressValid: true }); }
        if (this.state.PoliceDivision.trim() === '') {
            this.setState({ isPoliceDivisionValid: false });
            error += "Police Division cannot be empty \n";
        } else { this.setState({ isPoliceDivisionValid: true }); }
        if (this.state.OccurencePlace.trim() === '') {
            this.setState({ isOccurencePlaceValid: false });
            error += "Occurence Place cannot be empty \n";
        } else { this.setState({ isOccurencePlaceValid: true }); }
        if (!this.state.OccurenceDate || (this.state.OccurenceDate && this.state.OccurenceDate.toString().trim() === '')) {
            this.setState({ isOccurenceDateValid: false });
            error += "Date cannot be empty \n";
        } else { this.setState({ isOccurenceDateValid: true }); }
        if (this.state.ReceivedBy.trim() === '') {
            this.setState({ isReceivedByValid: false });
            error += "Received By cannot be empty \n";
        } else { this.setState({ isReceivedByValid: true }); }
        if (!this.state.ReceivedDate || (this.state.ReceivedDate && this.state.ReceivedDate.toString().trim() === '')) {
            this.setState({ isReceivedDateValid: false });
            error += "Received Date cannot be empty \n";
        } else { this.setState({ isReceivedDateValid: true }); }
        if (this.state.InvestigationBy.trim() === '') {
            this.setState({ isInvestigationByValid: false });
            error += "Investigation By cannot be empty \n";
        } else { this.setState({ isInvestigationByValid: true }); }
        if (!this.state.InvestigationDate || (this.state.InvestigationDate && this.state.InvestigationDate.toString().trim() === '')) {
            this.setState({ isInvestigationDateValid: false });
            error += "Investigation Date cannot be empty \n";
        } else { this.setState({ isInvestigationDateValid: true }); }
        if (!this.state.DateMadeOut || (this.state.DateMadeOut && this.state.DateMadeOut.toString().trim() === '')) {
            this.setState({ isDateMadeOutValid: false });
            error += "Investigation Date cannot be empty \n";
        } else { this.setState({ isDateMadeOutValid: true }); }
        if (this.state.Synopsis.trim() === '') {
            this.setState({ isSynopsisValid: false });
            error += "Synopsis cannot be empty \n";
        } else { this.setState({ isSynopsisValid: true }); }
        if (!this.state.DiaryDate || (this.state.DiaryDate && this.state.DiaryDate.toString().trim() === '')) {
            this.setState({ isDiaryDateValid: false });
            error += "Diary Date cannot be empty \n";
        } else { this.setState({ isDiaryDateValid: true }); }
        if (this.state.OpenClosed.trim() === '') {
            this.setState({ isOpenClosedValid: false });
            error += "Select Atleast One from Open Closed \n";
        } else { this.setState({ isOpenClosedValid: true }); }

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
            isUploading: '',
            OccurenceTypes: [],
            ClientNames: [],
            SelectedOccurence: '',
            SelectedClientName: '',

            SiteAddress: '',
            PoliceDivision: '',
            OccurencePlace: '',
            OccurenceDate: '',
            ReceivedBy: '',
            ReceivedDate: '',
            InvestigationBy: '',
            InvestigationDate: '',
            DateMadeOut: '',
            Synopsis: '',
            OpenClosed: '',
            Attachments: '',
            files: [],
            DiaryDate: '',

            isSiteAddressValid: true,
            isPoliceDivisionValid: true,
            isOccurencePlaceValid: true,
            isOccurenceDateValid: true,
            isReceivedByValid: true,
            isReceivedDateValid: true,
            isInvestigationByValid: true,
            isInvestigationDateValid: true,
            isDateMadeOutValid: true,
            isDiaryDateValid: true,
            isSynopsisValid: true,
            isSelectedOccurenceValid: true,
            isSelectedClientNameValid: true,
            isOpenClosedValid: true,

            displayDialog: false,
            displayDeleteDialog: false,
            disableDeleteButton: true,
            disableApproveButton: true,

            GeneralOccList:[]
        }, () => {
                this.getLists();
        })
    }

    Delete = () => {
        var Obj = {
            SysSerial: this.state.GeneralOccurenceId,
            OccurenceType: this.state.SelectedOccurence.sysSerial,
            ClientId: this.state.SelectedClientName.userId,
            SiteAddress: this.state.SiteAddress,
            PoliceDivision: this.state.PoliceDivision,
            OccurencePlace: this.state.OccurencePlace,
            OccurenceDate: this.state.OccurenceDate,
            ComplaintBy: this.state.ReceivedBy,
            DateReceived: this.state.ReceivedDate,
            InitialInvestigationBy: this.state.InvestigationBy,
            DateInvestigated: this.state.InvestigationDate,
            DateMadeOut: this.state.DateMadeOut,
            Synopsis: this.state.Synopsis,
            OpenClosed: this.state.OpenClosed,
            AttachmentCheck: this.state.Attachments,
            DiaryDate: this.state.DiaryDate,
            IsApproved: this.state.isApproved
        }

        try {
            this.service.Delete(Obj).then(() => {
                this.resetForm();
                this.growl.show({ severity: 'success', summary: 'Success', detail: 'Delete Successfully' });
                this.setState({ isLoading: false });
            })
        } catch (e) {
            this.growl.show({ severity: 'error', summary: 'Error', detail: 'Cannot Delete' });
            this.setState({ isLoading: false });
            console.log(e);
        }
    }

    onGenOccSelect = (e) => {
        var octypes = this.state.OccurenceTypes;
        let ind = octypes.findIndex(x => x.sysSerial === e.data.occurenceType);
        this.setState({
            SelectedClientName: { userName: e.data.clientName, userId: e.data.clientId.toString() },
            SelectedOccurence: { sysSerial: e.data.occurenceType, name: octypes[ind].name },
            SiteAddress: e.data.siteAddress,
            PoliceDivision: e.data.policeDivision,
            OccurencePlace: e.data.occurencePlace,
            OccurenceDate: new Date(e.data.occurenceDate),
            ReceivedBy: e.data.complaintBy,
            ReceivedDate: new Date(e.data.dateReceived),
            InvestigationBy: e.data.initialInvestigationBy,
            InvestigationDate: new Date(e.data.dateInvestigated),
            DateMadeOut: new Date(e.data.dateMadeOut),
            Synopsis: e.data.synopsis,
            OpenClosed: e.data.openClosed,
            Attachments: e.data.attachmentCheck,
            AttachmentFiles: e.data.attachments,
            DiaryDate: new Date(e.data.diaryDate),
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
                SysSerial: this.state.GeneralOccurenceId,
                OccurenceType: this.state.SelectedOccurence.sysSerial,
                ClientId: this.state.SelectedClientName.userId,
                SiteAddress: this.state.SiteAddress,
                PoliceDivision: this.state.PoliceDivision,
                OccurencePlace: this.state.OccurencePlace,
                OccurenceDate: this.state.OccurenceDate.toLocaleString(),
                ComplaintBy: this.state.ReceivedBy,
                DateReceived: this.state.ReceivedDate.toLocaleString(),
                InitialInvestigationBy: this.state.InvestigationBy,
                DateInvestigated: this.state.InvestigationDate.toLocaleString(),
                DateMadeOut: this.state.DateMadeOut.toLocaleString(),
                Synopsis: this.state.Synopsis,
                OpenClosed: this.state.OpenClosed,
                AttachmentCheck: this.state.Attachments,
                DiaryDate: this.state.DiaryDate ? this.state.DiaryDate.toLocaleString() : "",
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
    onGeneralOccRowSelect(e) {
        var octypes = this.state.OccurenceTypes;
        let ind = octypes.findIndex(x => x.sysSerial === e.data.occurenceType);
        this.setState({
            GeneralOccurenceId: e.data.sysSerial,
            SelectedClientName: { userName: e.data.clientName, userId: e.data.clientId.toString() },
            SelectedOccurence: { sysSerial: e.data.occurenceType, name: octypes[ind].name },
            SiteAddress: e.data.siteAddress,
            PoliceDivision: e.data.policeDivision,
            OccurencePlace: e.data.occurencePlace,
            OccurenceDate: new Date(e.data.occurenceDate),
            ReceivedBy: e.data.complaintBy,
            ReceivedDate: new Date(e.data.dateReceived),
            InvestigationBy: e.data.initialInvestigationBy,
            InvestigationDate: new Date(e.data.dateInvestigated),
            DateMadeOut: new Date(e.data.dateMadeOut),
            Synopsis: e.data.synopsis,
            OpenClosed: e.data.openClosed,
            Attachments: e.data.attachmentCheck,
            DiaryDate: new Date(e.data.diaryDate),
            GeneralOccurenceId: e.data.sysSerial,
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

    ApproveGeneralOcc() {
        this.SaveEdit(true);
    }

    rowClass(data) {
        return {
            "approvedRow": data.isApproved && data.isApproved === "Yes",
            "needApprovalRow": !data.isApproved || data.isApproved === "No",
        }
    }
    showDeleteModal() {
        if (this.state.SelectedGeneralOcc && this.state.SelectedGeneralOcc !== null && this.state.SelectedGeneralOcc !== "") {
            this.setState({
                displayDeleteDialog: true
            })
        }
    }
    onOccurenceTypeSelected(name) {
        this.setState({ SelectedOccurence: name.value })
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
                    pdf.save("general_occurence.pdf");
                });
            this.setState({
                displayDownloadDialog: false
            })
        }, 2000);
    }

    downloadFile(name){
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
                        disabled={disableApproveButton} onClick={(e) => this.ApproveGeneralOcc()} />
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
                <Button label="Save" className="p-button-primary ui-btns " disabled={this.state.isLoading} onClick={(e) => this.SaveEdit(e)} />
                <Button label="Delete" className="p-button-secondary" style={{ backgroundColor: 'red', color: 'white' }} disabled={this.state.isLoading} onClick={this.Delete} />
                <Button label="Download" className="p-button ui-btns-download"  disabled={this.state.isLoading} onClick={() => this.printDocument()} />
            </div>
        }

        var DownloadPhotos;
        if (this.state.AttachmentFiles && this.state.AttachmentFiles != "" && this.state.AttachmentFiles.split(',').length > 0)
            DownloadPhotos = this.state.AttachmentFiles.split(',').map((x,ind) =>
                <div key={ind} >
                    <span onClick={()=>{this.downloadFile(x)}} style={{color:'blue', cursor:'pointer'}}>{x}</span>
                </div>
            )

        return (
            <div>

                <Growl ref={(el) => this.growl = el}></Growl>
                <div className="p-grid p-fluid" >
                    <div className="card card-w-title">
                        <h1>General Occurence Logs</h1>
                        <div className="p-grid" style={{ marginTop: '8px' }} ></div>
                        <div className="content-section implementation">
                            <DataTable header={header} value={this.state.GeneralOccList} paginator={this.state.isLoading === false} rows={15} onRowDoubleClick={this.onGenOccSelect} responsive={true}
                                selectionMode="single" selection={this.state.SelectedGeneralOcc} onSelectionChange={e => this.setState({ SelectedGeneralOcc: e.value })}
                                resizableColumns={true} columnResizeMode="fit" rowClassName={this.rowClass}
                                onRowClick={e => this.onGeneralOccRowSelect(e)} sortField="isApproved" sortOrder={1}>
                                <Column field="clientName" header="Client Name" filter={true} filterPlaceholder="search by name" />
                                <Column field="occurenceDate" header="Date Created" sortable={true} />
                                <Column field="siteAddress" header="Site Address" filter={true} filterPlaceholder="search by address" />
                                <Column field="synopsis" header="Synopsis" filter={true} filterPlaceholder="search by keyword" />
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
                                header="General Occurence Details" modal={true} footer={dialogFooter}
                                onHide={() => this.setState({ displayDialog: false })}
                                contentStyle={{ maxHeight: "450px", overflow: "auto" }}>
                                {
                                    <div className="p-grid p-fluid">
                                        <div className="p-grid p-fluid" >
                                            <div className="card card-w-title">
                                                <h1>Edit General Occurence Report</h1>
                                                <div className="p-grid p-col-12">
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Type of Occurence <span style={{ color: 'red' }}>*</span></label>
                                                            <Dropdown disabled={disableFields} optionLabel="name" placeholder="Select" value={this.state.SelectedOccurence} readOnly={this.state.isLoading} options={this.state.OccurenceTypes} onChange={(e) => this.onOccurenceTypeSelected(e)}
                                                                style={this.state.isSelectedOccurenceValid === true ? normalBox : errorBox} />
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
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Police Division <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText disabled={disableFields} value={this.state.PoliceDivision} type="text" size="30" onChange={(e) => this.setState({ PoliceDivision: e.target.value })}
                                                                style={this.state.isPoliceDivisionValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Place Of Occurence <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText disabled={disableFields} placeholder="# Street, Unit, City, Province (Exact Location)" value={this.state.OccurencePlace} type="text" size="30" onChange={(e) => this.setState({ OccurencePlace: e.target.value })}
                                                                style={this.state.isOccurencePlaceValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Date of Occurence <span style={{ color: 'red' }}>*</span></label>
                                                            <DatePicker
                                                                selected={this.state.OccurenceDate}
                                                                onChange={date => this.setState({ OccurenceDate: date })}
                                                                timeInputLabel="Time:"
                                                                dateFormat="MM/dd/yyyy h:mm aa"
                                                                showTimeInput
                                                                className={this.state.isOccurenceDateValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"}
                                                                disabled={disableFields} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Complaint Received By <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Guard Name - Lic#" value={this.state.ReceivedBy} type="text" size="30" onChange={(e) => this.setState({ ReceivedBy: e.target.value })}
                                                               disabled={disableFields}  style={this.state.isReceivedByValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Date Received <span style={{ color: 'red' }}>*</span></label>
                                                            <DatePicker
                                                                selected={this.state.ReceivedDate}
                                                                onChange={date => this.setState({ ReceivedDate: date })}
                                                                timeInputLabel="Time:"
                                                                dateFormat="MM/dd/yyyy h:mm aa"
                                                                showTimeInput
                                                                className={this.state.isReceivedDateValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"}
                                                                disabled={disableFields} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Initial Investigation By <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Guard Name - Lic#" value={this.state.InvestigationBy} type="text" size="30" onChange={(e) => this.setState({ InvestigationBy: e.target.value })}
                                                              disabled={disableFields}   style={this.state.isInvestigationByValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Date Investigated <span style={{ color: 'red' }}>*</span></label>
                                                            <DatePicker
                                                                selected={this.state.InvestigationDate}
                                                                onChange={date => this.setState({ InvestigationDate: date })}
                                                                timeInputLabel="Time:"
                                                                dateFormat="MM/dd/yyyy h:mm aa"
                                                                showTimeInput
                                                                disabled={disableFields} className={this.state.isInvestigationDateValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"}
                                                            />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Date Made Out <span style={{ color: 'red' }}>*</span></label>
                                                            <DatePicker
                                                                selected={this.state.DateMadeOut}
                                                                onChange={date => this.setState({ DateMadeOut: date })}
                                                                timeInputLabel="Time:"
                                                                dateFormat="MM/dd/yyyy h:mm aa"
                                                                showTimeInput
                                                                disabled={disableFields} className={this.state.isDateMadeOutValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"}
                                                            />
                                                        </span>
                                                    </div>

                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                    </div>

                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Synopsis <span style={{ color: 'red' }}>*</span></label>
                                                            <InputTextarea rows={10} cols={30} value={this.state.Synopsis} onChange={(e) => this.setState({ Synopsis: e.target.value })} autoResize={true}
                                                               disabled={disableFields}  style={this.state.isSynopsisValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Open / Closed: <span style={{ color: 'red' }}>*</span></label>
                                                            <div style={this.state.isOpenClosedValid === true ? {} : errorBoxForCheckBox} >
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">Open</span> <RadioButton value="Open" name="OpenClosed"
                                                                    onChange={(e) => this.setState({ OpenClosed: e.value })}
                                                                    checked={this.state.OpenClosed === 'Open'} disabled={disableFields} />
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">Closed</span> <RadioButton value="Closed" name="OpenClosed"
                                                                    onChange={(e) => this.setState({ OpenClosed: e.value })}
                                                                    checked={this.state.OpenClosed === 'Closed'} disabled={disableFields} />
                                                            </div>
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Attachments</label>
                                                            <div >
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">Yes</span> <RadioButton value="Yes" name="Attachments"
                                                                    onChange={(e) => this.setState({ Attachments: e.value })}
                                                                    checked={this.state.Attachments === 'Yes'} disabled={disableFields} />
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">No</span> <RadioButton value="No" name="Attachments"
                                                                    onChange={(e) => this.setState({ Attachments: e.value })}
                                                                    checked={this.state.Attachments === 'No'} disabled={disableFields} />
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">Photographs</span> <RadioButton value="Photographs" name="Attachments"
                                                                    onChange={(e) => this.setState({ Attachments: e.value })}
                                                                    checked={this.state.Attachments === 'Photographs'} disabled={disableFields} />
                                                            </div>
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Diary Date </label>
                                                            <DatePicker placeholderText="Select Date" selected={this.state.DiaryDate} className="p-inputtext normalbox"
                                                                disabled={disableFields} onChange={date => this.setState({ DiaryDate: date })} />
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
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
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
                                                <h1>General Occurence Report Detail</h1>
                                                <div className="p-grid p-col-12">
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Type of Occurence: </label>
                                                        {this.state.SelectedOccurence ? this.state.SelectedOccurence.name : ""}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Client Name: </label>
                                                        {this.state.SelectedClientName ? this.state.SelectedClientName.userName : ""}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Site Address: </label>
                                                        {this.state.SiteAddress}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Police Division: </label>
                                                        {this.state.PoliceDivision}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Place Of Occurence: </label>
                                                        {this.state.OccurencePlace}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Date of Occurence: </label>
                                                        {this.state.OccurenceDate && this.state.OccurenceDate.toString() ? this.state.OccurenceDate.toString() : ""}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Complaint Received By: </label>
                                                        {this.state.ReceivedBy}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Date Received: </label>
                                                        {this.state.ReceivedDate && this.state.ReceivedDate.toString() ? this.state.ReceivedDate.toString() : ""}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Initial Investigation By: </label>
                                                        {this.state.InvestigationBy}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Date Investigated: </label>
                                                        {this.state.InvestigationDate && this.state.InvestigationDate.toString() ? this.state.InvestigationDate.toString() : ""}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" style={{ height: 50 }}>Date Made Out: </label>
                                                        {this.state.DateMadeOut && this.state.DateMadeOut.toString() ? this.state.DateMadeOut.toString() : ""}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Open / Closed: </label>
                                                        {this.state.OpenClosed}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Diary Date </label>
                                                        {this.state.DiaryDate && this.state.DiaryDate.toString() ? this.state.DiaryDate.toString() : ""}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 120, display:'flex' }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Synopsis: </label>
                                                        <div className="p-col-7 p-sm-7 p-md-7 p-lg-7" >
                                                            {this.state.Synopsis}
                                                        </div>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ height: 40 }}>
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3">Attachments</label>
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
const condition = authUser => authUser && authUser.roles && (authUser.roles === ROLES.ADMIN || authUser.roles === ROLES.CLIENT)
export default withAuthorization(condition)(ListGeneralOccurence);