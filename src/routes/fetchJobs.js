/**
 * Prepends a CORS proxy to an URL
 * @param {string} url the URL to proxy
 * @returns the new proxed URL
 */
function proxyCors(url) {
	return 'https://corsproxy.io/?' + encodeURIComponent(url);
}

export const catURL = proxyCors(
	`https://www.careerservice.polimi.it/api/it-IT/Announcement/Courses?companyName=&companyNameId=&announcement=&announcementId=&onlyFavoriteCompanies=false&onlyFavoriteAnnouncements=false&location=&location_it=false&location_es=false&paid=false`
);

export const jobsURL = (category = '', numberOfPages = 16, pageIndex = 0) =>
	proxyCors(
		'https://www.careerservice.polimi.it/api/it-IT/Announcement/Announcements?PagedFilter.NumberOfPages=' +
			numberOfPages +
			'&PagedFilter.PageIndex=' +
			pageIndex +
			'&PagedFilter.PageSize=10&companyName=&companyNameId=&announcement=&announcementId=&onlyFavoriteCompanies=false&onlyFavoriteAnnouncements=false&location=&location_it=&location_es=&paid=&courses[0]=' +
			category
	);
