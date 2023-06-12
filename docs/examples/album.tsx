import Image from 'rc-image';
import '../../assets/index.less';

export default function PreviewGroup() {
  return (
    <div>
      <Image.PreviewGroup>
        <Image src={require('./images/1.jpeg')} />
        <Image preview={{ showOnlyInPreview: true }} src={require('./images/2.jpeg')} />
        <Image src={require('./images/3.jpeg')} />
        <Image preview={{ showOnlyInPreview: true }} src={require('./images/1.jpeg')} />
      </Image.PreviewGroup>
    </div>
  );
}
