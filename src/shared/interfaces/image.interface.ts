interface Image {
    key: string;
    author: string;
    score: number;
    subreddit: string; // subreddit_name_prefixed
    title: string;
    url: string;
    preview: string;
    permalink: string;
}

export default Image;