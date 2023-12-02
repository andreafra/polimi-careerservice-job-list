export interface Job {
    id: string
    date: string
    name: string
    pictureUrl: string | null
    company: string
    type: string
    city: string
    province: string
    numberOfApplicants: number
}