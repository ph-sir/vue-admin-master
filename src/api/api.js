import axios from 'axios'


let base = 'http://192.168.1.101:8081/usermg';

axios.interceptors.request.use(
    config => {
        var accessToken = localStorage.getItem('accessToken');
        if (accessToken && accessToken !== '') {
            config.headers.common['Authorization'] = accessToken;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
axios.interceptors.response.use(
    function (reponse) {
        var accessToken = reponse.headers['authorization'];
        if (accessToken && accessToken !== '') {
            localStorage.setItem('accessToken',accessToken);
        }
        return reponse;
    },

    function(error) {
        // Do something with response error
        return Promise.reject(error);
    }
);

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(
    function (res) {
        return res.data;
    }
); };

export const requestLogout = () => {return axios.get(`${base}/logout`); }

export const getUserList = params => { return axios.get(`${base}/users`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/users/page`, { params: params }); };

export const removeUser = params => { return axios.delete(`${base}/users/` + params.userId); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.put(`${base}/users/` + params.userId, { params: params }); };

export const addUser = params => { return axios.post(`${base}/users`, params); };



export const getOrgList = params => { return axios.get(`${base}/orgs`, {params: params}); };

export const removeOrg = params => { return axios.delete(`${base}/orgs/` + params.userId); };

export const editOrg = params => { return axios.put(`${base}/orgs/` + params.userId, params); };

export const addOrg = params => { return axios.post(`${base}/orgs`, params); };

