import { kv } from '@vercel/kv'
import { fetchJobs } from '$lib/utils/fetchJobs';
import type { Job } from '$lib/model/job'
import type { Field } from '$lib/model/field';
import { fetchFields } from '$lib/utils/fetchFields';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    const field = params.fieldId
    const jobsCacheKey = `field:${field}`

    const fieldCacheKey = 'fields'

    let fields: Field[] = await kv.get<Field[]>(fieldCacheKey)
    let jobs = await kv.get<Job[]>(jobsCacheKey)

    if (!fields) {
        fields = await fetchFields()
        await kv.set(fieldCacheKey, fields)
        await kv.expire(fieldCacheKey, 60 * 60 * 24)
    }
    if (!jobs) {
        jobs = await fetchJobs(field)
        await kv.set(jobsCacheKey, jobs)
        await kv.expire(jobsCacheKey, 60 * 60 * 24)
    }

    return { fields, jobs }
}