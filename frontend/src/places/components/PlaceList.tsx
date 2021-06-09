import React from 'react'
import Card from '../../shared/components/UIElements/Card';
import PlaceItem from './PlaceItem';
import './PlaceList.css';

export interface IPlaceProperties {
    key?: string
    id: string
    title: string
    description: string
    imageUrl: string
    address: string
    location: any
    creator: string
}
export interface IPlaceList {
    items: IPlaceProperties[]
}
function PlaceList(props: IPlaceList) {
	if (props.items.length === 0) {
        return (
          <div className="place-list center">
            <Card>
              <h2>No places found. Maybe create one?</h2>
              <button>Share Place</button>
            </Card>
          </div>
        );
      }
      return (
        <ul className="place-list">
          {props.items.map(place => (
            <PlaceItem
              key={place.id}
              id={place.id}
              imageUrl={place.imageUrl}
              title={place.title}
              description={place.description}
              address={place.address}
              creator={place.creator}
              location={place.location}
            />
          ))}
        </ul>
      );
}
export default PlaceList