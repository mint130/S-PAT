interface TitleProps {
  text: string;
  subText: string;
}

function Title({ text, subText }: TitleProps) {
  return (
    <div className="flex flex-col">
      <div className="font-pretendard text-primary-black text-title">
        {text}
      </div>
      <div className="font-samsung400 text-primary-gray text-subtitle">
        {subText}
      </div>
    </div>
  );
}

export default Title;
