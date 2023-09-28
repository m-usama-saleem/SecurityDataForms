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
import ParkingEnforcementService from '../../../../api/parkingEnforcement/parkingEnforcementService';


const INITIAL_STATE = {
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

class ParkingEnforcement extends Component {

    constructor(props) {
        super(props)
        this.state = INITIAL_STATE;
        this.service = new ParkingEnforcementService();
    }

    componentDidMount() {
        this.getClientsName();
    }

    getClientsName() {
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

    onSaveData() {
        var validForm = this.validateForm();
        if (validForm) {

            var Obj = {
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
                isApproved: "No",
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
            }
            else {
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

    render() {

        return (
            <div><Growl ref={(el) => this.growl = el}></Growl>

                <div className="p-grid p-fluid" >
                    <div className="card card-w-title">
                        <h1>Add Parking Enforcement Report</h1>
                        <div className="p-grid p-col-9">
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
                                    <Dropdown optionLabel="userName" placeholder="Select" value={this.state.SelectedClientName} readOnly={this.state.isLoading}
                                        options={this.state.ClientNames} onChange={(e) => this.onClientSelected(e)}
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
        }, () => {
            this.getClientsName();
        })
    }
}

const condition = authUser => authUser && authUser.roles && (authUser.roles === ROLES.ADMIN || authUser.roles === ROLES.EMPLOYEE)
export default withAuthorization(condition)(ParkingEnforcement);