const config = require('./commons');
const tokenizer = require('./tokenizer');
const axios = require('axios');

let client;

function init() {
    client = axios.create({
        baseURL: config.url,
        timeout: 30 * 1000
    });
    initInterceptors(client);
    updateAccessToken(tokenizer.generateToken()); // move tokenizer init from here!!!!!!!   c a p e l i n g ! 
}

function setHeadersConfig(configName, value) {
    client.defaults.headers.common[configName] = value;
    console.log(`\n*****${value}*****\n`);
}

function updateAccessToken(accessToken) {
    if (accessToken)
        setHeadersConfig('Authorization', `bearer ${accessToken}`);
        setHeadersConfig('phash','932f3c1b56257ce8539ac269d7aab42550dacf8818d075f0bdf1990562aae3ef')
}

async function get(path, queryParams = {}) {
    const config = { params: queryParams };
    const { data: result } = await client.get(path, config);

    if (result.errorCode)
        return Promise.reject(new Error(result.errorCode));
    return result.data;
}

async function Delete(path, queryParams = {}) {
    const config = { params: queryParams };
    const { data: result } = await client.delete(path, config);

    if (result.errorCode)
        return Promise.reject(new Error(result.errorCode));
    return result.data;
}

async function post(path, body = {}, queryParams = {}) {
    const { data: res } = await client.post(path, body, { params: queryParams });

    if (res.errorCode)
        return Promise.reject(new Error(res.errorCode));
    return res.data;
}

async function put(path, body = {}) {
    return client.put(path, body)
        .then(result => {
            const res = result.data;
            if (res.errorCode)
                return Promise.reject(new Error(res.errorCode));
            return res.data;
        });
}

function initInterceptors(client) {
    // response interceptor
    // TODO add accesstoken change updateAccessToken()   

    client.interceptors.response.use(function (res) {
        const blue = '\x1b[36m';
        const green = '\x1b[32m';
        const italic_blue = '\x1b[3m';
        const dim = '\x1b[2m';
        const method = res.config.method;
        const url = `${res.request._headers.host}${res.request.path}`;
        const respStatus = `${res.status} ${res.statusText}`;

        if (res.data.accessToken) {
            updateAccessToken(res.data.accessToken);
            console.log(green, `\n\t accessToken updated by API`);
        }

        console.log(blue, `\n\t ${method.toUpperCase()}: ${url}`, italic_blue, `\n\t ${respStatus}`);
        return res;
    });
    client.interceptors.request.use(request => {
        console.log(`Starting Request:${request.method}${request.baseURL}${request.url}`);
        console.log('\x1b[2m', `auth: ${request.headers.common.Authorization}`);
        return request
    });
}

module.exports = {
    init,
    updateAccessToken,
    get,
    post,
    put,
    Delete
};
