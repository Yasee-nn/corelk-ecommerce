// import BrandSlider from '../components/BrandSlider'
import Category from '../components/Category'
import Hero from '../components/Hero'
import Newsletter from '../components/Newsletter'
import RecentProducts from '../components/RecentProducts'
import TitleBar from '../components/TitleBar'
import { Meta } from 'react-router-dom'

function Home() {

  // useEffect(() => {
  //   document.title = "Core.lk"

  //   const description = document.querySelector('meta[name = "description"]')

  //   description?.setAttribute(
  //     "content",
  //     "Smarter accessories for work, gaming, and more all in one place."
  //   )
  // }, [])

  return (
    <>
      <Hero />
      <Category />
      <RecentProducts />
      {/* <BrandSlider/> */}
      <Newsletter />
    </>
  )
}
export default Home