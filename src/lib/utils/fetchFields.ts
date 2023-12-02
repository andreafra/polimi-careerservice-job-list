import type { Field } from "$lib/model/field"

const FIELDS_URL = "https://www.careerservice.polimi.it/api/it-IT/Announcement/Courses"

export async function fetchFields(): Promise<Field[]> {
    const dataJson = await fetch(FIELDS_URL)
    const { data } = await dataJson.json()
    return data
}
