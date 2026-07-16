import React, { useState } from 'react';
import Dialog from '@rc-component/dialog';
import Image from '@rc-component/image';
import '@rc-component/dialog/assets/index.css';
import '../../assets/index.less';

const App: React.FC = () => {
  const [show, setShow] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          setShow(true);
        }}
      >
        showModal
      </button>
      <Dialog
        visible={show}
        afterOpenChange={open => {
          setShow(open);
        }}
        onClose={() => {
          setShow(false);
        }}
        footer={
          <>
            <button
              onClick={() => {
                setShow(false);
              }}
            >
              Cancel
              </button>
            <button
              onClick={() => {
                setShow(false);
              }}
            >
              OK
            </button>
          </>
        }
      >
        <Image
          width={200}
          alt="svg image"
          src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        />
        <Image.PreviewGroup
          preview={{
            onChange: (current, prev) =>
              console.log(`current index: ${current}, prev index: ${prev}`),
          }}
        >
          <Image
            width={200}
            alt="svg image"
            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
          />
          <Image
            width={200}
            src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
          />
        </Image.PreviewGroup>
      </Dialog>
    </>
  );
};

export default App;
