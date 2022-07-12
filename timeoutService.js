import axios from 'axios';
import { getUserProfile } from './userService';
import { transformDropdownOptions } from '@lib/utilities';
import { SAVED_CANDIDATE_LISTS } from '@constants/candidates';
 
/**
 * Fetch details for a position description review by id.
 * @param {Number} reviewID Unique identifier for the review to fetch.
 */
export const getAnnouncementReview = (reviewID) => {
    // const url = `http://localhost:3000/reviews/announcement/${reviewID}`;
    const url = `/data/announcement-review/review.json`;
    return axios.get(url);
};
 
/**
 * Fetch details for a position description review by id.
 * @param {Number} reviewID Unique identifier for the review to fetch.
 */
export const getAnnouncementReviewHistory = (reviewID) => {
    // const url = `http://localhost:3000/reviews/announcement/${reviewID}/history`;
    const url = `/data/announcement-review/history.json`;
    return axios.get(url);
};
/**
 * Send a GET request to retrieve a Summary for the user.
 */
export const getApplicantListReview = () => {
    // const url = `http://localhost:3000/summaries`;
    const url = `data/review/applicant-list/1.json`;
    return axios.get(url);
};
/**
* Send a GET request to retrieve a Summary for the user.
*/
export const getPanelReviews = () => {
    // const url = `http://localhost:3000/summaries`;
    const url = `data/reviews/panel.json`;
    return axios.get(url);
};
const axiosInstance = axios.create({
    withCredentials: true
});
 
/**
 * Send a GET request to retrieve a Summary for the user.
 */
export const getSummary = async () => {
    //const url = `/data/dashboard/summaries.json`;
    const url = `/Summary`;
    return axiosInstance.get(url);
};
 
/**
 * Fetch the filter field options to display.
 */
export const getPositionDescriptionFilterFields = () => {
    const url = `/PositionDescription/FilterOptions`;
    return axiosInstance.get(url);
};
 
/**
 * Fetch the Request filter field options to display.
 */
export const getRequestFilterFields = () => {
    const url = `/Request/FilterOptions`;
    return axiosInstance.get(url);
};
 
/**
 * Fetch the Review filter field options to display.
 */
export const getReviewFilterFields = () => {
    const url = `/Review/FilterOptions`;
    return axiosInstance.get(url);
};
 
/**
 * Fetch the filter field options to display.
 */
export const getUserAsRequesterFilterOption = async () => {
    const curUserProfile = await getUserProfile();
    const profile = curUserProfile.data;
    return {
        key: profile.userID,
        value: profile.userID,
        text: `${profile.lastName}, ${profile.firstName}${profile.middleName ? " " + profile.middleName[0] + "." : ""}`
    };
};
 
/**
 * Fetch the filter field options to display.
 */
export const getRequestersFilterOptions = async (customerIds = null) => {
    let url = `/Requester/GetRequestersByCustomers?SortBy=2&SortDirection=-1&Limit=10000`;
 
    if (customerIds && Array.isArray(customerIds)) {
        var customerParams = customerIds.map(customerId => `CustomerIds=${customerId}`);
        url = url + "&" + customerParams.join("&");
    }
    const response = await axiosInstance.get(url);
 
    const transformedRequesters = response.data.requesters.map(option => {
        return {
            key: option.userId,
            value: option.userId,
            text: `${option.lastName}, ${option.firstName}${option.middleName ? " " + option.middleName[0] + "." : ""}`
        }
    })
 
    return transformedRequesters;
};
 
/**
 * Fetch the filter field options to display.
 */
export const getLocationsFilterOptions = async (keywords = "") => {
    //Picked 2 because state abbreviations only have 2 characters
    if (keywords.length < 2) return [];
 
    const url = `/Location/GetLocations`;
    const obj = {
        limit: 1000,
        page: 1,
        sortBy: 0,
        sortDirection: -1,
        displayFields: ["City", "Country", "StateAbbreviation"],
        locationCodes: [],
        keyWordSearchFields: ["City", "Country", "StateAbbreviation"],
        keyWords: [keywords]
    }
    const response = await axiosInstance.post(url, obj);
 
    const transformedLocations = response.data.apiResult.locations.map(option => {
        return {
            key: JSON.stringify(option),
            value: JSON.stringify(option),
            text: `${option.city}, ${option.stateAbbreviation && option.country === "United States" ? option.stateAbbreviation : option.country ? option.country : ""}`
        }
    })
 
    return transformedLocations;
};
 
/**
 * Fetch the list of reviews matching passed filter criteria
 * @param {Object} criteria Object with properties defining the query string parameters to include with the server request.
 */
export const getReviews = (queryParams) => {
    var obj = {
        limit: queryParams.limit,
        sortBy: queryParams.sortBy,
        sortDirection: queryParams.sortDirection,
        reviewStatuses: queryParams.fields.reviewStatuses.SelectedValues,
        reviewTypes: queryParams.fields.reviewTypes.SelectedValues,
        keywords: queryParams.keywords,
    };
    const url = "/Review/GetReviews";
    return axiosInstance.post(url, obj);
};
 
/**
 * Fetch the list of positions matching passed filter criteria
 * @param {Object} criteria Object with properties defining the query string parameters to include with the server request.
 */
export const getPositionDescriptions = (queryParams) => {
    //const url = `/positions/filtered${queryParams}`;
    //const url = `/data/dashboard/positions.json`;
    //return axiosInstance.get(url);
    var obj = {
        limit: queryParams.limit,
        sortBy: queryParams.sortBy,
        sortDirection: queryParams.sortDirection,
        customers: queryParams.fields.customers.SelectedValues,
        occupationalSeries: queryParams.fields.occupationalSeries.SelectedValues,
        payPlans: queryParams.fields.payPlans.SelectedValues,
        grades: queryParams.fields.grades.SelectedValues,
        positionStatuses: queryParams.fields.positionDescriptionViewableStatuses.SelectedValues,
        keywords: queryParams.keywords,
    };
    const url = "/PositionDescription/GetPositionDescriptions";
    return axiosInstance.post(url, obj);
};
 
/**
 * Fetch the list of positions matching passed filter criteria
 * @param {Object} criteria Object with properties defining the query string parameters to include with the server request.
 */
export const getRequests = async (queryParams) => {
    var obj = {
        limit: queryParams.limit,
        sortBy: queryParams.sortBy,
        sortDirection: queryParams.sortDirection,
        grades: queryParams.fields.grades.SelectedValues,
        payPlans: queryParams.fields.payPlans.SelectedValues,
        customers: queryParams.fields.customers.SelectedValues,
        requesters: queryParams.fields.requesters.SelectedValues,
        requestStatuses: queryParams.fields.requestStatuses.SelectedValues,
        occupationalSeries: queryParams.fields.occupationalSeries.SelectedValues,
        locations: getLocationFilters(queryParams.fields.locations.SelectedValues),
        keywords: queryParams.keywords,
    };
    const url = "/Request/GetRequests";
    const response = await axiosInstance.post(url, obj);
 
    const responseCode = response.data.status;
    const responseSuccess = response.data.isSuccessStatus;
    const responseData = response.data.apiResult;
    const responseErrors = (response.data.errorResult ? response.data.errorResult.errors : null);
 
    return { isSuccess: responseSuccess, status: responseCode, data: responseData, errors: responseErrors };
};
 
export const getLocationFilters = (locationArray) => {
    let locationsFilters = [];
    locationArray.forEach(location => {
        locationsFilters.push(JSON.parse(location));
    });
    return locationsFilters;
}
 
/**
 * Fetch the list of activities associated with a request.
 * @param {Number} requestId Unique identifier for the request to fetch activities for.
 */
export const getActivities = (requestId) => {
    //const url = `/activities/request/${requestId}`;
    const url = `/data/dashboard/requestActivities.json`;
    return axiosInstance.get(url);
};
 
/**
 * Fetch details for a position description review by id.
 * @param {Number} reviewID Unique identifier for the review to fetch.
 */
export const getPositionDescriptionReview = (reviewID) => {
    // const url = `http://localhost:3000/reviews/position/${reviewID}`;
    const url = `/data/position-review/review.json`;
    return axios.get(url);
};
 
/**
 * Fetch details for a position description review by id.
 * @param {Number} reviewID Unique identifier for the review to fetch.
 */
export const getPositionDescriptionReviewHistory = (reviewID) => {
    // const url = `http://localhost:3000/reviews/position/${reviewID}/history`;
    const url = `/data/position-review/history.json`;
    return axios.get(url);
};
export function getCandidates(queryParams) {
    // const url = `/candidates/filtered${queryParams}`;
    const url = `/data/candidate-inventory/candidates.json`;
    return axios.get(url);
};
 
export function getCandidateFilters() {
    // const url = `/filters/candidates`;
    const url = `/data/filters/candidate.json`;
    return axios.get(url);
};
 
export const putCandidateToggle = (applicantId, toggleName) => {
    // const url = `/reviews/sme-resume/${id}/next-application`;
    // return axios.put(url, data);
    return new Promise((resolve, reject) => {
        if (applicantId && toggleName) { resolve({ status: 200, data: true }); }
        else { reject({ status: 201, error: "An unexpected error occured." }); }
    })
};
 
export async function getPayPlans() {
    const url = `/data/userProfile.json`;
    const response = await axiosInstance.get(url);
    return transformDropdownOptions(response.data.payPlanList);
}
 
export async function getGradesForPayPlan(payPlanId) {
    const url = `/data/candidate-inventory/grades.json`;
    const response = await axiosInstance.get(url);
 
    const plan = response.data.payPlans.find((plan) => plan.id === payPlanId);
    if (plan) {
        return plan.grades;
    } else {
 
        // TODO -- Remove this filler data and find a way to handle pay plans
        // without grade data
        return [
            {
                "name": "A",
                "id": 101
            },
            {
                "name": "B",
                "id": 102
            },
            {
                "name": "C",
                "id": 103
            },
        ]
    }
}
 
export async function getCandidate(id) {
    const url = `/data/candidate-inventory/candidate.json`;
    const response = await axiosInstance.get(url);
    return response.data.candidate;
}
 
export async function getCandidateSearchResults(filters) {
    const url = `/data/candidate-inventory/results.json`;
    const response = await axiosInstance.get(url);
    return response.data.candidates;
}
 
export async function getSavedSearches() {
    const url = `/data/candidate-inventory/searches.json`;
    const response = await axiosInstance.get(url);
    return response.data.searches;
}
 
export async function getSavedCandidates() {
    const url = `/data/candidate-inventory/savedCandidates.json`;
    const response = await axiosInstance.get(url);
    return response.data;
}
 
// TODO If a backend endpoint for candidate lists names is created in the future,
// we need to change this method to call that.  Additionally, since it will then be
// an async data load, we would need to restructure the Candidate Inventory code to
// call this function as little as necessary (probably just the first time in a
// user's session) and save it in global state otherwise.
export function getSavedCandidateLists() {
    return SAVED_CANDIDATE_LISTS.lists;
}
 
export async function saveSearch(search) {
    console.log('Search saved with data: ' + JSON.stringify(search));
}
 
export async function deleteSearch(id) {
    console.log('Delete clicked for search ID ' + id);
}
 
// TODO per latest designs, change the Saved Search card to allow for
// changing search names (and to use this endpoint).
export async function updateSearchName(id, name) {
    console.log('Changing name of search ID ' + id + ' to ' + name);
}
 
export async function saveCandidateToList(candidateId, listId) {
    console.log('Saved candidate with id ' + candidateId + ' to list with id ' + listId);
}
 
// TODO per designs, change the candidate card on the saved candidates page
// to allow for removing the candidate from the list (and to use this endpoint).
export async function deleteCandidateFromList(candidateId, listId) {
    console.log('Removed candidate with id ' + candidateId + ' from list with id ' + listId);
}
/**
 * Send a GET request to retrieve an evaluation from the queue for the current review.
 */
 export const getEvaluation = (id) => {
    //const url = `http://localhost:8000/reviews/smeReview/${id}/evaluations/next`;
    const url = `/data/resume-review/evaluation.json`;
    return axiosInstance.get(url);
  };
 
  /**
   * Send a GET request to retrieve the progress for the current review.
   */
  export const getProgress = (id) => {
    //const url = `http://localhost:8000/reviews/smeReview/${id}/progress`;
    const url = `/data/resume-review/progress.json`;
    return axiosInstance.get(url);
  };
 
  /**
   * Send a GET request to retrieve a review.
   */
  export const getReview = (id) => {
    //const url = `http://localhost:8000/reviews/smeReview/${id}`;
    const url = `/data/resume-review/review.json`;
    return axiosInstance.get(url);
  };
 
  /**
   * Send a POST request to record the SME recused themselves from evaluating a specific applicant.
   */
   export const postSmeRecusal = (id, data) => {
    //const url = `http://localhost:8000/reviews/smeReview/${id}/recusal`;
    const url = `/data/resume-review/review.json`;
    //return axiosInstance.post(url, data);
    return axiosInstance.get(url, data);
    return new Promise((resolve, reject) => { resolve({ status: 200, data: true }); });
  };
 
 
  /**
   * Send a PUT request to updated an evaluation record with input from a specific SME.
   */
   export const putEvaluation = (id, evaluationId, data) => {
    //const url = `http://localhost:8000/reviews/smeReview/${id}/evaluations/${evaluationId}`;
    const url = `/data/resume-review/review.json`;
    //return axiosInstance.put(url, data);
    return axiosInstance.get(url, data);
    // return new Promise((resolve, reject) => {
    //   if (data) { resolve({ status: 200, data: data }); }
    //   else { reject({ status: 201, error: "An unexpected error occured." }); }
    // })
  };
 
  /**
   * Send a DELETE request to delete an 'in progress' evaluation.
   */
   export const deleteEvaluation = (reviewId, evaluationId) => {
    //const url = `http://localhost:8000/reviews/smeReview/${reviewId}/evaluations/${evaluationId}`;
    const url = `/data/resume-review/review.json`;
    //return axiosInstance.delete(url);
    return axiosInstance.get(url);  
    return new Promise((resolve, reject) => { resolve({ status: 200, data: true }); });
  };
  export const getDocuments = (id) => {
    // const url = `http://localhost:3000/requests/${id}/documents`;
    const url = `/data/request/documents.json`;
    return axios.get(url);
  };
 
  /**
   * Fetch the filter field options to display.
   */
  export const getHistory = (id) => {
    // const url = `http://localhost:3000/requests/${id}/history`;
    const url = `/data/request/history.json`;
    return axios.get(url);
  };
 
  /**
   * Fetch the list of reviews matching passed filter criteria
   * @param {Object} id Unique identifier for a request.
   */
  export const getRequest = (id) => {
    // const url = `http://localhost:3000/requests/${id}/show`;
    const url = `/data/request/existing.json`;
    return axios.get(url);
  };
 
  /**
   * Fetch the list of reviews matching passed filter criteria
   * @param {Object} criteria Object with properties defining the query string parameters to include with the server request.
   */
  export const getReqPositionDescriptions = (criteria) => {
    // const url = `http://localhost:3000/positions/filtered/${queryString}`;
    const url = `/data/request/positionSearchResults.json`;
    return axios.get(url);
  };
 
  /**
   * Fetch the list of reviews matching passed filter criteria
   * @param {Object} criteria Object with properties defining the query string parameters to include with the server request.
   */
  export const getLocations = (criteria) => {
    // const url = `http://localhost:3000/locations/filtered/${queryString}`;
    const url = `/data/request/locationSearchResults.json`;
    return axios.get(url);
  };
