import React, { Component } from 'react';
import { withAuthorization } from '../Session';

import "react-datepicker/dist/react-datepicker.css";
import * as ROLES from '../../constants/roles';

class ForceReport extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        window.open('http://olympian.saleswareltd.com/dreams/08-006-012.pdf', "_blank")
    }


    render() {
        return (
            <div>
            </div>
        );
    }
}

const condition = authUser => authUser && authUser.roles && (authUser.roles === ROLES.ADMIN || authUser.roles === ROLES.EMPLOYEE)
export default withAuthorization(condition)(ForceReport);