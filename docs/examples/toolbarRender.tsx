import * as React from 'react';
import Image from '@/index';
import '../../assets/index.less';

export default function Base() {
  return (
    <div>
      <h1>default usage</h1>
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width={200}
        style={{
          marginRight: 24,
        }}
        onClick={() => {
          console.log('click');
        }}
        preview={{
          onVisibleChange: visible => {
            console.log('visible', visible);
          }
        }}
      />
      <h1>toolbarRender = false</h1>
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width={200}
        style={{
          marginRight: 24,
        }}
        onClick={() => {
          console.log('click');
        }}
        preview={{
          onVisibleChange: visible => {
            console.log('visible', visible);
          },
          toolbarRender: false
        }}
      />
      <h1>basic usage</h1>
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width={200}
        style={{
          marginRight: 24,
        }}
        onClick={() => {
          console.log('click');
        }}
        preview={{
          onVisibleChange: visible => {
            console.log('visible', visible);
          },
          toolbarRender: ({ rotateLeft, rotateRight, close, zoomIn, zoomOut }) => {
            return (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
                <a onClick={rotateLeft}>left</a>
                <a onClick={rotateRight}>right</a>
                <a onClick={zoomIn}>zoomIn</a>
                <a onClick={zoomOut}>zoomOut</a>
                <a onClick={close}>close</a>
              </div>
            );
          },
        }}
      />
      <h1>preview group default usage</h1>
      <div>
        <Image.PreviewGroup
          preview={{
            countRender: (current, total) => `第${current}张 / 总共${total}张`,
          }}
        >
          <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/1.jpeg')} />
          <Image
            wrapperStyle={{ marginRight: 24, width: 200 }}
            preview={false}
            src={require('./images/disabled.jpeg')}
          />
          <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/2.jpeg')} />
          <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/3.jpeg')} />
          <Image wrapperStyle={{ marginRight: 24, width: 200 }} src="error" alt="error" />
          <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/1.jpeg')} />
        </Image.PreviewGroup>
      </div>
      <h1>preview group toobarRender = false</h1>
      <div>
        <Image.PreviewGroup
          preview={{
            // countRender: (current, total) => `第${current}张 / 总共${total}张`,
            toolbarRender: false
          }}
        >
          <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/1.jpeg')} />
          <Image
            wrapperStyle={{ marginRight: 24, width: 200 }}
            preview={false}
            src={require('./images/disabled.jpeg')}
          />
          <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/2.jpeg')} />
          <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/3.jpeg')} />
          <Image wrapperStyle={{ marginRight: 24, width: 200 }} src="error" alt="error" />
          <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/1.jpeg')} />
        </Image.PreviewGroup>
      </div>
      <h1>preview group usage</h1>
      <div>
        <Image.PreviewGroup
          preview={{
            toolbarRender: ({ rotateLeft, rotateRight, close, zoomIn, zoomOut, current, total }) => {
              return (
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-around',
                  }}
                >
                  <a onClick={rotateLeft}>left</a>
                  <a onClick={rotateRight}>right</a>
                  <a onClick={close}>close</a>
                  <a onClick={zoomIn}>zoomIn</a>
                  <a onClick={zoomOut}>zoomOut</a>
                  <span>{current}/{total}</span>
                </div>
              );
            },
          }}
        >
          <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/1.jpeg')} />
          <Image
            wrapperStyle={{ marginRight: 24, width: 200 }}
            preview={false}
            src={require('./images/disabled.jpeg')}
          />
          <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/2.jpeg')} />
          <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/3.jpeg')} />
          <Image wrapperStyle={{ marginRight: 24, width: 200 }} src="error" alt="error" />
          <Image wrapperStyle={{ marginRight: 24, width: 200 }} src={require('./images/1.jpeg')} />
        </Image.PreviewGroup>
      </div>
    </div>
  );
}
