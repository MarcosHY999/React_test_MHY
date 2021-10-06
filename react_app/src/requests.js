const request = require('axios');
const API_URL = 'http://127.0.0.1:5000/'

export async function requestUserProfile() {
    let contents = 0;
    await request({
        'url': API_URL + 'userprofile',
    })
        .then(function (response) {
            {
                contents = response.data;
            }
        });
    return contents;
}

export async function requestLessons() {
    let contents = 0;
    await request({
        'url': API_URL + 'lessons',
    })
        .then(function (response) {
            {
                contents = response.data;
            }
        });
    return contents;
}

export async function requestInstructorName(id) {
    let contents = 0;
    await request({
        'url': API_URL + 'instructor/' + id,
    })
        .then(function (response) {
            {
                contents = response.data;
            }
        });
    return contents;
}
