import React, { useState } from 'react';
import { Button, Divider } from 'antd';
import Dialog from '@rc-component/dialog';
import Image from '@rc-component/image';
import '@rc-component/dialog/assets/index.css';
import '../../assets/index.less';

const App: React.FC = () => {
  const [show, setShow] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setShow(true);
        }}
      >
        showModal
      </Button>
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
            <Button
              onClick={() => {
                setShow(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setShow(false);
              }}
            >
              OK
            </Button>
          </>
        }
      >
        <Image
          width={200}
          alt="svg image"
          src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        />
        <Divider />
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
