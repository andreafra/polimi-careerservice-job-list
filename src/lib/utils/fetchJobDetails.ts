import { DEV_COOKIE_CAREERAPP, DEV_COOKIE_JSESSIONID } from '$env/static/private'

const devCookies = {
    JSESSIONID: DEV_COOKIE_JSESSIONID,
    careerApp: DEV_COOKIE_CAREERAPP
}

function getJobDetailURL(id: string, type: string, locale: string = 'it-IT') {
    return `https://www.careerservice.polimi.it/api/${locale}/Announcement/Announcement?announcementId=${id}&announcementType=${type}`
}

export async function fetchJobDetails(
    id: string,
    type: string,
    cookies = devCookies
) {
    const cookieString = `JSESSIONID=${cookies.JSESSIONID}; careerApp=${cookies.careerApp}`
    const dataJson = await fetch(getJobDetailURL(id, type), {
        headers: {
            Cookie: cookieString
        }
    })
    const { data } = await dataJson.json()

    return data
}