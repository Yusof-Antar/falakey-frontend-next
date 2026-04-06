'use client';
const GuideLineItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center gap-2 text-md text-gray-700 w-fit mx-auto">
    <i className="fa-regular fa-circle-check text-secondary" />
    <span>{text}</span>
  </div>
);

export default GuideLineItem;
