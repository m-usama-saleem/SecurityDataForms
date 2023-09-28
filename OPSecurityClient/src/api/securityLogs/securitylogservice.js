import http,{handleResponseError} from "../../common/http-common";

class SecurityLogService {

    constructor() {
        this.currentUserSubject = JSON.parse(localStorage.getItem('currentUser'))
    }

    Add = async (securityLogs) => {
        await http.post("/securitylogs/save", securityLogs,
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
        await http.post("/securitylogs/update", securityLogs,
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
        await http.post("/securitylogs/delete", obj,
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
            http.get("/securitylogs/getall" + arg,
                {
                    headers: {
                        'Authorization': 'Bearer ' + this.currentUserSubject.token,
                    }
                })
                .then(response => {
                    resolve(response.data)
                })
                .catch(function (error) {
                    reject(handleResponseError(error))
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

export default SecurityLogService;