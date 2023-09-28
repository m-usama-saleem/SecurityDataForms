import { BehaviorSubject, Observable } from 'rxjs';
import http from "../../common/http-common";

class AlarmResponseService {

    constructor() {
        this.currentUserSubject = JSON.parse(localStorage.getItem('currentUser'))
    }

    Add = async (model) => {
        await http.post("/alarmresponses/save", model,
            {
                headers: {
                    'Authorization': 'Bearer ' + this.currentUserSubject.token,
                }
            })
            .then(response => {
                if (response.data !== null && response.data.token !== null) {
                }
            })
            .catch(function (error) {
                throw error
            });
    }

    Edit = async (securityLogs) => {
        await http.post("/AlarmResponses/update", securityLogs,
            {
                headers: {
                    'Authorization': 'Bearer ' + this.currentUserSubject.token,
                }
            })
            .then(response => {
                if (response.data !== null && response.data.token !== null) {
                }
            })
            .catch(function (error) {
                throw error
            });
    }

    Delete = async (obj) => {
        await http.post("/AlarmResponses/delete", obj,
            {
                headers: {
                    'Authorization': 'Bearer ' + this.currentUserSubject.token,
                }
            })
            .then(response => {
                if (response.data !== null && response.data.token !== null) {
                }
            })
            .catch(function (error) {
                throw error
            });
    }

    GetAll(id) {
        var arg = id && id != "" ? "?id=" + id : "";
        return new Promise((resolve, reject) => {
            http.get("/AlarmResponses/getall" + arg,
                {
                    headers: {
                        'Authorization': 'Bearer ' + this.currentUserSubject.token,
                    }
                })
                .then(response => {
                    resolve(response.data)
                })
                .catch(function (error) {
                    throw error
                });
        })
    }

    GetClients() {
        return new Promise((resolve, reject) => {
            http.get("/users/clientlist",
                {
                    headers: {
                        'Authorization': 'Bearer ' + this.currentUserSubject.token,
                    }
                })
                .then(response => {
                    resolve(response.data)
                })
                .catch(function (error) {
                    throw error
                });
        })
    }
}

export default AlarmResponseService;