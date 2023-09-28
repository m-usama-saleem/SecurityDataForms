import React, { Component } from 'react';
import FormItem from '../Forms/FormItem';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';

class HomePage extends Component {
  render() {
    return (
      <div className="row col-md-12" style={{justifyContent: 'center'}} >
        <FormItem {...this.props} title="Security Log" image="assets/demo/images/car/Audi.png" routeName={ROUTES.SECURITY_LOGS_ADD} />
        <FormItem {...this.props} title="General Occurence Report" image="assets/demo/images/car/BMW.png" routeName={ROUTES.SECURITY_LOGS_ADD} />
        <FormItem {...this.props} title="Loss Prevention Case" image="assets/demo/images/car/Ford.png" routeName={ROUTES.SECURITY_LOGS_ADD} />
        <FormItem {...this.props} title="Alarm Response Report" image="assets/demo/images/car/Honda.png" routeName={ROUTES.SECURITY_LOGS_ADD} />
        <FormItem {...this.props} title="Parking Enforcement Report" image="assets/demo/images/car/Volvo.png" routeName={ROUTES.SECURITY_LOGS_ADD} />
        <FormItem {...this.props} title="Tress Pass Notices" image="assets/demo/images/car/Mercedes.png" routeName={ROUTES.SECURITY_LOGS_ADD} />
      </div>
    )
  }
}
const condition = authUser => !!authUser;
export default withAuthorization(condition)(HomePage);