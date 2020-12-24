import React from 'react'
import axios from 'axios'
import './story.css'
import Zuck from 'zuck.js'
import './story.css'

import {SERVER_BASE_URL} from '../config/config.js'
export default class Story extends React.Component {
        
    constructor(props){
        super(props);
        this.storiesElement = null;
        this.storiesApi = null;

        this.state = {
            result: [],
            stories:[],
            error:false
        };  
    }

    timestamp = function(visiAt) {    
        let last = Date.parse(visiAt);
        return last/1000 ;
    };

    callMeNext = () => {
      let currentSkin = {
        Snapgram: {
          avatars: true,
          list: false,
          autoFullScreen: false,
          cubeEffect: false,
          paginationArrows: false
        },
    
        VemDeZAP: {
          avatars: false,
          list: true,
          autoFullScreen: false,
          cubeEffect: false,
          paginationArrows: true
        },
    
        FaceSnap: {
          avatars: true,
          list: false,
          autoFullScreen: true,
          cubeEffect: false,
          paginationArrows: true
        },
    
        Snapssenger: {
          avatars: false,
          list: false,
          autoFullScreen: false,
          cubeEffect: false,
          paginationArrows: false
        }
      };

      this.storiesApi = new Zuck(this.storiesElement, {
        backNative: true,
        previousTap: true,
        skin: 'Snapgram',
        autoFullScreen: currentSkin['Snapgram']['autoFullScreen'],
        avatars: currentSkin['Snapgram']['avatars'],
        paginationArrows: currentSkin['Snapgram']['paginationArrows'],
        list: currentSkin['Snapgram']['list'],
        cubeEffect: currentSkin['Snapgram']['cubeEffect'],
        localStorage: true, // Will store if that person has already viewed the status or not
        stories: this.state.stories,
        reactive: true,
        callbacks: {
          onDataUpdate: function (currentState, callback) {
            this.setState(state => {
              state.stories = currentState;

              return state;
            }, () => {
              callback();
            });
          }.bind(this)
        }
      });
    }


    componentDidMount = async () => {
      
        const data = await axios.get('https://vortex.nitt.edu/api/story/techie-tuesdays');
        const result = data.data.data;

        let stories = result.map((tt, id) => {

          let Items = tt.slides.map((Item, id)=>{
            return [  tt.title + id, "photo", 5, `${SERVER_BASE_URL}`+ Item.path, `${SERVER_BASE_URL}`+ Item.path, '', false, false, this.timestamp(Item.visibleAt)];
          })
            return  Zuck.buildTimelineItem(
              id,
              Items[0][3],//Profile Pic for each one
              tt.title,
              "",
              Items[0][9],
              Items
            );
        })
        await this.setState({stories:stories,value:true}, ()=>{this.callMeNext();});
    }
    render() {
      const timelineItems = []

          this.state.stories.forEach((story, storyId) => {
            const storyItems = [];

            story.items.forEach((storyItem) => {
              storyItems.push(
                <li key={storyItem.id} data-id={storyItem.id} data-time={storyItem.time} className={(storyItem.seen ? 'seen' : '')}>
                    <a href={storyItem.src} data-type={storyItem.type} data-length={storyItem.length} data-link={storyItem.link} data-linkText={storyItem.linkText}>
                        <img src={storyItem.preview} />
                    </a>
                </li>
              );
            });
          
            let arrayFunc = story.seen ? 'push' : 'unshift';
            timelineItems[arrayFunc](
              <div className={(story.seen ? 'story seen' : 'story')} key={storyId} data-id={storyId} data-last-updated={story.lastUpdated} data-photo={story.photo}>
                <a className="item-link" href={story.link}>
                  <span className="item-preview">
                    <img src={story.photo} />
                  </span>
                  <span className="info" itemProp="author" itemScope="" itemType="http://schema.org/Person">
                    <strong className="name" itemProp="name">{story.name}</strong>
                    <span className="time">{story.lastUpdated}</span>
                  </span>
                </a>
                
                <ul className="items">
                    {storyItems}
                </ul>
              </div>
            );
          });

          return (
            <div>
              {!this.state.error?
                <div ref={node => this.storiesElement = node}  id="stories-react" className="storiesWrapper">
                          {timelineItems}
                </div>
              :null}
            </div>
          );    
    }
}

    