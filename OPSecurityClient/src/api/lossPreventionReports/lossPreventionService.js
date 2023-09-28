import { BehaviorSubject, Observable } from 'rxjs';
import http from "../../common/http-common";

class LossPreventionService {

    constructor() {
        this.currentUserSubject = JSON.parse(localStorage.getItem('currentUser'))
    }

    Add = (model, type) => {
        var url = "/LossPreventions/save";
        return new Promise((resolve, reject) => {
            http.post(url, model,
                {
                    headers: {
                        'Authorization': 'Bearer ' + this.currentUserSubject.token,
                    }
                })
                .then(response => {
                    if (response.data !== null) {
                        resolve(response.data)
                    }
                })
                .catch(function (error) {
                    throw error
                });
        })
    }

    Edit = async (model, type) => {
        var url = "/LossPreventions/update";

        await http.post(url, model,
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

    Delete = async (obj, type) => {
        var url = "/LossPreventions/delete";

        await http.post(url, obj,
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

    GetAll(type) {
        var url = "/LossPreventions/getall" + "?type=" + type;

        return new Promise((resolve, reject) => {
            http.get(url,
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

export default LossPreventionService;