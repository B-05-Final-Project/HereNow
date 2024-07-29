import React from 'react';

type ContentTypeFilterProps = {
  selectedContentType: string;
  onContentTypeChange: (contentType: string) => void;
};

const contentTypes = [
  { id: '12', name: '관광지' },
  { id: '14', name: '문화시설' },
  { id: '15', name: '행사' },
  { id: '39', name: '맛집' },
];

const ContentTypeFilter: React.FC<ContentTypeFilterProps> = ({
  selectedContentType,
  onContentTypeChange,
}) => {
  return (
    <div className="font-pretendard font-semibold text-sm border-solid flex justify-center overflow-x-auto whitespace-nowrap mb-4 px-4">
      {contentTypes.map((type) => (
        <button
          key={type.id}
          className={`px-4 py-2 mr-2 rounded-full border-[2px] ${
            selectedContentType === type.id
              ? 'border-[#118DFF] bg-[#DBEEFF] text-[#111111]'
              : 'border-[#7D8591] bg-white text-[#505050]'
          }`}
          onClick={() => onContentTypeChange(type.id)}
        >
          {type.name}
        </button>
      ))}
    </div>
  );
};

export default ContentTypeFilter;
