import { useState, useEffect } from 'react';
import { Input, Dropdown, DropdownProps } from 'semantic-ui-react';


import ImageGrid from '../ImageGrid/ImageGrid';
import Image from '../../shared/interfaces/image.interface';
import { Child, PostData, RedditResponse } from '../../shared/interfaces/reddit.interface';

import './input-form.css';

function InputForm() {
    const baseApiUrl = 'https://www.reddit.com/r/';
    const [images, setImages] = useState<Image[]>([]);
    const [lastElement, setLastElement] = useState('');
    const [query, setQuery] = useState('');
    const [subreddit, setSubreddit] = useState('AmoledBackgrounds');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [submittedQuery, setSubmittedQuery] = useState(false);

    const dropdownOptions = [
        {
            "key": "all",
            "text": "all",
            "value": "all"
        },
        {
            "key": "AmoledBackgrounds",
            "text": "AmoledBackgrounds",
            "value": "AmoledBackgrounds"
        },
        {
            "key": "AnimePhoneWallpapers",
            "text": "AnimePhoneWallpapers",
            "value": "AnimePhoneWallpapers"
        },
        {
            "key": "iphonewallpapers",
            "text": "iphonewallpapers",
            "value": "iphonewallpapers"
        },
        {
            "key": "itookapicture",
            "text": "itookapicture",
            "value": "itookapicture"
        },
        {
            "key": "iWallpaper",
            "text": "iWallpaper",
            "value": "iWallpaper"
        },
        {
            "key": "MobileWallpaper",
            "text": "MobileWallpaper",
            "value": "MobileWallpaper"
        },
        {
            "key": "phonewallpapers",
            "text": "phonewallpapers",
            "value": "phonewallpapers"
        },
        {
            "key": "pics",
            "text": "pics",
            "value": "pics"
        },
        {
            "key": "popular",
            "text": "popular",
            "value": "popular"
        },
        {
            "key": "Verticalwallpapers",
            "text": "Verticalwallpapers",
            "value": "Verticalwallpapers"
        },
        {
            "key": "wallpaper",
            "text": "wallpaper",
            "value": "wallpaper"
        },
        {
            "key": "wallpapers",
            "text": "wallpapers",
            "value": "wallpapers"
        },
        {
            "key": "WidescreenWallpaper",
            "text": "WidescreenWallpaper",
            "value": "WidescreenWallpaper"
        }
    ];

    useEffect(() => {
        getPhotos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, submittedQuery]);

    function getQueryUrl() {
        // Sample URL: https://www.reddit.com/r/videos/search.json?q=potatoes+dog&restrict_sr=on&include_over_18=on&sort=relevance&t=all
        return `${baseApiUrl + subreddit}/search.json?q=${query}&restrict_sr=on&include_over_18=on&sort=relevance&t=all`;
    }

    function getPreviewPhoto(postData: PostData) {
        const fallbackPhoto = postData.url;
        if (postData.preview && postData.preview.images && postData.preview.images.length > 0) {
            const resolutions = postData.preview.images[0].resolutions;
            if (resolutions && resolutions.length > 0) {
                const previews = resolutions
                    .filter(resolution => resolution.width >= 300);
                let preview;
                if (previews && previews.length > 0) {
                    preview = previews
                        .reduce((prev, curr) => prev.width > curr.width ? curr : prev);
                }

                if (preview && preview.url) {
                    return preview.url.replaceAll('amp;', '');
                }
            }
        }

        return fallbackPhoto;
    }

    function getPhotos() {
        setSubmittedQuery(false);
        let apiUrl = `${baseApiUrl + subreddit}.json`;
        let hasQuery = false;
        if (query) {
            apiUrl = getQueryUrl();
            hasQuery = true;
        }
        if (lastElement) {
            apiUrl += `${hasQuery ? '&' : '?'}after=${lastElement}`
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
                            preview: getPreviewPhoto(post.data),
                            url: post.data.url,
                            permalink: `https://www.reddit.com/${post.data.permalink}`,
                        } as Image;
                    });

                if (!lastElement) {
                    setImages(newImages);
                } else {
                    setImages(images => [...images, ...newImages]);
                }

                if (data.after && newImages && newImages.length > 0) {
                    setLastElement(data.after);
                    setHasMore(true);
                } else {
                    setHasMore(false);
                }
            }).catch(() => {
                setImages([]);
                setHasMore(false);
                setLastElement('');
            });
    }


    function handleSubmit(e: Event) {
        e.preventDefault();
        setLastElement('');
        setSubmittedQuery(true);
    }

    function handleSearchInputChange(newValue: string) {
        setQuery(newValue);
    }

    function handleSubredditInputChange(data: DropdownProps) {
        setSubreddit(data.value!.toString().replaceAll('r/', ''));
        setLastElement('');
        setSubmittedQuery(true);
    }

    return (
        <div>
            <div className="search-container">
                <form onSubmit={event => handleSubmit(event.nativeEvent)} >
                    <Input
                        className="form"
                        type="text"
                        action="Go!"
                        icon='search'
                        iconPosition='left'
                        placeholder="Search for wallpapers"
                        autoComplete='off' spellCheck='false' autoCorrect='off'
                        onChange={event => handleSearchInputChange(event.target.value)}
                        value={query} />
                </form>
                <form>
                    <Dropdown
                        className="form"
                        placeholder={subreddit}
                        search
                        selection
                        options={dropdownOptions}
                        onChange={(_, data) => handleSubredditInputChange(data)}
                        value={subreddit}
                        allowAdditions />
                </form>
                <div className="license-container">
                    <p className="license">All credits to the <a href="https://reddit.com/">Reddit</a> site and its users</p>
                </div>
            </div>
            <ImageGrid images={images} next={() => setPage(page => page + 1)} hasMore={hasMore} />
        </div>

    );
}

export default InputForm;