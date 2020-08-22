import * as React from 'react';
import Image from '../src';
import '../assets/index.less';

export default function Base() {
  const [random, setRandom] = React.useState(Date.now());
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setRandom(Date.now());
        }}
      >
        Reload
      </button>
      <h1>Default placeholder</h1>
      <div>
        <Image
          // eslint-disable-next-line global-require
          src={`${require('./demo1.png')}?random=${random}`}
          width={400}
          placeholder
        />
      </div>

      <br />
      <h1>Custom placeholder</h1>
      <Image
        // eslint-disable-next-line global-require
        src={`${require('./demo1.png')}?random=${random + 1}`}
        width={400}
        placeholder={
          <Image
            width="100%"
            height="100%"
            preview={false}
            src="data:image/jpeg;base64,/9j/2wCEACgcHiMeGSgjISMtKygwPGRBPDc3PHtYXUlkkYCZlo+AjIqgtObDoKrarYqMyP/L2u71////m8H////6/+b9//gBKy0tPDU8dkFBdviljKX4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+P/AABEIADAAPAMBIgACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AJLmGRoTJM2X7KOgqht4rZu2CW5znnjise4YKnHBOMVJQxlPYUyplD7CSrEY64qNVbYzBunNADRR0xnvzTsu0edxJ7CmZ3MOuRxzTENI4/Gkpx7UmKAL89w8pyzH6dqruQcFhnFaC2OIWaUncASFFZ0iho9oI3den6Uhk4unaCRegCjAAqBQpG3HQEnmhOI5B32nNEXMh/3D/I0CGruO1gpGeRikZi3XHXr3qe2cFFVjjA/OmToEbrgE5waLgQn7wozSk5AFMpgdHcgtbSheu04rB6DFbDtLPGxH7uLHU9W/wrIcYyKAELkZGOq4NOiP73j+4R+hqKhXKNuGOmOaAHR48sndggce9IJC2S43HGAT2pvQCkzQA5eCxY5yOBUdOJpKAP/Z"
          />
        }
      />
    </div>
  );
}
