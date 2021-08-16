import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Loader from '../Loader/Loader';
import EndMessage from '../EndMessage/EndMessage';
import Image from '../../shared/interfaces/image.interface';

import './image-grid.css';

interface ImageGridProps {
  images: Image[];
  next: () => void;
  hasMore: boolean;
}

class ImageGrid extends React.Component<ImageGridProps>{
    render(){
        return(
         <div className="grid-container">
          <InfiniteScroll style={{overflow: 'hidden'}} dataLength={this.props.images.length} next={this.props.next} hasMore={this.props.hasMore} loader={<Loader/>} endMessage={<EndMessage/>}>
            <div className="image-grid">
              {this.props.images.map(image => (
                <div className="image">
                  <a href={image.url} target="_blank" rel="noopener noreferrer" >
                  <img 
                    key={image.key}
                    src={image.url}
                    alt={image.title}
                    title={`"${image.title}" by ${image.author} in ${image.subreddit} (Score: ${image.score})`} />
                </a>
                </div>
              ))}
            </div>
          </InfiniteScroll>
         </div>
        )
    }
}

export default ImageGrid;