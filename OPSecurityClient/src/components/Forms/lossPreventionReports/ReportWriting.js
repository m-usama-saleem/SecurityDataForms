import React, { Component } from 'react';
import { withAuthorization } from '../../Session';

import "react-datepicker/dist/react-datepicker.css";
import * as ROLES from '../../../constants/roles';

const INITIAL_STATE = {

}

class ReportWriting extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        window.open('http://olympian.saleswareltd.com/dreams/Loss_Prevention_Olympian.pdf', "_blank")
    }


    render() {
        return (
            <div>
            </div>
        );
    }
}

const condition = authUser => authUser && authUser.roles && (authUser.roles === ROLES.ADMIN || authUser.roles === ROLES.EMPLOYEE)
export default withAuthorization(condition)(ReportWriting);