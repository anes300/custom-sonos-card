import { HomeAssistant } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket';
import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import Store from '../store';
import { CardConfig } from '../types';
import { getCurrentTrack, getSpeakerList, openSpotify } from '../utils';
import { styleMap } from 'lit-html/directives/style-map.js';
import {
  mdiSpotify,
} from '@mdi/js';
import { iconButton } from './icon-button';

class PlayerHeader extends LitElement {
  @property() store!: Store;
  private hass!: HomeAssistant;
  private config!: CardConfig;
  private entity!: HassEntity;

  render() {
    ({ config: this.config, hass: this.hass, entity: this.entity } = this.store);
    const attributes = this.entity.attributes;
    const speakerList = getSpeakerList(this.store.groups[this.entity.entity_id], this.config);
    let song = this.config.labelWhenNoMediaIsSelected ? this.config.labelWhenNoMediaIsSelected : 'No media selected';
    if (attributes.media_title) {
      song = getCurrentTrack(this.entity);
    }
    return html` <div style="${this.infoStyle()}">
      <div style="${this.spotifyStyle()}">${iconButton(mdiSpotify, this.spotify)}</div>
      <div style="${this.entityStyle()}">${speakerList}</div>
      <div style="${this.songStyle()}">${song}</div>
      <div style="${this.artistAlbumStyle()}">${attributes.media_album_name}</div>
      <sonos-progress .store=${this.store}></sonos-progress>
    </div>`;
  }

  private spotify = () => openSpotify(this.hass);

  private spotifyStyle() {
    return styleMap({
      position: 'absolute',
      top: '0.25rem',
      left: '0.25rem',
    });
  }
  
  private infoStyle() {
  return styleMap({
    margin: '0.25rem',
    padding: '0.5rem 3.5rem',
    textAlign: 'center',
    position: 'relative',
    paddingLeft: '2.5rem', // Adjust the value based on the size of the Spotify logo/button
  });
}

  private entityStyle() {
    return styleMap({
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: '1rem',
      fontWeight: '500',
      color: 'var(--secondary-text-color)',
      whiteSpace: 'nowrap',
    });
  }

  private songStyle() {
    return styleMap({
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: '1.15rem',
      fontWeight: '400',
      color: 'var(--accent-color)',
      whiteSpace: 'wrap',
    });
  }

  private artistAlbumStyle() {
    return styleMap({
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: '1rem',
      fontWeight: '300',
      color: 'var(--secondary-text-color)',
      whiteSpace: 'wrap',
    });
  }
}

customElements.define('sonos-player-header', PlayerHeader);
