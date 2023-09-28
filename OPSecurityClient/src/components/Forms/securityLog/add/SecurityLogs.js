import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import { ProgressBar } from 'primereact/progressbar';
import DatePicker from "react-datepicker";
import TimePicker from '../../../timepicker';
import { withAuthorization } from '../../../Session';

import "react-datepicker/dist/react-datepicker.css";
import SecurityLogService from '../../../../api/securityLogs/securitylogservice';
import * as ROLES from '../../../../constants/roles';

const INITIAL_STATE = {
    isLoading: false,
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
}

const errorBox = {
    borderRadius: '3px', borderColor: 'red'
};
const normalBox = {
    border: '1px solid #a6a6a6'
};
class SecurityLogs extends Component {

    constructor(props) {
        super(props)
        this.state = INITIAL_STATE;
        this.service = new SecurityLogService();
    }
    
    componentDidMount() {
        this.getClientName();
    }
    
    getClientName() {
        this.service.GetClients().then(data =>{
            this.setState({
                ClientNames: data
            })
        });
    }

    onSaveSecuritLog() {
        var validForm = this.validateForm();
        if (validForm) {
            var Obj = {
                ClientId: this.state.SelectedClientName.userId,             //"1",
                Date: this.state.StartDate.toLocaleString(),                   //"2020/03/03",
                EndTime: this.state.EndTime,                                //"2020/03/03",
                SiteAddress: this.state.SiteAddress,                        //"abc",
                StartTime: this.state.StartTime,                            //"2020/03/03",
                TimeDetails: this.state.TimeDetails,                        //"abc"
                CreatedDate: new Date(),
                CreatedBy: this.props.authUser.id
            }
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
        else {

        }
    }

    setStartDate(date) {
        this.setState({ StartDate: date })
    }
    handleStartChange(time) {
        this.setState({ StartTime: time })
    }
    handleEndChange(time) {
        this.setState({ EndTime: time })
    }
    onClientSelected(name) {
        this.setState({ SelectedClientName: name.value })
    }
    
    render() {

        return (
            <div><Growl ref={(el) => this.growl = el}></Growl>

                <div className="p-grid p-fluid" >
                    <div className="card card-w-title">
                        <h1>Add Security Shift Log</h1>

                        <div className="p-grid p-col-9">
                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                <span className="ui-float-label">
                                    <label htmlFor="float-input">Date <span style={{ color: 'red' }}>*</span></label>
                                    <DatePicker placeholderText="Select Date" selected={this.state.StartDate} onChange={date => this.setStartDate(date)}
                                     className={ this.state.isStartDateValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox" } />
                                </span>
                            </div>

                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                            </div>

                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                <span className="ui-float-label">
                                    <label htmlFor="float-input">Start Time <span style={{ color: 'red' }}>*</span></label>
                                    <TimePicker time={this.state.StartTime} theme="Ash" placeholder="Start Time"
                                        onSet={(val) => {
                                            this.handleStartChange(val.format24);
                                        }}
                                        className={ this.state.isStartTimeValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox" }
                                    />
                                </span>
                            </div>
                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                <span className="ui-float-label">
                                    <label htmlFor="float-input">End Time <span style={{ color: 'red' }}>*</span></label>
                                    <TimePicker time={this.state.EndTime} theme="Ash" placeholder="End Time"
                                        onSet={(val) => {
                                            this.handleEndChange(val.format24);
                                        }}
                                        className={ this.state.isEndTimeValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox" }
                                    />
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
                            <div className=" p-col-12 p-sm-12 p-md-12 p-lg-12">
                                <span className="ui-float-label">
                                    <label htmlFor="float-input">Time Details <span style={{ color: 'red' }}>*</span></label>
                                    <InputTextarea rows={10} cols={30} value={this.state.TimeDetails} onChange={(e) => this.setState({ TimeDetails: e.target.value })} autoResize={true}
                                        style={this.state.isTimeDetailsValid === true ? normalBox : errorBox} />
                                </span>
                            </div>
                            <div className="p-col-12 p-sm-12 p-md-12 p-lg-12">
                                {this.state.isLoading === true ? <ProgressBar mode="indeterminate" style={{ height: '2px' }} /> : null}
                            </div>
                            <div className="p-col-12 p-sm-12 p-md-12 p-lg-12" style={{color:'red'}}>
                                {this.state.error === true ? "Please fill all the required(red marked) fields" : null}
                            </div>
                            <div className="p-col-4 p-sm-4 p-md-2 p-lg-2">
                                <span className="ui-float-label">
                                    <Button label="Save" className="p-button-primary ui-btns" disabled={this.state.isLoading} onClick={(e) => this.onSaveSecuritLog(e)} />
                                </span>
                            </div>
                            <div className="p-col-4 p-sm-4 p-md-2 p-lg-2">
                                <span className="ui-float-label">
                                    <Button label="Cancel" className="p-button-secondary " disabled={this.state.isLoading} />
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
        if (!this.state.StartDate || (this.state.StartDate && this.state.StartDate.toString().trim() === '')) {
            this.setState({ isStartDateValid: false });
            error += "Date cannot be empty \n";
        }else{this.setState({ isStartDateValid: true });}
        if (this.state.StartTime.trim() === '') {
            this.setState({ isStartTimeValid: false });
            error += "Start Time cannot be empty \n";
        }else{this.setState({ isStartTimeValid: true });}
        if (this.state.EndTime.trim() === '') {
            this.setState({ isEndTimeValid: false });
            error += "End Time cannot be empty \n";
        }else{this.setState({ isEndTimeValid: true });}
        if (!this.state.SelectedClientName.userId || (this.state.SelectedClientName && this.state.SelectedClientName.userId &&
            this.state.SelectedClientName.userId.trim() === '')) {
            this.setState({ isSelectedClientNameValid: false });
            error += "Client Name cannot be empty \n";
        }else{this.setState({ isSelectedClientNameValid: true });}
        if (this.state.SiteAddress.trim() === '') {
            this.setState({ isSiteAddressValid: false });
            error += "Site Address cannot be empty \n";
        }else{this.setState({ isSiteAddressValid: true });}
        if (this.state.TimeDetails.trim() === '') {
            this.setState({ isTimeDetailsValid: false });
            error += "Time Details cannot be empty \n";
        }else{this.setState({ isTimeDetailsValid: true });}

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
            isLoading: false,
            error: false,
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
        },() =>{
            this.getClientName();
        })
    }
}

const condition = authUser => authUser && authUser.roles && (authUser.roles === ROLES.ADMIN || authUser.roles === ROLES.EMPLOYEE)
export default withAuthorization(condition)(SecurityLogs);