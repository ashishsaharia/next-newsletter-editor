import HomeSideBar from '../components/home/HomeSideBar'
import Banner from '../components/home/Banner'
import Header from '../components/home/Header'
export default function Home() {
  return (
      <div className="flex min-h-screen bg-white">
        <HomeSideBar></HomeSideBar>
        <div className='flex flex-1 flex-col ml-[72px]'>
          <Header></Header>
          <main className='flex-1 p-6 overflow-y-auto pt-20'>
            <Banner/>
          </main>
        </div>
      </div>
  );
}
