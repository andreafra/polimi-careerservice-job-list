import { kv } from '@vercel/kv'
import { fetchJobDetails } from '$lib/utils/fetchJobDetails.js';
import type { Details } from '$lib/model/details';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    const { jobId, type } = params
    const jobCacheKey = `job:${jobId}:${type}`

    let job = await kv.get<Details>(jobCacheKey)
    if (!job) {
        job = await fetchJobDetails(jobId, type)
        await kv.set(jobCacheKey, job)
        await kv.expire(jobCacheKey, 60 * 60 * 24)
    }
    return { job }
}