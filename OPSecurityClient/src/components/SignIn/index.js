import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp';
import * as ROUTES from '../../constants/routes';
import { PasswordForgetLink } from '../PasswordForget';
//import  UserService  from '../../api/user';
import  AuthenticationService from '../../api/user';

import './SignIn.scss';

const SignInPage = () => (
  <div>
    <SignInForm />
    {/* <PasswordForgetLink />
    <SignUpLink /> */}
  </div>
);
const INITIAL_STATE = {
  userid: '',
  password: '',
  error: null,
};
class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    //this.UserService = new UserService();
    this.authenticationService = new AuthenticationService();
  }
  onSubmit = async event => {
    const { userid, password } = this.state;
    
    this.authenticationService.login(userid, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.LANDING);
      })
      .catch(error => {
        this.setState({ error: error.message });
      });

    event.preventDefault();
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { userid, password, error } = this.state;
    const isInvalid = password === '' || userid === '';
    return (
      <div id="login" class="login-form-container">
        <header>LOGIN - SIGN UP</header>
          <form onSubmit={this.onSubmit}>
          <fieldset>
          <div class="input-wrapper">
              <input
                name="userid"
                value={userid}
                onChange={this.onChange}
                type="text"
                placeholder="User or Email"
                autocomplete="off"
              />
            </div>
            <div class="input-wrapper">
              <input
                name="password"
                value={password}
                onChange={this.onChange}
                type="password"
                placeholder="Password"
                autoComplete="off"
              />
            </div>
            <button disabled={isInvalid} type="submit">
              Sign In
            </button>
              {error && <p>{error.message}</p>}
            </fieldset>
          </form>
        </div>
    );
  }
}
const SignInForm = compose(
  withRouter,
)(SignInFormBase);
export default SignInPage;
export { SignInForm };