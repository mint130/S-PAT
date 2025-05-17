interface TitleProps {
  text: string;
  subText: string;
}

function Title({ text, subText }: TitleProps) {
  return (
    <div className="flex flex-col">
      <div className="font-pretendard font-bold text-primary-black dark:text-[#EDF0F4] text-title mb-1">
        {text}
      </div>
      <div className="font-samsung400 text-primary-gray dark:text-[#ACB4C0] text-subtitle">
        {subText}
      </div>
    </div>
  );
}

export default Title;
