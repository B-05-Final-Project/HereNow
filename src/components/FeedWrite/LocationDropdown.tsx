import { useEffect, useState } from 'react';

type LocationDropdownProps = {
  region: string;
  sigungu: string;
  setRegion: (value: string) => void;
  setSigungu: (value: string) => void;
};

const LocationDropdown = ({
  region,
  sigungu,
  setRegion,
  setSigungu,
}: LocationDropdownProps) => {
  const [regionsData, setRegionsData] = useState<{ [key: string]: string[] }>(
    {},
  );

  useEffect(() => {
    // JSON 파일에서 데이터를 불러옴
    const fetchRegions = async () => {
      try {
        const response = await fetch('/regions.json');
        const data = await response.json();
        setRegionsData(data);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };

    fetchRegions();
  }, []);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegion(e.target.value);
    setSigungu(''); // 시/군/구를 선택할 때마다 기존 선택된 시/군/구 초기화
  };

  const handleSigunguChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSigungu(e.target.value);
  };

  return (
    <>
      <select
        value={region}
        onChange={handleRegionChange}
        className="input no-focus"
      >
        <option value="">시/도 선택</option>
        {Object.keys(regionsData).map((regionName) => (
          <option key={regionName} value={regionName}>
            {regionName}
          </option>
        ))}
      </select>

      {region && (
        <select
          value={sigungu}
          onChange={handleSigunguChange}
          className="input no-focus mt-2"
        >
          <option value="">시/군/구 선택</option>
          {regionsData[region].map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      )}
    </>
  );
};

export default LocationDropdown;
