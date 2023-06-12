import Image from 'rc-image';
import '../../assets/index.less';

export default function PreviewGroup() {
  return (
    <div>
      <Image.PreviewGroup
        preview={{
          countRender: (current, total) => `第${current}张 / 总共${total}张`,
          onChange: (current, prev) =>
            console.log(`当前第${current}张，上一次第${prev === undefined ? '-' : prev}张`),
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
  );
}
