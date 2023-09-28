import { BehaviorSubject, Observable } from 'rxjs';
import http from "../../common/http-common";
import FileDownload from 'js-file-download'

class ParkingEnforcementService {

    constructor() {
        this.currentUserSubject = JSON.parse(localStorage.getItem('currentUser'))
    }

    Add = (model) => {
        return new Promise((resolve, reject) => {
            http.post("/ParkingEnforcements/save", model,
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

    Edit = async (securityLogs) => {
        await http.post("/ParkingEnforcements/update", securityLogs,
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
        await http.post("/ParkingEnforcements/delete", obj,
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
            http.get("/ParkingEnforcements/getall" + arg,
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

    UploadFile(formData) {
        return new Promise((resolve, reject) => {
            http.post('/GeneralOccurences/upload', formData, {
                headers: {
                    'Authorization': 'Bearer ' + this.currentUserSubject.token,
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    if (response.data !== null) {
                        resolve(response.data)
                        debugger
                    }
                })
                .catch(function (error) {
                    throw error
                });
        });
    }
    downloadFile(data) {
        http.post("GeneralOccurences/download", { 'Name': data },
            {
                headers: {
                    'Authorization': 'Bearer ' + this.currentUserSubject.token,
                },
                responseType: 'arraybuffer'

            }).then(response => {
                if (response.data != null) {
                    FileDownload(response.data, data);
                }
            }).catch(ex => {
            })
    }
}

export default ParkingEnforcementService;