'use client';
import Header from '@/components/MainPage/Header';
import Main from '@/components/MainPage/Main';
import useAuthStore from '@/zustand/useAuthStore';
function Home() {
  const { user } = useAuthStore();
  console.log(user);
  return (
    <>
      <Header
        title={user ? `${user.nickname}님만의` : '여러분만의'}
        content="맛집, 여행지를 공유해주세요!"
      />
      <Main />
    </>
  );
}
export default Home;
