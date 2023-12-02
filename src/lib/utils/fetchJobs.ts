import type { Job } from "$lib/model/job";

const DEFAULT_IMG_URL = 'https://app.careerservice.polimi.it/upload/immagine_default_piccola.png';

/**
 * 
 * @param {string} field The ID of the category
 * @param {number} pages The number of pages to fetch
 * @param {number} index The page index from which starting the fetch
 * @param {number} pageSize The number of items per page
 * @param {string} locale The language of the output
 * @returns 
 */
function getJobsURL(
    field = "all",
    pages = 16,
    index = 0,
    pageSize = 10,
    locale = "it-IT"
) {
    return `https://www.careerservice.polimi.it/api/${locale}/Announcement/Announcements?PagedFilter.NumberOfPages=${pages}&PagedFilter.PageIndex=${index}&PagedFilter.PageSize=${pageSize}` + (field !== 'all' ? `&courses[0]=${field}` : '')
}

export async function fetchJobs(field): Promise<Job[]> {
    const jobsMetadataRes = await fetch(getJobsURL());
    if (jobsMetadataRes.status !== 200) {
        return []
    }
    const { data } = await jobsMetadataRes.json();
    const totalPages = data.numberOfPages;

    const jobsRes = await fetch(getJobsURL(field, totalPages, 1));
    if (jobsRes.status !== 200) {
        return []
    }
    const { data: jobData } = await jobsRes.json();
    const jobs: Job[] = jobData.pages
        .flat()
        .map((job) => {
            let loc = job.location.match(/(.*?)\((.*?)\)/);
            return {
                id: job.id,
                date: job.date,
                name: job.name.trim(),
                pictureUrl: job.pictureUrl !== DEFAULT_IMG_URL ? job.pictureUrl : null,
                company: job.companyName.trim(),
                type: job.announcementType,
                city: (loc[1] || 'N/A').toUpperCase(),
                province: (loc[2].length >= 2 ? loc[2] : 'N/A').toUpperCase(),
                numberOfApplicants: job.stored
            }
        })

    return jobs
}