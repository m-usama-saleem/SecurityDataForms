import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import { ProgressBar } from 'primereact/progressbar';
import { RadioButton } from 'primereact/radiobutton';
import DatePicker from "react-datepicker";
import { withAuthorization } from '../../../Session';

import "react-datepicker/dist/react-datepicker.css";
import * as ROLES from '../../../../constants/roles';
import TressPassNoticeService from '../../../../api/tressPassNotice/tressPassNoticeService';


const INITIAL_STATE = {
    isLoading: false,
    error: false,

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
    files: [],

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

class TressPassNotice extends Component {

    constructor(props) {
        super(props)
        this.state = INITIAL_STATE;
        this.service = new TressPassNoticeService();
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
                CreatedDate: new Date(),
                CreatedBy: this.props.authUser.id,

                isApproved: "No",
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

    render() {

        return (
            <div><Growl ref={(el) => this.growl = el}></Growl>

                <div className="p-grid p-fluid" >
                    <div className="card card-w-title">
                        <h1>Add Tresspass Notice Report</h1>

                        <div className="p-grid p-col-9">
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
                                    <Dropdown optionLabel="userName" placeholder="Select" value={this.state.SelectedClientName} readOnly={this.state.isLoading}
                                        options={this.state.ClientNames} onChange={(e) => this.onClientSelected(e)}
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
        if (this.state.TressPassDate.toString().trim() === '') {
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
            isLoading: false,
            error: false,

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
            files: [],

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
        }, () => {
            this.getClientsName();

        })
    }
}

const condition = authUser => authUser && authUser.roles && (authUser.roles === ROLES.ADMIN || authUser.roles === ROLES.EMPLOYEE)
export default withAuthorization(condition)(TressPassNotice);