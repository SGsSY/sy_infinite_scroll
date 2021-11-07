import { GitHubApiUrl } from "..";

const getSearchRepo = async (queryString = '', page = 0) => {

    let url = `/search/repositories?per_page=50&page=${page}`
    if (queryString) url += `&q=${queryString}`;

    const result = await fetch(GitHubApiUrl + url);
    const parsedResult = await result.json();

    return parsedResult;
}


const GitHubRepo = {
    getSearchRepo,
}

export default GitHubRepo;