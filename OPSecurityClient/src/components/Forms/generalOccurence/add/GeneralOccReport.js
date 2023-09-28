import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import { ProgressBar } from 'primereact/progressbar';
import { RadioButton } from 'primereact/radiobutton';
import DatePicker from "react-datepicker";
import TimePicker from '../../../timepicker';
import { withAuthorization } from '../../../Session';

import "react-datepicker/dist/react-datepicker.css";
import * as ROLES from '../../../../constants/roles';
import GeneralOccurenceService from '../../../../api/generalOcc/generalOccService';

const INITIAL_STATE = {
    isLoading: false,
    error: false,

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
    isOpenClosedValid: true,
    isSelectedOccurenceValid: true,
    isSelectedClientNameValid: true,
}

const errorBox = {
    borderRadius: '3px', borderColor: 'red'
};
const normalBox = {
    border: '1px solid #a6a6a6'
};
const errorBoxForCheckBox = {
    border: '1px solid red', borderRadius: '3px'
};

class GeneralOccurence extends Component {

    constructor(props) {
        super(props)
        this.state = INITIAL_STATE;
        this.service = new GeneralOccurenceService();
    }

    componentDidMount() {
        this.getClientsName();
        this.getOccurenceTypes();
    }

    getClientsName() {
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

    onFileSelected = (event) => {
        const { target: { files } } = event;
        const filesToStore = [];

        [...files].map(file => {
            filesToStore.push(file)
        });

        this.setState({ files: filesToStore });
    }

    onSaveData() {
        var validForm = this.validateForm();
        if (validForm) {

            var Obj = {
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
                DiaryDate: this.state.DiaryDate.toLocaleString(),
                IsApproved: "No",
                CreatedDate: new Date(),
                CreatedBy: this.props.authUser.id
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
                        .Add(Obj)
                        .then(() => {
                            this.growl.show({ severity: 'success', summary: 'Success', detail: 'Added' });
                            this.resetForm();
                        })
                        .catch((error) => {
                            this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error: while adding' });
                            this.setState({ isLoading: false });
                        })
                })
            } else {
                this.service
                    .Add(Obj)
                    .then(() => {
                        this.growl.show({ severity: 'success', summary: 'Success', detail: 'Added' });
                        this.resetForm();
                    })
                    .catch((error) => {
                        this.growl.show({ severity: 'error', summary: 'Error', detail: 'Error: while adding' });
                        this.setState({ isLoading: false });
                    })
            }
        }
        else {

        }
    }

    onClientSelected(name) {
        this.setState({ SelectedClientName: name.value })
    }
    onOccurenceTypeSelected(name) {
        this.setState({ SelectedOccurence: name.value })
    }

    render() {

        return (
            <div><Growl ref={(el) => this.growl = el}></Growl>

                <div className="p-grid p-fluid" >
                    <div className="card card-w-title">
                        <h1>Add General Occurence Report</h1>

                        <div className="p-grid p-col-9">
                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                <span className="ui-float-label">
                                    <label htmlFor="float-input">Type of Occurence <span style={{ color: 'red' }}>*</span></label>
                                    <Dropdown optionLabel="name" placeholder="Select" value={this.state.SelectedOccurence} readOnly={this.state.isLoading} options={this.state.OccurenceTypes} onChange={(e) => this.onOccurenceTypeSelected(e)}
                                        style={this.state.isSelectedOccurenceValid === true ? normalBox : errorBox} />
                                </span>
                            </div>
                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                <span className="ui-float-label">
                                    <label htmlFor="float-input">Client Name <span style={{ color: 'red' }}>*</span></label>
                                    <Dropdown optionLabel="userName" placeholder="Select" value={this.state.SelectedClientName} readOnly={this.state.isLoading} options={this.state.ClientNames} onChange={(e) => this.onClientSelected(e)}
                                        style={this.state.isSelectedClientNameValid === true ? normalBox : errorBox} />
                                </span>
                            </div>
                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                <span className="ui-float-label">
                                    <label htmlFor="float-input">Site Address <span style={{ color: 'red' }}>*</span></label>
                                    <InputText placeholder="# Street, Unit, City, Province" value={this.state.SiteAddress} type="text" size="30" onChange={(e) => this.setState({ SiteAddress: e.target.value })}
                                        style={this.state.isSiteAddressValid === true ? normalBox : errorBox} />
                                </span>
                            </div>
                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                <span className="ui-float-label">
                                    <label htmlFor="float-input">Police Division <span style={{ color: 'red' }}>*</span></label>
                                    <InputText value={this.state.PoliceDivision} type="text" size="30" onChange={(e) => this.setState({ PoliceDivision: e.target.value })}
                                        style={this.state.isPoliceDivisionValid === true ? normalBox : errorBox} />
                                </span>
                            </div>
                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                <span className="ui-float-label">
                                    <label htmlFor="float-input">Place Of Occurence <span style={{ color: 'red' }}>*</span></label>
                                    <InputText placeholder="# Street, Unit, City, Province (Exact Location)" value={this.state.OccurencePlace} type="text" size="30" onChange={(e) => this.setState({ OccurencePlace: e.target.value })}
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
                                    />
                                </span>
                            </div>
                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                <span className="ui-float-label">
                                    <label htmlFor="float-input">Complaint Received By <span style={{ color: 'red' }}>*</span></label>
                                    <InputText placeholder="Guard Name - Lic#" value={this.state.ReceivedBy} type="text" size="30" onChange={(e) => this.setState({ ReceivedBy: e.target.value })}
                                        style={this.state.isReceivedByValid === true ? normalBox : errorBox} />
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
                                    />
                                </span>
                            </div>
                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                <span className="ui-float-label">
                                    <label htmlFor="float-input">Initial Investigation By <span style={{ color: 'red' }}>*</span></label>
                                    <InputText placeholder="Guard Name - Lic#" value={this.state.InvestigationBy} type="text" size="30" onChange={(e) => this.setState({ InvestigationBy: e.target.value })}
                                        style={this.state.isInvestigationByValid === true ? normalBox : errorBox} />
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
                                        className={this.state.isInvestigationDateValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"}
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
                                        className={this.state.isDateMadeOutValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"}
                                    />
                                </span>
                            </div>

                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                            </div>

                            <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                <span className="ui-float-label">
                                    <label htmlFor="float-input">Synopsis <span style={{ color: 'red' }}>*</span></label>
                                    <InputTextarea rows={10} cols={30} value={this.state.Synopsis} onChange={(e) => this.setState({ Synopsis: e.target.value })} autoResize={true}
                                        style={this.state.isSynopsisValid === true ? normalBox : errorBox} />
                                </span>
                            </div>
                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                <span className="ui-float-label">
                                    <label htmlFor="float-input">Open / Closed: <span style={{ color: 'red' }}>*</span></label>
                                    <div style={this.state.isOpenClosedValid === true ? {} : errorBoxForCheckBox} >
                                        <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">Open</span> <RadioButton value="Open" name="OpenClosed"
                                            onChange={(e) => this.setState({ OpenClosed: e.value })}
                                            checked={this.state.OpenClosed === 'Open'} />
                                        <span className="p-col-4 p-sm-4 p-md-3 p-lg-3">Closed</span> <RadioButton value="Closed" name="OpenClosed"
                                            onChange={(e) => this.setState({ OpenClosed: e.value })}
                                            checked={this.state.OpenClosed === 'Closed'} />
                                    </div>
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
                                    <label htmlFor="float-input">Diary Date:  <span style={{ color: 'red' }}>*</span></label>
                                    <DatePicker placeholderText="Select Date" selected={this.state.DiaryDate}
                                        onChange={date => this.setState({ DiaryDate: date })}
                                        className={this.state.isDateMadeOutValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox"}
                                    />
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
                            <div className="p-col-12 p-sm-12 p-md-12 p-lg-12">
                                {this.state.isLoading === true ? <ProgressBar mode="indeterminate" style={{ height: '2px' }} /> : null}
                            </div>
                            <div className="p-col-12 p-sm-12 p-md-12 p-lg-12" style={{ color: 'red' }}>
                                {this.state.error === true ? "Please fill all the required(red marked) fields" : null}
                            </div>
                            <div className="p-col-4 p-sm-4 p-md-2 p-lg-2">
                                <span className="ui-float-label">
                                    <Button label="Save" className="p-button-primary ui-btns" disabled={this.state.isLoading} onClick={(e) => this.onSaveData(e)} />
                                </span>
                            </div>
                            <div className="p-col-4 p-sm-4 p-md-2 p-lg-2">
                                <span className="ui-float-label">
                                    <Button label="Reset" className="p-button-secondary " disabled={this.state.isLoading} />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
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
            isLoading: false,
            error: false,

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
            isOpenClosedValid: true,
            isSelectedOccurenceValid: true,
            isSelectedClientNameValid: true,
        }, () => {
            this.getClientsName();
            this.getOccurenceTypes();
        })
    }
}

const condition = authUser => authUser && authUser.roles && (authUser.roles === ROLES.ADMIN || authUser.roles === ROLES.EMPLOYEE)
export default withAuthorization(condition)(GeneralOccurence);