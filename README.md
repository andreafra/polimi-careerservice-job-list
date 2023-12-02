# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Technical Details

### Locales
- `en-US`
- `it-IT`

# Categories
You can fetch categories with the query:

`https://www.careerservice.polimi.it/api/it-IT/Announcement/Courses`

which returns the following schema:
```typescript
interface Response {
  data: Array<{
    fieldId: string // an incremental id
    fieldName: string // category name
    hightPercent: 38 // lol, a typo!
    isBroken: false // why
    subscriptions: 31 // the number of jobs posted
  }>
}
```
# Jobs
You can fetch jobs in a category with the query:

`https://www.careerservice.polimi.it/api/it-IT/Announcement/Announcements?PagedFilter.NumberOfPages=16&PagedFilter.PageIndex=1&PagedFilter.PageSize=10&companyName&companyNameId&announcement&announcementId&onlyFavoriteCompanies=false&onlyFavoriteAnnouncements=false&location&location_it&location_es&paid&courses[0]=74465615`

which returns the following schema:
```typescript
interface Response {
  data: {
    numberOfPages: number
    pageIndex: number
    pages: Array<{
        announcementType: string // Job, Stage ...
        companyName: string
        date: string // format: "2023-12-01 12:00:00"
        id: string // numeric
        isFavourite: boolean
        location: string
        name: string
        pictureUrl: string
        pictureUrlGray: string
        stored: number,
        hasRimborso: boolean,
        tipologia: string // Job, ...?
    }>
    totalItems: number,
    showAlert: boolean
  }
  hasError: boolean
}
```
# Job Details
First you need the following cookies:
- `careerApp`
- `JSESSION`

Then GET the following URL:

`https://www.careerservice.polimi.it/api/it-IT/Announcement/Announcement?announcementId={ID}&announcementType={JOB}`
