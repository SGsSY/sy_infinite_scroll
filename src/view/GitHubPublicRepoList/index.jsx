import React, { useEffect, useState, useCallback } from 'react';
import GitHubApi from "api/github";
import debounce from 'lodash/debounce';
import useScroll from 'hooks/useScroll';

const RepoList = ({ queryString, dataList, isLoading, isError }) => {
    if (!queryString) return <p>Looking for anything?</p>
    if (isError) return <p>OOPS! Server went wrong. Please try it later. Contact web admin if this keep happenning.</p>;

    return (
        <>
            <ul>
                {dataList.map((item, idx) => (
                    <li key={`repolist-${idx}-${item.node_id}`}>{item.name}</li>
                ))}
            </ul>
            {(isLoading) && <p>Loading...</p>}
        </>
    )
}

const GitHubPublicRepoList = (props) => {

    const [queryString, setQueryString] = useState();
    const [page, setPage] = useState(0);
    const [end, setEnd] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const fetchData = async () => {

        setIsLoading(true);

        try {
            const data = await GitHubApi.Repo.getSearchRepo(queryString, page);
            const { total_count, items } = data;
            const newData = dataList.concat(items);
            if (items.length > 0) setDataList(dataList.concat(items));
            if (newData.length >= total_count) setEnd(true);
        } catch (err) {
            console.log(err);
            setIsError(true)
        } finally {
            setIsLoading(false);
        }
    }

    const delayFetch = useCallback(debounce(fetchData, 500), [queryString, page]);

    useEffect(() => {
        delayFetch();
        
        return delayFetch.cancel;
    }, [delayFetch])

    const initState = () => {
        setPage(0);
        setEnd(false);
        setDataList([]);
        setIsError(false);
        setIsLoading(false);
    }

    const handleInputChange = (event) => {
        setQueryString(event.target.value);
        initState();
    }

    const scrollCallback = useCallback((e) => {
        const maxScroll = e.target.scrollHeight - e.target.offsetHeight;
        const scrollTop = e.target.scrollTop;
        const difference = maxScroll - scrollTop;

        if (difference <= 0 && !end && !isLoading) {
            setPage(page + 1);
        }
    }, [end, page, isLoading])

    const ref = useScroll(scrollCallback);

    return (
        <div
            style={{
                height: '100vh',
                overflow: 'auto',
                padding: '0px 20px'
            }}
            ref={ref}
        >
            <h3>GitHub Repo List</h3>
            <div>
                <input
                    name="repo_name"
                    onChange={handleInputChange}
                />
            </div>
            <RepoList
                queryString={queryString}
                dataList={dataList}
                isLoading={isLoading}
                isError={isError}
            />
        </div>
    )
}

export default GitHubPublicRepoList
