import { useState, useEffect } from 'react';
import { Input } from 'semantic-ui-react';


import ImageGrid from '../ImageGrid/ImageGrid';
import Image from '../../shared/interfaces/image.interface';
import { Child, RedditResponse } from '../../shared/interfaces/reddit.interface';

import './input-form.css';

function InputForm() {
    const baseApiUrl = 'https://www.reddit.com/r/Amoledbackgrounds';
    const [images, setImages] = useState<Image[]>([]);
    const [lastElement, setLastElement] = useState('');
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [submittedQuery, setSubmittedQuery] = useState(false);

    useEffect(() => {
        getPhotos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, submittedQuery]);

    function getQueryUrl() {
        // Sample URL: https://www.reddit.com/r/videos/search.json?q=potatoes+dog&restrict_sr=on&include_over_18=on&sort=relevance&t=all
        return `${baseApiUrl}/search.json?q=${query}&restrict_sr=on&include_over_18=on&sort=relevance&t=all`;
    }

    function getPhotos() {
        setSubmittedQuery(false);
        let apiUrl = `${baseApiUrl}.json`;
        let hasQuery = false;
        if (query) { 
            apiUrl = getQueryUrl();
            hasQuery = true;
        }
        if (lastElement){
            apiUrl += `${ hasQuery ? '&' : '?' }after=${lastElement}`
        };

        fetch(apiUrl)
            .then((res) => res.json())
            .then((jsonResponse: RedditResponse) => {
                const data = jsonResponse.data;
                const posts = data.children;

                const newImages: Image[] = posts
                    .filter((post: Child) => post.data.post_hint === 'image')
                    .map((post: Child) => {
                        return {
                                key: post.data.name,
                                author: post.data.author,
                                score: post.data.score,
                                title: post.data.title,
                                subreddit: post.data.subreddit_name_prefixed,
                                url: post.data.url,
                            } as Image;
                        });

                if (!lastElement){
                    setImages(newImages);
                } else {
                    setImages(images => [...images, ...newImages]);
                }

                if (data.after) {
                    setLastElement(data.after);
                    setHasMore(true);
                } else if(!data.after) {
                    setHasMore(false);
                }
            });
    }


    function handleSearchSubmit(e: Event) {
        e.preventDefault();
        setLastElement('');
        setSubmittedQuery(true);
    }

    function handleInputChange(newValue: string) {
        setQuery(newValue);
    }

    return (
      <div>
        <div className="search-container">
        <form onSubmit={event => handleSearchSubmit(event.nativeEvent)} >
          <Input 
            className="form"
            type="text"
            action="Search"
            icon='search'
            iconPosition='left'
            placeholder="Search for wallpapers"
            onChange={event => handleInputChange(event.target.value)} value={query} />
        </form>
        <h3 className="license">All credits to the <a href="https://reddit.com/">Reddit</a> site and its users</h3>
        </div>
        <ImageGrid images={images} next={() => setPage(page => page + 1)} hasMore={hasMore}/>
       </div>

    );
}

export default InputForm;