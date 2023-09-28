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
import AlarmResponseService from '../../../../api/alarmResponse/alarmResponseService';


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
    DispatchRequestTypeSelected:[],
    AlarmTypeSelected:[],
    ReportToClientSelected:[],

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

class AlarmResponse extends Component {

    constructor(props) {
        super(props)
        this.state = INITIAL_STATE;
        this.service = new AlarmResponseService();
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

    onSaveData() {
        var validForm = this.validateForm();
        if (validForm) {

            var Obj = {
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
                isApproved: "No",
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

    onClientSelected(name) {
        this.setState({ SelectedClientName: name.value })
    }
    changeDispatchRequestType(e){
        var arr = this.state.DispatchRequestTypeSelected;
        var ind = arr.findIndex(x => x === e.value);
        if(ind === -1){
            arr.push(e.value)
        }
        else{
            arr.splice(ind, 1);
        }

        this.setState({ 
            DispatchRequestTypeSelected: arr
         })
    }

    changeAlarmType(e){
        var arr = this.state.AlarmTypeSelected;
        var ind = arr.findIndex(x => x === e.value);
        if(ind === -1){
            arr.push(e.value)
        }
        else{
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

    render() {

        return (
            <div><Growl ref={(el) => this.growl = el}></Growl>
                <div className="p-grid p-fluid" >
                    <div className="card card-w-title">
                        <h1>Add Alarm Response Report</h1>
                        <div className="p-grid p-col-9">
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
                                    <InputText  placeholder="# Street, Unit, City, Province" value={this.state.SiteAddress} type="text" size="30" 
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
                                        className={ this.state.isArrivalValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox" }
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
                                        className={ this.state.isDepartureValid === true ? "p-inputtext normalbox" : "p-inputtext errorBox" }
                                    />
                                </span>
                            </div>
                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                <span className="ui-float-label">
                                    <label htmlFor="float-input">Key# Box#</label>
                                    <InputText placeholder="Key# Box#" value={this.state.KeyBox} type="text" size="30"
                                     onChange={(e) => this.setState({ KeyBox: e.target.value })}/>
                                </span>
                            </div>
                            <div className=" p-col-12 p-sm-12 p-md-6 p-lg-6">
                                <span className="ui-float-label">
                                    <label htmlFor="float-input">Keys: <span style={{ color: 'red' }}>*</span></label>
                                    <div style={this.state.isKeysValid === true ? {}: errorBoxForCheckBox}>
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
                                    style={this.state.isRequestedByValid === true ? normalBox : errorBox}/>
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
                                    <div style={this.state.isServiceDispatchedValid === true ? {}: errorBoxForCheckBox}>
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
                                    <div style={this.state.isSubscriberValid === true ? {}: errorBoxForCheckBox}>
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
        } else { this.setState({ isSiteAddressValid: true }) }
        if (!this.state.DateReceived || (this.state.DateReceived && this.state.DateReceived.toString().trim() === '')) {
            this.setState({ isDateReceivedValid: false });
            error += "Date Received cannot be empty \n";
        }else{this.setState({ isDateReceivedValid: true });}
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
            DispatchRequestTypeSelected:[],
            AlarmTypeSelected:[],

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
        }, () => {
            this.getClientsName();
        })
    }
}

const condition = authUser => authUser && authUser.roles && (authUser.roles === ROLES.ADMIN || authUser.roles === ROLES.EMPLOYEE)
export default withAuthorization(condition)(AlarmResponse);