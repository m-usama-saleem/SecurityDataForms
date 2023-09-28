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
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { RadioButton } from 'primereact/radiobutton';
import 'primeicons/primeicons.css';
import DatePicker from "react-datepicker";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

import "react-datepicker/dist/react-datepicker.css";
import TressPassNoticeService from '../../../../api/tressPassNotice/tressPassNoticeService';

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

    FirstName: '',
    Initial: '',
    LastName: '',
    DOB: '',
    Gender: '',
    Address: '',
    City: '',
    Province: '',
    PostalCode: '',
    Country: '',
    Complexion: '',
    HairColor: '',
    HairLength: '',
    Height: '',
    Weight: '',
    Glasses: '',
    Clothing: '',
    Marks: '',
    Tattoos: '',
    IssuedAt: '',
    TressPassDate: '',
    PeriodOfTime: '',
    TressPassOffence: [
        'Enter premises when entry prohibited',
        'Engaged in prohibited activity',
        'Fail to leave when directed'
    ],
    TressPassOffenceSelected: [],
    ReasonForNotice: '',
    Attachments: '',
    files:[],

    isFirstNameValid: true,
    isInitialValid: true,
    isLastNameValid: true,
    isDOBValid: true,
    isGenderValid: true,
    isAddressValid: true,
    isCityValid: true,
    isProvinceValid: true,
    isPostalCodeValid: true,
    isCountryValid: true,
    isComplexionValid: true,
    isHairColorValid: true,
    isHairLengthValid: true,
    isHeightValid: true,
    isWeightValid: true,
    isGlassesValid: true,
    isClothingValid: true,
    isMarksValid: true,
    isTattoosValid: true,
    isIssuedAtValid: true,
    isTressPassDateValid: true,
    isPeriodOfTimeValid: true,
    isTressPassOffenceValid: true,
    isReasonForNoticeValid: true,
    isSelectedClientNameValid: true,

    displayDeleteDialog: false,
    disableFields: false,
    disableDeleteButton: true,
    disableApproveButton: true
}

class ListTressPassNotice extends Component {

    constructor(props) {
        super(props);
        // this.onPaperSelect = this.onPaperSelect.bind(this);
        // this.addNew = this.addNew.bind(this);
        this.state = INITIAL_STATE;
        this.service = new TressPassNoticeService();
    }

    getLists(){
        var role = this.props.authUser.roles;
        if (role === ROLES.ADMIN) {
            this.getTressPassNoticeList();
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

    onFileSelected = (event) => {
        const { target: { files } } = event;
        const filesToStore = [];

        [...files].map(file => {
            filesToStore.push(file)
        });

        this.setState({ files: filesToStore });
    }

    getTressPassNoticeList(id) {
        this.service.GetAll(id).then(data => {
            if (data && data != "" && data.length > 0) {
                data.forEach(element => {
                    element.date = new Date(element.date).toDateString()
                });
                this.setState({ TressPassNoticeList: data })
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
        if (this.state.FirstName.trim() === '') {
            this.setState({ isFirstNameValid: false });
            error += "First Name cannot be empty \n";
        } else { this.setState({ isFirstNameValid: true }); }
        if (this.state.Initial.trim() === '') {
            this.setState({ isInitialValid: false });
            error += "Initial cannot be empty \n";
        } else { this.setState({ isInitialValid: true }); }
        if (this.state.LastName.trim() === '') {
            this.setState({ isLastNameValid: false });
            error += "Last Name cannot be empty \n";
        } else { this.setState({ isLastNameValid: true }); }
        if (!this.state.DOB || (this.state.DOB && this.state.DOB.toString().trim() === '')) {
            this.setState({ isDOBValid: false });
            error += "Date Of Birth cannot be empty \n";
        } else { this.setState({ isDOBValid: true }); }
        if (this.state.Gender.trim() === '') {
            this.setState({ isGenderValid: false });
            error += "Gender cannot be empty \n";
        } else { this.setState({ isGenderValid: true }); }
        if (this.state.Address.trim() === '') {
            this.setState({ isAddressValid: false });
            error += "Address cannot be empty \n";
        } else { this.setState({ isAddressValid: true }); }
        if (this.state.City.trim() === '') {
            this.setState({ isCityValid: false });
            error += "City cannot be empty \n";
        } else { this.setState({ isCityValid: true }); }
        if (this.state.Province.trim() === '') {
            this.setState({ isProvinceValid: false });
            error += "Province cannot be empty \n";
        } else { this.setState({ isProvinceValid: true }); }
        if (this.state.PostalCode.trim() === '') {
            this.setState({ isPostalCodeValid: false });
            error += "Postal Code cannot be empty \n";
        } else { this.setState({ isPostalCodeValid: true }); }
        if (this.state.Country.trim() === '') {
            this.setState({ isCountryValid: false });
            error += "Country cannot be empty \n";
        } else { this.setState({ isCountryValid: true }); }
        if (this.state.Complexion.trim() === '') {
            this.setState({ isComplexionValid: false });
            error += "Complexion cannot be empty \n";
        } else { this.setState({ isComplexionValid: true }); }
        if (this.state.HairColor.trim() === '') {
            this.setState({ isHairColorValid: false });
            error += "Hair Colour cannot be empty \n";
        } else { this.setState({ isHairColorValid: true }); }
        if (this.state.HairLength.trim() === '') {
            this.setState({ isHairLengthValid: false });
            error += "Hair Length cannot be empty \n";
        } else { this.setState({ isHairLengthValid: true }); }
        if (this.state.Height.trim() === '') {
            this.setState({ isHeightValid: false });
            error += "Height cannot be empty \n";
        } else { this.setState({ isHeightValid: true }); }
        if (this.state.Weight.trim() === '') {
            this.setState({ isWeightValid: false });
            error += "Weight cannot be empty \n";
        } else { this.setState({ isWeightValid: true }); }
        if (this.state.Glasses.trim() === '') {
            this.setState({ isGlassesValid: false });
            error += "Glasses cannot be empty \n";
        } else { this.setState({ isGlassesValid: true }); }
        if (this.state.Clothing.trim() === '') {
            this.setState({ isClothingValid: false });
            error += "Clothing cannot be empty \n";
        } else { this.setState({ isClothingValid: true }); }
        if (this.state.Marks.trim() === '') {
            this.setState({ isMarksValid: false });
            error += "Marks cannot be empty \n";
        } else { this.setState({ isMarksValid: true }); }
        if (this.state.Tattoos.trim() === '') {
            this.setState({ isTattoosValid: false });
            error += "Tattoos cannot be empty \n";
        } else { this.setState({ isTattoosValid: true }); }
        if (this.state.IssuedAt.trim() === '') {
            this.setState({ isIssuedAtValid: false });
            error += "Issued at cannot be empty \n";
        } else { this.setState({ isIssuedAtValid: true }); }
        if (!this.state.TressPassDate || (this.state.TressPassDate && this.state.TressPassDate.toString().trim() === '')) {
            this.setState({ isTressPassDateValid: false });
            error += "Tresspass Date cannot be empty \n";
        } else { this.setState({ isTressPassDateValid: true }); }
        if (this.state.PeriodOfTime.trim() === '') {
            this.setState({ isPeriodOfTimeValid: false });
            error += "Period of time cannot be empty \n";
        } else { this.setState({ isPeriodOfTimeValid: true }); }
        if (this.state.TressPassOffenceSelected.length <= 0) {
            this.setState({ isTressPassOffenceValid: false });
            error += "Tresspass offence cannot be empty \n";
        } else { this.setState({ isTressPassOffenceValid: true }); }
        if (this.state.ReasonForNotice.trim() === '') {
            this.setState({ isReasonForNoticeValid: false });
            error += "Reason for notice cannot be empty \n";
        } else { this.setState({ isReasonForNoticeValid: true }); }

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
            ClientNames: [],
            SelectedClientName: '',

            FirstName: '',
            Initial: '',
            LastName: '',
            DOB: '',
            Gender: '',
            Address: '',
            City: '',
            Province: '',
            PostalCode: '',
            Country: '',
            Complexion: '',
            HairColor: '',
            HairLength: '',
            Height: '',
            Weight: '',
            Glasses: '',
            Clothing: '',
            Marks: '',
            Tattoos: '',
            IssuedAt: '',
            TressPassDate: '',
            PeriodOfTime: '',
            TressPassOffence: [
                'Enter premises when entry prohibited',
                'Engaged in prohibited activity',
                'Fail to leave when directed'
            ],
            TressPassOffenceSelected: [],
            ReasonForNotice: '',
            Attachments: '',
            files:[],

            isFirstNameValid: true,
            isInitialValid: true,
            isLastNameValid: true,
            isDOBValid: true,
            isGenderValid: true,
            isAddressValid: true,
            isCityValid: true,
            isProvinceValid: true,
            isPostalCodeValid: true,
            isCountryValid: true,
            isComplexionValid: true,
            isHairColorValid: true,
            isHairLengthValid: true,
            isHeightValid: true,
            isWeightValid: true,
            isGlassesValid: true,
            isClothingValid: true,
            isMarksValid: true,
            isTattoosValid: true,
            isIssuedAtValid: true,
            isTressPassDateValid: true,
            isPeriodOfTimeValid: true,
            isTressPassOffenceValid: true,
            isReasonForNoticeValid: true,
            isSelectedClientNameValid: true,

            displayDeleteDialog: false,
            disableFields: false,
            disableDeleteButton: true,
            disableApproveButton: true,

            TressPassNoticeList:[]

        }, () => {
            this.getLists();
        })
    }

    Delete = () => {
        var Obj = {
            SysSerial: this.state.TressPassNoticeId,
            FirstName: this.state.FirstName,
            Initial: this.state.Initial,
            LastName: this.state.LastName,
            DOB: this.state.DOB,
            Gender: this.state.Gender,
            Address: this.state.Address,
            City: this.state.City,
            Province: this.state.Province,
            PostalCode: this.state.PostalCode,
            Country: this.state.Country,
            Complexion: this.state.Complexion,
            HairColor: this.state.HairColor,
            HairLength: this.state.HairLength,
            Height: this.state.Height,
            Weight: this.state.Weight,
            Glasses: this.state.Glasses,
            Clothing: this.state.Clothing,
            Marks: this.state.Marks,
            Tattoos: this.state.Tattoos,
            IssuedAt: this.state.IssuedAt,
            Date: this.state.TressPassDate,
            PeriodOfTime: this.state.PeriodOfTime,
            TresspassOffence: this.state.TressPassOffenceSelected,
            ReasonForNotice: this.state.ReasonForNotice,
            ClientId: this.state.SelectedClientName.userId,
            Photos: this.state.Attachments,
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

    onTresspassNoticeSelect = (e) => {
        this.setState({
            TressPassNoticeId: e.data.sysSerial,
            SelectedClientName: { userName: e.data.clientName, userId: e.data.clientId.toString() },
            FirstName: e.data.firstName,
            Initial: e.data.initial,
            LastName: e.data.lastName,
            DOB: new Date(e.data.dob),
            Gender: e.data.gender,
            Address: e.data.address,
            City: e.data.city,
            Province: e.data.province,
            PostalCode: e.data.postalCode,
            Country: e.data.country,
            Complexion: e.data.complexion,
            HairColor: e.data.hairColor,
            HairLength: e.data.hairLength,
            Height: e.data.height,
            Weight: e.data.weight,
            Glasses: e.data.glasses,
            Clothing: e.data.clothing,
            Marks: e.data.marks,
            Tattoos: e.data.tattoos,
            IssuedAt: e.data.issuedAt,
            TressPassDate: new Date(e.data.date),
            PeriodOfTime: e.data.periodOfTime,
            TressPassOffenceSelected: e.data.tresspassOffence,
            ReasonForNotice: e.data.reasonForNotice,
            Photos: e.data.photos,
            disableDeleteButton: false,

            displayDialog: true,
            IsApproved: e.data.isApproved
        },()=>{
            // this.service.downloadFile(this.state.Photos);
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
                SysSerial: this.state.TressPassNoticeId,
                FirstName: this.state.FirstName,
                Initial: this.state.Initial,
                LastName: this.state.LastName,
                DOB: this.state.DOB,
                Gender: this.state.Gender,
                Address: this.state.Address,
                City: this.state.City,
                Province: this.state.Province,
                PostalCode: this.state.PostalCode,
                Country: this.state.Country,
                Complexion: this.state.Complexion,
                HairColor: this.state.HairColor,
                HairLength: this.state.HairLength,
                Height: this.state.Height,
                Weight: this.state.Weight,
                Glasses: this.state.Glasses,
                Clothing: this.state.Clothing,
                Marks: this.state.Marks,
                Tattoos: this.state.Tattoos,
                IssuedAt: this.state.IssuedAt,
                Date: this.state.TressPassDate.toLocaleString(),
                PeriodOfTime: this.state.PeriodOfTime,
                TresspassOffence: this.state.TressPassOffenceSelected,
                ReasonForNotice: this.state.ReasonForNotice,
                ClientId: this.state.SelectedClientName.userId,
                // Photos: this.state.Attachments,
                // CreatedBy: this.state.FirstName,
                // CreatedDate: this.state.FirstName,
                // UpdatedBy: this.state.FirstName,
                // UpdatedDate: this.state.FirstName,

                isApproved: this.state.IsApproved,
            }

            if (approve && approve === true ||  this.state.IsApproved === "YES") {
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
                    Obj.Photos = fileName;

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
    onTresspassNoticeRowSelect(e) {
        this.setState({
            TressPassNoticeId: e.data.sysSerial,
            SelectedClientName: { userName: e.data.clientName, userId: e.data.clientId.toString() },
            FirstName: e.data.firstName,
            Initial: e.data.initial,
            LastName: e.data.lastName,
            DOB: new Date(e.data.dob),
            Gender: e.data.gender,
            Address: e.data.address,
            City: e.data.city,
            Province: e.data.province,
            PostalCode: e.data.postalCode,
            Country: e.data.country,
            Complexion: e.data.complexion,
            HairColor: e.data.hairColor,
            HairLength: e.data.hairLength,
            Height: e.data.height,
            Weight: e.data.weight,
            Glasses: e.data.glasses,
            Clothing: e.data.clothing,
            Marks: e.data.marks,
            Tattoos: e.data.tattoos,
            IssuedAt: e.data.issuedAt,
            TressPassDate: new Date(e.data.date),
            PeriodOfTime: e.data.periodOfTime,
            TressPassOffenceSelected: e.data.tresspassOffence,
            ReasonForNotice: e.data.reasonForNotice,
            Photos: e.data.attachments,
            disableDeleteButton: false,
            IsApproved: e.data.isApproved

        })
        if (e.data.isApproved && e.data.isApproved === "Yes") {
            this.setState({ disableApproveButton: true });
        }
        else {
            this.setState({ disableApproveButton: false });
        }
    }

    ApproveTresspassNotice() {
        this.SaveEdit(true);
    }

    rowClass(data) {
        return {
            "approvedRow": data.isApproved && data.isApproved === "Yes",
            "needApprovalRow": !data.isApproved || data.isApproved === "No",
        }
    }
    showDeleteModal() {
        if (this.state.SelectedTressPassNotice && this.state.SelectedTressPassNotice !== null && this.state.SelectedTressPassNotice !== "") {
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
                    pdf.save("tresspass_notice.pdf");
                });
            this.setState({
                displayDownloadDialog: false
            })
        }, 2000);
    }

    changeTressPassOffence(e) {
        var arr = this.state.TressPassOffenceSelected;
        var ind = arr.findIndex(x => x === e.value);
        if (ind === -1) {
            arr.push(e.value)
        }
        else {
            arr.splice(ind, 1);
        }

        this.setState({
            TressPassOffenceSelected: arr
        })
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
                        disabled={disableApproveButton} onClick={(e) => this.ApproveTresspassNotice()} />
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
        if (this.state.Photos && this.state.Photos != "" && this.state.Photos.split(',').length > 0)
            DownloadPhotos = this.state.Photos.split(',').map((x,ind) =>
                <div key={ind} >
                    <span onClick={()=>{this.downloadFile(x)}} style={{color:'blue', cursor:'pointer'}}>{x}</span>
                </div>
            )
        return (
            <div>
                <Growl ref={(el) => this.growl = el}></Growl>
                <div className="p-grid p-fluid" >
                    <div className="card card-w-title">
                        <h1>Tresspass Notice Request</h1>
                        <div className="p-grid" style={{ marginTop: '8px' }} ></div>
                        <div className="content-section implementation">
                            <DataTable header={header} value={this.state.TressPassNoticeList} paginator={this.state.isLoading === false} rows={15}
                                onRowDoubleClick={this.onTresspassNoticeSelect} responsive={true}
                                selectionMode="single" selection={this.state.SelectedTressPassNotice} onSelectionChange={e => this.setState({ SelectedTressPassNotice: e.value })}
                                resizableColumns={true} columnResizeMode="fit" rowClassName={this.rowClass}
                                onRowClick={e => this.onTresspassNoticeRowSelect(e)} sortField="isApproved" sortOrder={1}>
                                <Column field="clientName" header="Client Name" filter={true} filterPlaceholder="search by name"  />
                                <Column field="date" header="Date Created" sortable={true} />
                                <Column field="firstName" header="First Name" filter={true} filterPlaceholder="search by name"  />
                                <Column field="address" header="Address" filter={true} filterPlaceholder="search by keyword"  />
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
                                header="Tresspass Notice Details" modal={true} footer={dialogFooter}
                                onHide={() => this.setState({ displayDialog: false })}
                                contentStyle={{ maxHeight: "450px", overflow: "auto" }}>
                                {
                                    <div className="p-grid p-fluid">
                                        <div className="p-grid p-fluid" >
                                            <div className="card card-w-title">
                                                <h1>Edit Tresspass Notice Report</h1>
                                                <div className="p-grid p-col-12">
                                                    <div className=" p-col-12 p-sm-12 p-md-4 p-lg-4">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">First Name <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="First Name" value={this.state.FirstName} type="text" size="30"
                                                                onChange={(e) => this.setState({ FirstName: e.target.value })}
                                                                style={this.state.isFirstNameValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-4 p-lg-4">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Initial <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Initial" value={this.state.Initial} type="text" size="30"
                                                                onChange={(e) => this.setState({ Initial: e.target.value })}
                                                                style={this.state.isInitialValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-4 p-lg-4">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Last Name <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Last Name" value={this.state.LastName} type="text" size="30"
                                                                onChange={(e) => this.setState({ LastName: e.target.value })}
                                                                style={this.state.isLastNameValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Date Of Birth <span style={{ color: 'red' }}>*</span></label>
                                                            <DatePicker
                                                                selected={this.state.DOB}
                                                                onChange={date => this.setState({ DOB: date })}
                                                                className={this.state.isDOBValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"}
                                                            />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Gender: <span style={{ color: 'red' }}>*</span></label>
                                                            <div style={this.state.isGenderValid === true ? {} : errorBoxForCheckBox}>
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">Male</span>
                                                                <RadioButton value="Male" name="Gender"
                                                                    onChange={(e) => this.setState({ Gender: e.value })}
                                                                    checked={this.state.Gender === 'Male'} />
                                                                <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">Female</span>
                                                                <RadioButton value="Female" name="Gender"
                                                                    onChange={(e) => this.setState({ Gender: e.value })}
                                                                    checked={this.state.Gender === 'Female'} />
                                                            </div>
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Address <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Address" value={this.state.Address} type="text" size="30"
                                                                onChange={(e) => this.setState({ Address: e.target.value })}
                                                                style={this.state.isAddressValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">City <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Last Name" value={this.state.City} type="text" size="30"
                                                                onChange={(e) => this.setState({ City: e.target.value })}
                                                                style={this.state.isCityValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Province <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Last Name" value={this.state.Province} type="text" size="30"
                                                                onChange={(e) => this.setState({ Province: e.target.value })}
                                                                style={this.state.isProvinceValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Postal Code <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Postal Code" value={this.state.PostalCode} type="text" size="30"
                                                                onChange={(e) => this.setState({ PostalCode: e.target.value })}
                                                                style={this.state.isPostalCodeValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Country <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Country" value={this.state.Country} type="text" size="30"
                                                                onChange={(e) => this.setState({ Country: e.target.value })}
                                                                style={this.state.isCountryValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Complexion <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Last Name" value={this.state.Complexion} type="text" size="30"
                                                                onChange={(e) => this.setState({ Complexion: e.target.value })}
                                                                style={this.state.isComplexionValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Hair Colour<span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Hair Colour" value={this.state.HairColor} type="text" size="30"
                                                                onChange={(e) => this.setState({ HairColor: e.target.value })}
                                                                style={this.state.isHairColorValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Hair Length <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Hair Length" value={this.state.HairLength} type="text" size="30"
                                                                onChange={(e) => this.setState({ HairLength: e.target.value })}
                                                                style={this.state.isHairLengthValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Height <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Height" value={this.state.Height} type="text" size="30"
                                                                onChange={(e) => this.setState({ Height: e.target.value })}
                                                                style={this.state.isHeightValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Weight <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Weight" value={this.state.Weight} type="text" size="30"
                                                                onChange={(e) => this.setState({ Weight: e.target.value })}
                                                                style={this.state.isWeightValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Glasses <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Glasses" value={this.state.Glasses} type="text" size="30"
                                                                onChange={(e) => this.setState({ Glasses: e.target.value })}
                                                                style={this.state.isGlassesValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Clothing <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Clothing" value={this.state.Clothing} type="text" size="30"
                                                                onChange={(e) => this.setState({ Clothing: e.target.value })}
                                                                style={this.state.isClothingValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Marks <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Marks" value={this.state.Marks} type="text" size="30"
                                                                onChange={(e) => this.setState({ Marks: e.target.value })}
                                                                style={this.state.isMarksValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Tattoos <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Tattoos" value={this.state.Tattoos} type="text" size="30"
                                                                onChange={(e) => this.setState({ Tattoos: e.target.value })}
                                                                style={this.state.isTattoosValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Issued At <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText placeholder="Issued At" value={this.state.IssuedAt} type="text" size="30"
                                                                onChange={(e) => this.setState({ IssuedAt: e.target.value })}
                                                                style={this.state.isIssuedAtValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Date <span style={{ color: 'red' }}>*</span></label>
                                                            <DatePicker
                                                                selected={this.state.TressPassDate}
                                                                onChange={date => this.setState({ TressPassDate: date })}
                                                                className={this.state.isTressPassDateValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"}
                                                            />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Period Of Time <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText value={this.state.PeriodOfTime} type="text" size="30"
                                                                onChange={(e) => this.setState({ PeriodOfTime: e.target.value })}
                                                                style={this.state.isPeriodOfTimeValid === true ? normalBox : errorBox} />
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Tresspass Offence: <span style={{ color: 'red' }}>*</span></label>
                                                            <div style={this.state.isTressPassOffenceValid === true ? {} : errorBoxForCheckBox}>
                                                                {
                                                                    this.state.TressPassOffence.map(x =>
                                                                        <div key={x}>
                                                                            <RadioButton value={x} name="TressPassOffence"
                                                                                onChange={(e) => this.changeTressPassOffence(e)}
                                                                                checked={this.state.TressPassOffenceSelected.includes(x)} />
                                                                            <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">{x}</span>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </span>
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                                        <span className="ui-float-label">
                                                            <label htmlFor="float-input">Reason For Notice: <span style={{ color: 'red' }}>*</span></label>
                                                            <InputText value={this.state.ReasonForNotice} type="text" size="30"
                                                                onChange={(e) => this.setState({ ReasonForNotice: e.target.value })}
                                                                style={this.state.isReasonForNoticeValid === true ? normalBox : errorBox} />
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
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">First Name: </label>
                                                        {this.state.FirstName}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Initial: </label>
                                                        {this.state.Initial}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Last Name: </label>
                                                        {this.state.LastName}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Date Of Birth: </label>
                                                        {this.state.DOB && this.state.DOB.toString() ? this.state.DOB.toString() : ""}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Gender: </label>
                                                        {this.state.Gender}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Address: </label>
                                                        {this.state.Address}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">City: </label>
                                                        {this.state.City}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Province: </label>
                                                        {this.state.Province}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Postal Code: </label>
                                                        {this.state.PostalCode}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Country: </label>
                                                        {this.state.Country}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Complexion: </label>
                                                        {this.state.Complexion}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Hair Colour<span style={{ color: 'red' }}>*</span></label>
                                                        {this.state.HairColor}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Hair Length: </label>
                                                        {this.state.HairLength}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Height: </label>
                                                        {this.state.Height}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Weight: </label>
                                                        {this.state.Weight}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Glasses: </label>
                                                        {this.state.Glasses}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Clothing: </label>
                                                        {this.state.Clothing}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Marks: </label>
                                                        {this.state.Marks}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Tattoos: </label>
                                                        {this.state.Tattoos}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Issued At: </label>
                                                        {this.state.IssuedAt}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Date: </label>
                                                        {this.state.TressPassDate && this.state.TressPassDate.toString() ? this.state.TressPassDate.toString() : ""}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Period Of Time: </label>
                                                        {this.state.PeriodOfTime}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Tresspass Offence: </label>
                                                        {this.state.TressPassOffenceSelected}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Reason For Notice: </label>
                                                        {this.state.ReasonForNotice}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Client Name: </label>
                                                        {this.state.SelectedClientName ? this.state.SelectedClientName.userName : ""}
                                                    </div>
                                                    <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                                        <label className="p-col-3 p-sm-3 p-md-3 p-lg-3" htmlFor="float-input">Upload Attachments</label>
                                                        {this.state.Photos}
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
export default withAuthorization(condition)(ListTressPassNotice);