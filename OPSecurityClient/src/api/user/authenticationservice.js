import { BehaviorSubject, Observable } from 'rxjs';
import http from "../../common/http-common";

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

class AuthenticationService {
    
    constructor() { 
        this.onAuthStateChange = currentUserSubject.asObservable();
    }

    login = async (UserId, Password) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: { UserId: UserId, Password: Password }
        };
        await http.post("/users/login", { UserId: UserId, Password: Password })
        .then(response => {
          if(response.data !== null && response.data.token !== null){
            localStorage.setItem('currentUser', JSON.stringify(response.data));
            currentUserSubject.next(response.data);
          }    
        })
        .catch(function (error) {
          if ([401, 403].indexOf(error.response.status) !== -1) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            //AuthenticationService.logout();
            //location.reload(true);
          }
        });
    }
    
    logout = () => {
        localStorage.removeItem('currentUser');
        currentUserSubject.next(null);
    }

    currentUserValue = () => { return currentUserSubject.value }
    
    onAuthUserListener = (next, fallback) => {
        this.onAuthStateChange.subscribe((authUser) => {
          if (authUser) {
              next(authUser);
          }
          else {
            fallback();
          }
        });
      }
}

export default AuthenticationService;